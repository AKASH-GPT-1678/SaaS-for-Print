package com.akashgpt.saasprint.model.request;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "Uploaded document notification sent to the receiving shop")
public class FileNotification {

    @Schema(description = "Unique ID for this file delivery")
    private UUID documentId;

    @Schema(description = "Receiving shop account ID", example = "3f54dcb8-5119-4b93-a88f-3a3b8040bcc7")
    private UUID receiverId;

    @Schema(description = "Original document name", example = "application-form.pdf")
    private String fileName;

    @Schema(description = "Document content type", example = "application/pdf")
    private String contentType;

    @Schema(description = "Document size in bytes", example = "2048")
    private long fileSize;

    @Schema(description = "Document bytes encoded as Base64 in the WebSocket message",
            type = "string", format = "byte")
    private byte[] fileData;

    @Schema(description = "Optional note from the customer", maxLength = 300)
    private String note;
}
