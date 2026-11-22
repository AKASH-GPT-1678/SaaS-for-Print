package com.akashgpt.saasprint.controller;

import com.akashgpt.saasprint.config.OpenApiConfig;
import com.akashgpt.saasprint.impl.QRServiceImpl;
import com.akashgpt.saasprint.model.response.ApiError;
import com.akashgpt.saasprint.model.response.QRCodeResponse;
import com.akashgpt.saasprint.service.QrPaymentGateway;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.servlet.http.HttpServletResponse;
import java.awt.image.BufferedImage;
import java.util.List;
import java.util.UUID;
import javax.imageio.ImageIO;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/qr")
@Tag(name = "QR Codes", description = "Paid QR creation and management")
@SecurityRequirement(name = OpenApiConfig.BEARER_AUTH)
public class QRController {

    private final QRServiceImpl qrService;

    public QRController(QRServiceImpl qrService) {
        this.qrService = qrService;
    }

    @Deprecated
    @GetMapping(value = "/generate", produces = MediaType.IMAGE_PNG_VALUE)
    @Operation(summary = "Generate a QR image using a query parameter", deprecated = true,
            description = "Legacy operation. Use POST /qr/{id}/generate instead.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "PNG image generated",
                    content = @Content(mediaType = MediaType.IMAGE_PNG_VALUE,
                            schema = @Schema(type = "string", format = "binary"))),
            @ApiResponse(responseCode = "401", description = "Authentication required",
                    content = @Content(schema = @Schema(implementation = ApiError.class))),
            @ApiResponse(responseCode = "402", description = "Verified payment required",
                    content = @Content(schema = @Schema(implementation = ApiError.class))),
            @ApiResponse(responseCode = "404", description = "QR code not found",
                    content = @Content(schema = @Schema(implementation = ApiError.class))),
            @ApiResponse(responseCode = "502", description = "QR image storage failed",
                    content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    public void generateQR(
            @Parameter(description = "QR record ID", required = true,
                    example = "3f54dcb8-5119-4b93-a88f-3a3b8040bcc7")
            @RequestParam("qrId") UUID qrId,
            HttpServletResponse response) throws Exception {
        writeImage(qrId, response);
    }

    public record CreateOrder(
            @Schema(description = "Shop-facing name for the QR placement", example = "Front counter", maxLength = 80)
            @NotBlank @Size(max = 80) String name
    ) {}

    @GetMapping
    @Operation(summary = "List QR codes",
            description = "Returns QR codes owned by the authenticated shop account.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "QR collection returned"),
            @ApiResponse(responseCode = "401", description = "Authentication required",
                    content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    public List<QRCodeResponse> list() throws Exception { return qrService.list(); }

    @PostMapping("/orders")
    @Operation(summary = "Create a QR payment order",
            description = "Creates a pending QR record and a Razorpay checkout order at the server-defined price.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Checkout created"),
            @ApiResponse(responseCode = "400", description = "Invalid QR name",
                    content = @Content(schema = @Schema(implementation = ApiError.class))),
            @ApiResponse(responseCode = "401", description = "Authentication required",
                    content = @Content(schema = @Schema(implementation = ApiError.class))),
            @ApiResponse(responseCode = "503", description = "Payment service unavailable",
                    content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    public QRServiceImpl.Checkout createOrder(@Valid @RequestBody CreateOrder request) {
        return qrService.createOrder(request.name());
    }

    @GetMapping("/{id}/checkout")
    @Operation(summary = "Resume QR checkout",
            description = "Returns checkout details for a QR with a pending payment.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Checkout returned"),
            @ApiResponse(responseCode = "401", description = "Authentication required",
                    content = @Content(schema = @Schema(implementation = ApiError.class))),
            @ApiResponse(responseCode = "404", description = "QR code not found",
                    content = @Content(schema = @Schema(implementation = ApiError.class))),
            @ApiResponse(responseCode = "409", description = "QR does not require checkout",
                    content = @Content(schema = @Schema(implementation = ApiError.class))),
            @ApiResponse(responseCode = "503", description = "Payment service unavailable",
                    content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    public QRServiceImpl.Checkout checkout(
            @Parameter(description = "QR record ID", example = "3f54dcb8-5119-4b93-a88f-3a3b8040bcc7")
            @PathVariable UUID id) {
        return qrService.checkout(id);
    }

    @PostMapping("/{id}/verify-payment")
    @Operation(summary = "Verify a QR payment",
            description = "Verifies browser checkout proof, or reconciles the stored order when the optional body is omitted.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Payment verified"),
            @ApiResponse(responseCode = "400", description = "Invalid payment proof",
                    content = @Content(schema = @Schema(implementation = ApiError.class))),
            @ApiResponse(responseCode = "401", description = "Authentication required",
                    content = @Content(schema = @Schema(implementation = ApiError.class))),
            @ApiResponse(responseCode = "404", description = "QR code not found",
                    content = @Content(schema = @Schema(implementation = ApiError.class))),
            @ApiResponse(responseCode = "409", description = "Payment has not been captured",
                    content = @Content(schema = @Schema(implementation = ApiError.class))),
            @ApiResponse(responseCode = "502", description = "Payment verification response did not match the order",
                    content = @Content(schema = @Schema(implementation = ApiError.class))),
            @ApiResponse(responseCode = "503", description = "Payment service unavailable",
                    content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    public QRCodeResponse verify(
            @Parameter(description = "QR record ID", example = "3f54dcb8-5119-4b93-a88f-3a3b8040bcc7")
            @PathVariable UUID id,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(required = false,
                    description = "Razorpay checkout proof. Omit to reconcile the saved order directly.",
                    content = @Content(schema = @Schema(implementation = QrPaymentGateway.Proof.class)))
            @RequestBody(required = false) QrPaymentGateway.Proof proof) throws Exception {
        return qrService.verifyPayment(id, proof);
    }

    @PostMapping(value = "/{id}/generate", produces = MediaType.IMAGE_PNG_VALUE)
    @Operation(summary = "Generate a paid QR image",
            description = "Generates or returns the PNG image after payment has been verified.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "PNG image generated",
                    content = @Content(mediaType = MediaType.IMAGE_PNG_VALUE,
                            schema = @Schema(type = "string", format = "binary"))),
            @ApiResponse(responseCode = "401", description = "Authentication required",
                    content = @Content(schema = @Schema(implementation = ApiError.class))),
            @ApiResponse(responseCode = "402", description = "Verified payment required",
                    content = @Content(schema = @Schema(implementation = ApiError.class))),
            @ApiResponse(responseCode = "404", description = "QR code not found",
                    content = @Content(schema = @Schema(implementation = ApiError.class))),
            @ApiResponse(responseCode = "502", description = "QR image storage failed",
                    content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    public void generate(
            @Parameter(description = "QR record ID", example = "3f54dcb8-5119-4b93-a88f-3a3b8040bcc7")
            @PathVariable UUID id,
            HttpServletResponse response) throws Exception {
        writeImage(id, response);
    }

    private void writeImage(UUID id, HttpServletResponse response) throws Exception {
        BufferedImage qrImage = qrService.generateQR(id);
        response.setContentType("image/png");
        ImageIO.write(qrImage, "PNG", response.getOutputStream());
    }
}
