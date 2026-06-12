package com.akashgpt.saasprint.controller;



import com.akashgpt.saasprint.model.db.User;
import com.akashgpt.saasprint.model.response.QRTokensResponse;
import com.akashgpt.saasprint.repository.UserRepo;
import com.akashgpt.saasprint.service.DocumentService;
import com.akashgpt.saasprint.service.QRService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.util.UUID;

@RestController
@RequestMapping("/qr")
@CrossOrigin("http://localhost:3000")
public class QRController {

    @Autowired
    private DocumentService documentService;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private QRService qrService;

    @GetMapping("generate")
    public void generateQR(
            @RequestParam String url,
            HttpServletResponse response
    ) throws Exception {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String name = authentication.getName();
        User user = userRepo.findByUsername(name);
        UUID uuid = user.getId();
        String qrUrl = "https://saa-s-for-print.vercel.app/chat/" + uuid ;
        user.setQrCodeUrl(url);






        BufferedImage qrImage = documentService.generateQRCode(url);

        response.setContentType("image/png");
        ImageIO.write(qrImage, "PNG", response.getOutputStream());
        userRepo.save(user);

    }

//    @PostMapping("qrstats")
//    public void updateQRCount(){
//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//        String name = authentication.getName();
//        User user = userRepo.findByUsername(name);
//        user.setQrToken(user.getQrToken() + 1);
//        userRepo.save(user);
//        Payments payments = new Payments();
//
//
//    }


}
