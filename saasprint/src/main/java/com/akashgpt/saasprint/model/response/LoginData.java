package com.akashgpt.saasprint.model.response;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Successful login result")
public class LoginData {
    @Schema(description = "JWT used in the Authorization header", example = "eyJhbGciOiJIUzI1NiJ9...")
    private String token;

    @Schema(example = "User Logged in Successfully")
    private String remarks;

    @Schema(example = "owner@cityprint.example")
    private String email;

    @Schema(description = "Authenticated shop account ID", example = "3f54dcb8-5119-4b93-a88f-3a3b8040bcc7")
    private UUID userid;
}
