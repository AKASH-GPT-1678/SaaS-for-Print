package com.akashgpt.saasprint.model.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterUserRequest {
    @Schema(description = "Email used to sign in", example = "owner@cityprint.example")
    @NotBlank
    @Email
    private String email;

    @Schema(description = "Unique shop username", example = "cityprint", minLength = 3, maxLength = 50)
    @NotBlank
    @Size(min = 3, max = 50)
    private String username;

    @Schema(description = "Account password", example = "StrongPassword123", minLength = 8, maxLength = 72,
            accessMode = Schema.AccessMode.WRITE_ONLY)
    @NotBlank
    @Size(min = 8, max = 72)
    private String password;
}
