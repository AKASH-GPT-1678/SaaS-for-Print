package com.akashgpt.saasprint.controller;


import com.akashgpt.saasprint.service.QRService;
import jakarta.servlet.http.HttpServletResponse;
import software.amazon.awssdk.services.s3.S3Client;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;


@RestController
@RequestMapping("/qr")
@CrossOrigin("http://localhost:3000")
public class QRController {

    @Autowired
    private QRService qrService;



    @GetMapping("generate")
    public void generateQR(HttpServletResponse response) throws Exception {

        BufferedImage qrImage = qrService.generateQR();

        response.setContentType("image/png");

        ImageIO.write(
                qrImage,
                "PNG",
                response.getOutputStream());
    }

}
