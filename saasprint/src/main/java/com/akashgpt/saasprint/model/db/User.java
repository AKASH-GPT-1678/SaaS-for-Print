package com.akashgpt.saasprint.model.db;


import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "users")
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String email;
    private String username;
    private String  password;

    @Column(name = "qr_token")
    private Integer qrToken;
}
