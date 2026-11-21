package com.akashgpt.saasprint.model.response;

import com.akashgpt.saasprint.model.db.QRPaymentStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.Instant;
import java.util.UUID;

@Schema(description = "Saved QR code and payment state")
public record QRCodeResponse(
        @Schema(description = "QR record ID", example = "3f54dcb8-5119-4b93-a88f-3a3b8040bcc7")
        UUID id,
        @Schema(description = "Shop-facing QR name", example = "Front counter")
        String name,
        @Schema(description = "Customer upload destination encoded by the QR", example = "https://printar.example/upload/3f54dcb8-5119-4b93-a88f-3a3b8040bcc7")
        String qrCodeUrl,
        @Schema(description = "Whether the generated QR is active", example = "true")
        boolean active,
        @Schema(description = "Payment state")
        QRPaymentStatus paymentStatus,
        @Schema(description = "Time at which the QR record was created", example = "2026-11-21T10:30:00Z")
        Instant createdAt,
        @Schema(description = "Time at which the QR image was generated", example = "2026-11-21T10:31:00Z")
        Instant generatedAt,
        @Schema(description = "PNG QR image as a data URL")
        String image,
        @Schema(description = "Price in the smallest currency unit", example = "1000")
        int amountPaise,
        @Schema(description = "ISO 4217 currency code", example = "INR")
        String currency
) {}
