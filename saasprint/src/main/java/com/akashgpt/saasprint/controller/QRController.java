package com.akashgpt.saasprint.controller;

import com.akashgpt.saasprint.impl.QRServiceImpl;
import com.akashgpt.saasprint.service.QrPaymentGateway;
import com.akashgpt.saasprint.model.response.QRCodeResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;
import java.util.UUID;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.bind.annotation.*;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;

@RestController
@RequestMapping("/qr")
public class QRController {

    private final QRServiceImpl qrService;

    public QRController(QRServiceImpl qrService) {
        this.qrService = qrService;
    }

    @GetMapping("generate")
    public void generateQR(@RequestParam UUID qrId, HttpServletResponse response) throws Exception {
        writeImage(qrId, response);
    }

    public record CreateOrder(@NotBlank @Size(max = 80) String name) {}

    @GetMapping
    public List<QRCodeResponse> list() throws Exception { return qrService.list(); }

    @PostMapping("/orders")
    public QRServiceImpl.Checkout createOrder(@Valid @RequestBody CreateOrder request) {
        return qrService.createOrder(request.name());
    }

    @GetMapping("/{id}/checkout")
    public QRServiceImpl.Checkout checkout(@PathVariable UUID id) { return qrService.checkout(id); }

    @PostMapping("/{id}/verify-payment")
    public QRCodeResponse verify(@PathVariable UUID id,
            @RequestBody(required = false) QrPaymentGateway.Proof proof) throws Exception {
        return qrService.verifyPayment(id, proof);
    }

    @PostMapping("/{id}/generate")
    public void generate(@PathVariable UUID id, HttpServletResponse response) throws Exception {
        writeImage(id, response);
    }

    private void writeImage(UUID id, HttpServletResponse response) throws Exception {
        BufferedImage qrImage = qrService.generateQR(id);
        response.setContentType("image/png");
        ImageIO.write(qrImage, "PNG", response.getOutputStream());
    }
}
