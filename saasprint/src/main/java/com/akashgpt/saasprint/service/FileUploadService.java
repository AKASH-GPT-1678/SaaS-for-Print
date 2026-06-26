package com.akashgpt.saasprint.service;

import javax.imageio.ImageIO;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import com.amazonaws.services.s3.model.ObjectMetadata;
import software.amazon.awssdk.services.s3.model.PutObjectResponse;
import software.amazon.awssdk.services.s3.model.ListObjectsV2Response;
import software.amazon.awssdk.services.s3.model.ObjectIdentifier;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import software.amazon.awssdk.services.s3.model.ListObjectsV2Request;
import java.util.*;
import software.amazon.awssdk.services.s3.model.Delete;
import software.amazon.awssdk.services.s3.model.*;


@Service
public class FileUploadService {

    private final S3Client s3Client;

    @Value("${aws.region}")
    private String region;

    @Value("${aws.bucket.name}")
    private String bucketName;

    public FileUploadService(S3Client s3Client) {
        this.s3Client = s3Client;
    }

    public String uploadFile(BufferedImage image, String fileName) {
        try {

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

            // Convert BufferedImage to PNG bytes
            ImageIO.write(image, "png", outputStream);

            byte[] imageBytes = outputStream.toByteArray();

            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(fileName)
                    .contentType("image/png")
                    .build();

            s3Client.putObject(
                    putObjectRequest,
                    RequestBody.fromBytes(imageBytes));

            // Construct public URL
            String fileUrl = String.format(
                    "https://%s.s3.%s.amazonaws.com/%s",
                    bucketName,
                    region,
                    fileName);

            return fileUrl;

        } catch (Exception e) {
            e.printStackTrace();
            return "Upload failed: " + e.getMessage();
        }
    }

    public String uploadFile(MultipartFile file) {
        try {
            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentType(file.getContentType());
            metadata.setContentLength(file.getSize());

            String fileName = file.getOriginalFilename();

            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(fileName)
                    .contentType(file.getContentType())
                    .build();

            PutObjectResponse response = s3Client.putObject(
                    putObjectRequest,
                    RequestBody.fromBytes(file.getBytes()));

            // Construct public URL
            String fileUrl = String.format("https://%s.s3.%s.amazonaws.com/%s",
                    bucketName, region, fileName);

            return fileUrl;

        } catch (Exception e) {
            e.printStackTrace();
            return "Upload failed: " + e.getMessage();
        }
    }


    public void deleteAllFiles(String bucketName) {

        ListObjectsV2Request listRequest = ListObjectsV2Request.builder()
                .bucket(bucketName)
                .build();

        ListObjectsV2Response listResponse = s3Client.listObjectsV2(listRequest);

        if (listResponse.contents().isEmpty()) {
            return;
        }

        List<ObjectIdentifier> objects = listResponse.contents()
                .stream()
                .map(s3Object -> ObjectIdentifier.builder()
                        .key(s3Object.key())
                        .build())
                .toList();

        Delete delete = Delete.builder()
                .objects(objects)
                .build();

        DeleteObjectsRequest deleteRequest = DeleteObjectsRequest.builder()
                .bucket(bucketName)
                .delete(delete)
                .build();

        s3Client.deleteObjects(deleteRequest);
    }

}
