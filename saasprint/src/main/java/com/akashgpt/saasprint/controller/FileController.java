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
import org.springframework.messaging.simp.user.SimpUserRegistry;
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
    private final SimpUserRegistry userRegistry;

    public FileController(
            SimpMessagingTemplate messagingTemplate,
            FileUploadService fileUploadService,
            UserRepo userRepo,
            SimpUserRegistry userRegistry
    ) {
        this.messagingTemplate = messagingTemplate;
        this.fileUploadService = fileUploadService;
        this.userRepo = userRepo;
        this.userRegistry = userRegistry;
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Send a customer document",
            description = "Relays an allowed document to the connected shop inbox without storing it.")
    @ApiResponses({
            @ApiResponse(responseCode = "202", description = "Document relayed to the shop"),
            @ApiResponse(responseCode = "400", description = "Missing or unsupported document",
                    content = @Content(schema = @Schema(implementation = ApiError.class))),
            @ApiResponse(responseCode = "404", description = "Receiving shop not found",
                    content = @Content(schema = @Schema(implementation = ApiError.class))),
            @ApiResponse(responseCode = "413", description = "Upload exceeds the configured size limit",
                    content = @Content(schema = @Schema(implementation = ApiError.class))),
            @ApiResponse(responseCode = "503", description = "Receiving shop is offline",
                    content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    public ResponseEntity<Void> uploadFile(
            @Parameter(description = "Document to send to the shop", required = true,
                    schema = @Schema(type = "string", format = "binary"))
            @RequestPart("file") MultipartFile file,
            @Parameter(description = "Receiving shop account ID", required = true,
                    example = "3f54dcb8-5119-4b93-a88f-3a3b8040bcc7")
            @RequestParam("receiverId") UUID receiverId,
            @Parameter(description = "Optional note from the customer, up to 300 characters")
            @RequestParam(value = "note", required = false) String note) {

        String trimmedNote = note == null ? "" : note.strip();
        if (trimmedNote.length() > 300) {
            throw new IllegalArgumentException("Note must be 300 characters or fewer");
        }

        if (!userRepo.existsById(receiverId)) {
            throw new ResourceNotFoundException("Receiver not found");
        }

        var shopSession = userRegistry.getUser(receiverId.toString());
        boolean subscribed = shopSession != null && shopSession.getSessions().stream()
                .flatMap(session -> session.getSubscriptions().stream())
                .anyMatch(subscription -> ("/topic/user/" + receiverId).equals(subscription.getDestination()));
        if (!subscribed) {
            throw new org.springframework.web.server.ResponseStatusException(
                    org.springframework.http.HttpStatus.SERVICE_UNAVAILABLE,
                    "The print shop is offline. Please try again shortly.");
        }

        FileNotification notification = new FileNotification();
        notification.setDocumentId(UUID.randomUUID());
        notification.setReceiverId(receiverId);
        notification.setFileName(file.getOriginalFilename());
        notification.setContentType(file.getContentType() == null
                ? MediaType.APPLICATION_OCTET_STREAM_VALUE : file.getContentType());
        notification.setFileSize(file.getSize());
        notification.setFileData(fileUploadService.readDocument(file));
        notification.setNote(trimmedNote.isEmpty() ? null : trimmedNote);

        messagingTemplate.convertAndSend(
                "/topic/user/" + receiverId,
                notification);

        return ResponseEntity.accepted().build();
    }
}
