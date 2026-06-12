package com.akashgpt.saasprint.model.db;


import jakarta.persistence.*;
import lombok.Data;

import java.util.UUID;

@Entity
@Table(name = "users")
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    private String email;
    private String username;
    private String  password;

   private String qrCodeUrl;
   private String qrStorageUrl;
}
