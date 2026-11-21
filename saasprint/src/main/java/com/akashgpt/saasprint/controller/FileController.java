package com.akashgpt.saasprint.controller;

import com.akashgpt.saasprint.exception.ResourceNotFoundException;
import com.akashgpt.saasprint.model.request.FileNotification;
import com.akashgpt.saasprint.model.response.ApiError;
import com.akashgpt.saasprint.repository.UserRepo;
import com.akashgpt.saasprint.service.FileUploadService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.UUID;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/docs")
@Tag(name = "Document Delivery", description = "Public customer document uploads to print shops")
public class FileController {

    private final SimpMessagingTemplate messagingTemplate;
    private final FileUploadService fileUploadService;
    private final UserRepo userRepo;

    public FileController(
            SimpMessagingTemplate messagingTemplate,
            FileUploadService fileUploadService,
            UserRepo userRepo
    ) {
        this.messagingTemplate = messagingTemplate;
        this.fileUploadService = fileUploadService;
        this.userRepo = userRepo;
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Upload a customer document",
            description = "Stores an allowed document and notifies the receiving shop in real time.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Document uploaded"),
            @ApiResponse(responseCode = "400", description = "Missing or unsupported document",
                    content = @Content(schema = @Schema(implementation = ApiError.class))),
            @ApiResponse(responseCode = "404", description = "Receiving shop not found",
                    content = @Content(schema = @Schema(implementation = ApiError.class))),
            @ApiResponse(responseCode = "413", description = "Upload exceeds the configured size limit",
                    content = @Content(schema = @Schema(implementation = ApiError.class))),
            @ApiResponse(responseCode = "502", description = "Document storage failed",
                    content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    public ResponseEntity<FileNotification> uploadFile(
            @Parameter(description = "Document to send to the shop", required = true,
                    schema = @Schema(type = "string", format = "binary"))
            @RequestPart("file") MultipartFile file,
            @Parameter(description = "Receiving shop account ID", required = true,
                    example = "3f54dcb8-5119-4b93-a88f-3a3b8040bcc7")
            @RequestParam("receiverId") UUID receiverId) {

        if (!userRepo.existsById(receiverId)) {
            throw new ResourceNotFoundException("Receiver not found");
        }

        String fileUrl = fileUploadService.uploadFile(file);

        FileNotification notification = new FileNotification();
        notification.setReceiverId(receiverId);
        notification.setFileName(file.getOriginalFilename());
        notification.setFileUrl(fileUrl);

        messagingTemplate.convertAndSend(
                "/topic/user/" + receiverId,
                notification);

        return ResponseEntity.ok(notification);
    }
}
