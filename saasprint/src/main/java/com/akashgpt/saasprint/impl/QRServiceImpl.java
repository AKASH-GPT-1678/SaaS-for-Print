package com.akashgpt.saasprint.impl;

import com.akashgpt.saasprint.exception.ResourceNotFoundException;
import com.akashgpt.saasprint.model.db.*;
import com.akashgpt.saasprint.model.response.QRCodeResponse;
import com.akashgpt.saasprint.repository.*;
import com.akashgpt.saasprint.service.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.time.Instant;
import java.util.*;

@Service
public class QRServiceImpl implements QRService {
    private final DocumentService documents;
    private final UserRepo users;
    private final QRCodeRepo codes;
    private final FileUploadService storage;
    private final QrPaymentGateway payments;
    private final String frontend;
    private final int price;

    public QRServiceImpl(DocumentService documents, UserRepo users, QRCodeRepo codes,
            FileUploadService storage, QrPaymentGateway payments,
            @Value("${app.frontend-base-url:http://localhost:3000}") String frontend,
            @Value("${app.qr-price-paise:${QR_PRICE_PAISE:1000}}") int price) {
        this.documents = documents; this.users = users; this.codes = codes;
        this.storage = storage; this.payments = payments; this.frontend = frontend; this.price = price;
        if (price < 100) throw new IllegalArgumentException("QR price must be at least 100 paise");
    }

    private User owner() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated())
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authentication required");
        User user = users.findByUsername(auth.getName());
        if (user == null) throw new ResourceNotFoundException("User not found");
        return user;
    }

    private QRCode locked(UUID id) {
        return codes.findOwnedForUpdate(id, owner().getId())
                .orElseThrow(() -> new ResourceNotFoundException("QR code not found"));
    }

    public record Checkout(UUID qrId, String orderId, String keyId, int amount, String currency) {}

    @Transactional
    public Checkout createOrder(String name) {
        User user = owner();
        QRCode qr = new QRCode();
        qr.setUser(user); qr.setName(name.trim()); qr.setAmountPaise(price); qr.setCurrency("INR");
        var order = payments.createOrder(price, "INR", UUID.randomUUID().toString());
        qr.setPaymentOrderId(order.id());
        codes.saveAndFlush(qr);
        return checkout(qr);
    }

    private Checkout checkout(QRCode qr) {
        return new Checkout(qr.getId(), qr.getPaymentOrderId(), payments.keyId(), qr.getAmountPaise(), qr.getCurrency());
    }

    @Transactional(readOnly = true)
    public Checkout checkout(UUID id) {
        QRCode qr = codes.findByIdAndUser_Id(id, owner().getId())
                .orElseThrow(() -> new ResourceNotFoundException("QR code not found"));
        if (qr.getPaymentStatus() != QRPaymentStatus.PENDING || qr.getPaymentOrderId() == null)
            throw new ResponseStatusException(HttpStatus.CONFLICT, "This QR does not need a new checkout");
        return checkout(qr);
    }

    @Transactional
    public QRCodeResponse verifyPayment(UUID id, QrPaymentGateway.Proof proof) throws Exception {
        QRCode qr = locked(id);
        if (qr.getPaymentStatus() == QRPaymentStatus.PAID) return view(qr);
        if (qr.getPaymentStatus() != QRPaymentStatus.PENDING || qr.getPaymentOrderId() == null)
            throw new ResponseStatusException(HttpStatus.CONFLICT, "No pending payment for this QR");
        var payment = payments.verifiedPayment(qr.getPaymentOrderId(), qr.getAmountPaise(), qr.getCurrency(), proof);
        qr.setPaymentId(payment.id());
        qr.setPaymentStatus(QRPaymentStatus.PAID);
        qr.setPaidAt(Instant.now());
        codes.saveAndFlush(qr);
        return view(qr);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public BufferedImage generateQR(UUID id) throws Exception {
        QRCode qr = locked(id);
        if (qr.getPaymentStatus() != QRPaymentStatus.PAID)
            throw new ResponseStatusException(HttpStatus.PAYMENT_REQUIRED, "Verified payment is required before QR generation");
        // Repeating a request for an already generated QR returns the same code.
        if (qr.getGeneratedAt() != null) return documents.generateQRCode(qr.getQrCodeUrl());
        String destination = frontend.replaceAll("/$", "") + "/upload/" + qr.getUser().getId();
        BufferedImage image = documents.generateQRCode(destination);
        String imageUrl = storage.uploadFile(image, "qr/" + qr.getId() + ".png");
        qr.setQrCodeUrl(destination); qr.setQrStorageUrl(imageUrl);
        qr.setGeneratedAt(Instant.now()); qr.setActive(true);
        codes.saveAndFlush(qr);
        return image;
    }

    @Transactional(readOnly = true)
    public List<QRCodeResponse> list() throws Exception {
        var result = new ArrayList<QRCodeResponse>();
        for (QRCode qr : codes.findAllByUser_IdOrderByCreatedAtDesc(owner().getId())) result.add(view(qr));
        return result;
    }

    private QRCodeResponse view(QRCode qr) throws Exception {
        String image = null;
        if (qr.getGeneratedAt() != null && qr.getPaymentStatus() == QRPaymentStatus.PAID) {
            var bytes = new ByteArrayOutputStream();
            ImageIO.write(documents.generateQRCode(qr.getQrCodeUrl()), "PNG", bytes);
            image = "data:image/png;base64," + Base64.getEncoder().encodeToString(bytes.toByteArray());
        }
        return new QRCodeResponse(qr.getId(), qr.getName(), qr.getQrCodeUrl(), qr.isActive(),
                qr.getPaymentStatus(), qr.getCreatedAt(), qr.getGeneratedAt(), image, qr.getAmountPaise(), qr.getCurrency());
    }
}
