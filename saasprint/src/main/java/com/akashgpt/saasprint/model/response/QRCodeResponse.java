package com.akashgpt.saasprint.model.response;

import com.akashgpt.saasprint.model.db.QRPaymentStatus;
import java.time.Instant;
import java.util.UUID;

public record QRCodeResponse(UUID id, String name, String qrCodeUrl, boolean active,
        QRPaymentStatus paymentStatus, Instant createdAt, Instant generatedAt,
        String image, int amountPaise, String currency) {}
