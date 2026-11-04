package com.akashgpt.saasprint.model.db;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(
        name = "qr_codes",
        indexes = @Index(name = "idx_qr_codes_user_id", columnList = "user_id"),
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_qr_codes_payment_order_id", columnNames = "payment_order_id"),
                @UniqueConstraint(name = "uk_qr_codes_payment_id", columnNames = "payment_id")
        }
)
@Getter
@Setter
public class QRCode {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false,
            foreignKey = @ForeignKey(name = "fk_qr_codes_user"))
    private User user;

    @NotBlank
    @Size(max = 80)
    @Column(nullable = false, length = 80)
    private String name;

    // These remain empty until payment is verified and the QR image is generated.
    @Column(name = "qr_code_url", length = 2048)
    private String qrCodeUrl;

    @Column(name = "qr_storage_url", length = 2048)
    private String qrStorageUrl;

    // Must be updated by server-side payment verification, never trusted from a client.
    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status", nullable = false, length = 20)
    private QRPaymentStatus paymentStatus = QRPaymentStatus.PENDING;

    @Column(name = "payment_order_id")
    private String paymentOrderId;

    @Column(name = "payment_id")
    private String paymentId;

    @Column(name = "amount_paise", nullable = false)
    private int amountPaise = 1000;

    @Column(nullable = false, length = 3)
    private String currency = "INR";

    @Column(name = "paid_at")
    private Instant paidAt;

    @Column(name = "generated_at")
    private Instant generatedAt;

    @Column(nullable = false)
    private boolean active = false;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
}
