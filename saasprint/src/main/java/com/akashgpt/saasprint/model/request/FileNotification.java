package com.akashgpt.saasprint.model.request;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FileNotification {

    private UUID receiverId;

    private String fileName;
    private String fileUrl;
}
