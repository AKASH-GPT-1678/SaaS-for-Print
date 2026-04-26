package com.akashgpt.saasprint.repository;

import com.akashgpt.saasprint.model.db.Payments;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payments , Long> {

}
