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

    @Schema(description = "Receiving shop account ID", example = "3f54dcb8-5119-4b93-a88f-3a3b8040bcc7")
    private UUID receiverId;

    @Schema(description = "Original document name", example = "application-form.pdf")
    private String fileName;

    @Schema(description = "URL of the uploaded document", example = "https://example-bucket.s3.eu-north-1.amazonaws.com/uploads/document.pdf")
    private String fileUrl;
}
