package com.akashgpt.saasprint.controller;

import com.akashgpt.saasprint.config.OpenApiConfig;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.multipart.MultipartFile;

import static org.junit.jupiter.api.Assertions.assertArrayEquals;
import static org.junit.jupiter.api.Assertions.assertEquals;

class OpenApiAnnotationsTest {

    @Test
    void marksQrOperationsAsJwtProtected() {
        var requirement = QRController.class.getAnnotation(SecurityRequirement.class);

        assertEquals(OpenApiConfig.BEARER_AUTH, requirement.name());
    }

    @Test
    void describesDocumentUploadAsMultipart() throws NoSuchMethodException {
        var method = FileController.class.getMethod("uploadFile", MultipartFile.class, UUID.class);
        var mapping = method.getAnnotation(PostMapping.class);

        assertArrayEquals(new String[] {MediaType.MULTIPART_FORM_DATA_VALUE}, mapping.consumes());
        assertArrayEquals(new String[] {MediaType.APPLICATION_JSON_VALUE}, mapping.produces());
    }

    @Test
    void describesQrGenerationAsPng() throws NoSuchMethodException {
        var method = QRController.class.getMethod(
                "generate", UUID.class, jakarta.servlet.http.HttpServletResponse.class);
        var mapping = method.getAnnotation(PostMapping.class);

        assertArrayEquals(new String[] {MediaType.IMAGE_PNG_VALUE}, mapping.produces());
    }
}
