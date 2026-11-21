package com.akashgpt.saasprint.model.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "Account registration result")
public class RegisterUser {
    @Schema(example = "User Registered Successfully")
    private String message;

    @Schema(example = "true")
    private boolean success;

    @Schema(example = "owner@cityprint.example")
    private String email;

}
