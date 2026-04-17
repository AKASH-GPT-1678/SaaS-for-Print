package com.akashgpt.saasprint.controller;


import com.akashgpt.saasprint.service.DocumentService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;

@RestController
@RequestMapping("/qr")
@CrossOrigin("http://localhost:3000")
public class QRController {

    @Autowired
    private DocumentService documentService;

    @GetMapping("generate")
    public void generateQR(
            @RequestParam String url,
            HttpServletResponse response
    ) throws Exception {

        BufferedImage qrImage = documentService.generateQRCode(url);

        response.setContentType("image/png");
        ImageIO.write(qrImage, "PNG", response.getOutputStream());
    }


}
