package com.akashgpt.saasprint.controller;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.*;
import com.akashgpt.saasprint.model.request.FileNotification;
import com.akashgpt.saasprint.service.FileUploadService;

@RestController
@RequestMapping("/docs")
@CrossOrigin("http://localhost:3000")
public class FileController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private FileUploadService fileUploadService;

    @PostMapping("/upload")
    public ResponseEntity<FileNotification> uploadFile(
            @RequestParam MultipartFile file,
            @RequestParam UUID receiverId) {

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
