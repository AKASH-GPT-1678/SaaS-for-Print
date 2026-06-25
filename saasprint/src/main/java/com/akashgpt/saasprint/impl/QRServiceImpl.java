package com.akashgpt.saasprint.impl;

import com.akashgpt.saasprint.model.db.User;
import com.akashgpt.saasprint.model.response.QRTokensResponse;
import com.akashgpt.saasprint.repository.UserRepo;
import com.akashgpt.saasprint.service.DocumentService;
import com.akashgpt.saasprint.service.FileUploadService;
import com.akashgpt.saasprint.service.QRService;

import software.amazon.awssdk.services.s3.S3Client;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import java.util.UUID;
import java.awt.image.BufferedImage;
import org.springframework.beans.factory.annotation.Value;

@Service
public class QRServiceImpl implements QRService {

    @Autowired
    private DocumentService documentService;
    @Autowired
    private UserRepo userRepo;

    @Autowired
    private FileUploadService fileUploadService;

    @Value("${spring.mode}")
    private String mode;

    @Override
    public BufferedImage generateQR() throws Exception {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        String name = authentication.getName();

        User user = userRepo.findByUsername(name);

        UUID uuid = user.getId();

        String url = mode.equals("development")
                ? "http://localhost:3000/chat/" + uuid
                : "https://saa-s-for-print.vercel.app/chat/" + uuid;

        user.setQrCodeUrl(url);

        BufferedImage qrCode = documentService.generateQRCode(url);

        String qrCodeUrl = fileUploadService.uploadBufferedImage(qrCode, "qr" + uuid + "url");
        user.setQrCodeUrl(qrCodeUrl);
        userRepo.save(user);
        return documentService.generateQRCode(url);
    }

}
