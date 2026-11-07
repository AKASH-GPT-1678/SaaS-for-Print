package com.akashgpt.saasprint.repository;

import com.akashgpt.saasprint.model.db.QRCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import jakarta.persistence.LockModeType;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface QRCodeRepo extends JpaRepository<QRCode, UUID> {
    List<QRCode> findAllByUser_IdOrderByCreatedAtDesc(UUID userId);

    Optional<QRCode> findByIdAndUser_Id(UUID id, UUID userId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select q from QRCode q where q.id = :id and q.user.id = :userId")
    Optional<QRCode> findOwnedForUpdate(@Param("id") UUID id, @Param("userId") UUID userId);
}
