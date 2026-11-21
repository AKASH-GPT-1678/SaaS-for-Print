package com.akashgpt.saasprint.model.response;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.Instant;

@Schema(description = "Standard error response")
public record ApiError(
        @Schema(description = "Human-readable error message", example = "Authentication required")
        String message,
        @Schema(description = "Time at which the error was produced", example = "2026-11-21T10:30:00Z")
        Instant timestamp
) {}
