package com.akashgpt.saasprint.model.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginUserRequest {
    @Schema(description = "Registered account email", example = "owner@cityprint.example")
    @NotBlank
    @Email
    private String email;

    @Schema(description = "Account password", example = "StrongPassword123",
            accessMode = Schema.AccessMode.WRITE_ONLY)
    @NotBlank
    private String password;
}
