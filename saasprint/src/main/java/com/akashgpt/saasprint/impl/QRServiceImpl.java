package com.akashgpt.saasprint.impl;

import com.akashgpt.saasprint.exception.ResourceNotFoundException;
import com.akashgpt.saasprint.model.db.User;
import com.akashgpt.saasprint.repository.UserRepo;
import com.akashgpt.saasprint.service.DocumentService;
import com.akashgpt.saasprint.service.FileUploadService;
import com.akashgpt.saasprint.service.QRService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.awt.image.BufferedImage;
import java.util.UUID;

@Service
public class QRServiceImpl implements QRService {

    private final DocumentService documentService;
    private final UserRepo userRepo;
    private final FileUploadService fileUploadService;
    private final String frontendBaseUrl;

    public QRServiceImpl(
            DocumentService documentService,
            UserRepo userRepo,
            FileUploadService fileUploadService,
            @Value("${app.frontend-base-url:http://localhost:3000}") String frontendBaseUrl
    ) {
        this.documentService = documentService;
        this.userRepo = userRepo;
        this.fileUploadService = fileUploadService;
        this.frontendBaseUrl = frontendBaseUrl;
    }

    @Override
    public BufferedImage generateQR() throws Exception {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResourceNotFoundException("User is not authenticated");
        }

        User user = userRepo.findByUsername(authentication.getName());
        if (user == null) {
            throw new ResourceNotFoundException("User not found");
        }

        UUID uuid = user.getId();
        String pageUrl = frontendBaseUrl.replaceAll("/$", "") + "/upload/" + uuid;
        BufferedImage qrCode = documentService.generateQRCode(pageUrl);
        String qrImageUrl = fileUploadService.uploadFile(qrCode, "qr/" + uuid + ".png");

        user.setQrCodeUrl(pageUrl);
        user.setQrStorageUrl(qrImageUrl);
        userRepo.save(user);
        return qrCode;
    }
}
