package com.akashgpt.saasprint.service;

import com.akashgpt.saasprint.impl.QRServiceImpl;
import com.akashgpt.saasprint.exception.ResourceNotFoundException;
import com.akashgpt.saasprint.model.db.*;
import com.akashgpt.saasprint.repository.*;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.server.ResponseStatusException;
import java.awt.image.BufferedImage;
import java.time.Instant;
import java.util.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class QRPaymentFlowTest {
    @Mock UserRepo users;
    @Mock QRCodeRepo codes;
    @Mock DocumentService documents;
    @Mock FileUploadService storage;
    @Mock QrPaymentGateway payments;
    QRServiceImpl service;
    User user;
    QRCode qr;

    @BeforeEach void setup() {
        service = new QRServiceImpl(documents, users, codes, storage, payments, "http://localhost:3000", 1000);
        user = new User(); user.setId(UUID.randomUUID()); user.setUsername("shop");
        qr = new QRCode(); qr.setId(UUID.randomUUID()); qr.setUser(user); qr.setName("Front counter");
        qr.setPaymentOrderId("order_owned");
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken("shop", null, List.of()));
        when(users.findByUsername("shop")).thenReturn(user);
    }

    @AfterEach void cleanup() { SecurityContextHolder.clearContext(); }
    void owned() { when(codes.findOwnedForUpdate(qr.getId(), user.getId())).thenReturn(Optional.of(qr)); }

    @Test void unpaidQrCannotGenerateOrUpload() {
        owned();
        var error = assertThrows(ResponseStatusException.class, () -> service.generateQR(qr.getId()));
        assertEquals(402, error.getStatusCode().value());
        verifyNoInteractions(documents, storage);
        verify(codes, never()).saveAndFlush(any());
    }

    @Test void anotherUsersQrCannotGenerate() {
        when(codes.findOwnedForUpdate(qr.getId(), user.getId())).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> service.generateQR(qr.getId()));
        verifyNoInteractions(storage, documents);
    }

    @Test void verifiedCaptureMarksPaidBeforeSeparateGeneration() throws Exception {
        owned();
        var proof = new QrPaymentGateway.Proof("order_owned", "pay_owned", "signature");
        when(payments.verifiedPayment("order_owned", 1000, "INR", proof))
                .thenReturn(new QrPaymentGateway.Payment("pay_owned", "order_owned", "captured", 1000, "INR", 0));
        service.verifyPayment(qr.getId(), proof);
        verify(payments).verifiedPayment("order_owned", 1000, "INR", proof);
        assertEquals(QRPaymentStatus.PAID, qr.getPaymentStatus());
        assertEquals("pay_owned", qr.getPaymentId()); assertNotNull(qr.getPaidAt());
        assertNull(qr.getGeneratedAt()); assertFalse(qr.isActive());
        verifyNoInteractions(storage, documents);
    }

    @Test void badSignatureCannotMarkPaid() {
        owned();
        var proof = new QrPaymentGateway.Proof("wrong_order", "pay_owned", "bad");
        doThrow(new IllegalArgumentException("Invalid signature")).when(payments).verifiedPayment("order_owned", 1000, "INR", proof);
        assertThrows(IllegalArgumentException.class, () -> service.verifyPayment(qr.getId(), proof));
        assertEquals(QRPaymentStatus.PENDING, qr.getPaymentStatus());
        verify(codes, never()).saveAndFlush(any());
    }

    @Test void uncapturedPaymentLeavesQrPending() {
        owned();
        when(payments.verifiedPayment("order_owned", 1000, "INR", null))
                .thenThrow(new ResponseStatusException(org.springframework.http.HttpStatus.CONFLICT));
        assertThrows(ResponseStatusException.class, () -> service.verifyPayment(qr.getId(), null));
        assertEquals(QRPaymentStatus.PENDING, qr.getPaymentStatus());
    }

    @Test void paidGenerationIsRetryableAndDoesNotCreateAnotherRecord() throws Exception {
        owned(); qr.setPaymentStatus(QRPaymentStatus.PAID);
        var image = new BufferedImage(2, 2, BufferedImage.TYPE_INT_RGB);
        String destination = "http://localhost:3000/upload/" + user.getId();
        when(documents.generateQRCode(destination)).thenReturn(image);
        when(storage.uploadFile(image, "qr/" + qr.getId() + ".png")).thenReturn("https://storage.example/qr.png");
        service.generateQR(qr.getId()); service.generateQR(qr.getId());
        assertTrue(qr.isActive()); assertNotNull(qr.getGeneratedAt());
        verify(storage, times(1)).uploadFile(any(BufferedImage.class), anyString());
        verify(codes, times(1)).saveAndFlush(qr);
    }

    @Test void storageFailureKeepsPaidRecordReadyForRetry() throws Exception {
        owned(); qr.setPaymentStatus(QRPaymentStatus.PAID);
        when(documents.generateQRCode(anyString())).thenReturn(new BufferedImage(2, 2, BufferedImage.TYPE_INT_RGB));
        when(storage.uploadFile(any(BufferedImage.class), anyString())).thenThrow(new IllegalStateException("Unavailable"));
        assertThrows(IllegalStateException.class, () -> service.generateQR(qr.getId()));
        assertEquals(QRPaymentStatus.PAID, qr.getPaymentStatus()); assertNull(qr.getGeneratedAt());
    }

    @Test void eachOrderCreatesItsOwnPendingQrAtServerPrice() {
        when(payments.createOrder(eq(1000), eq("INR"), anyString()))
                .thenReturn(new QrPaymentGateway.Order("order_one", 1000, "INR"))
                .thenReturn(new QrPaymentGateway.Order("order_two", 1000, "INR"));
        service.createOrder("Counter one"); service.createOrder("Counter two");
        var saved = org.mockito.ArgumentCaptor.forClass(QRCode.class);
        verify(codes, times(2)).saveAndFlush(saved.capture());
        assertNotSame(saved.getAllValues().get(0), saved.getAllValues().get(1));
        for (QRCode record : saved.getAllValues()) {
            assertEquals(user, record.getUser()); assertEquals(1000, record.getAmountPaise());
            assertEquals(QRPaymentStatus.PENDING, record.getPaymentStatus()); assertFalse(record.isActive());
        }
    }
}
