package com.akashgpt.saasprint.controller;

import com.akashgpt.saasprint.exception.ResourceNotFoundException;
import com.akashgpt.saasprint.model.request.FileNotification;
import com.akashgpt.saasprint.repository.UserRepo;
import com.akashgpt.saasprint.service.FileUploadService;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@RestController
@RequestMapping("/docs")
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

    @PostMapping("/upload")
    public ResponseEntity<FileNotification> uploadFile(
            @RequestParam MultipartFile file,
            @RequestParam UUID receiverId) {

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
