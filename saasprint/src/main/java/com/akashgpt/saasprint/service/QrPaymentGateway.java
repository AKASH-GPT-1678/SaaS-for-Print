package com.akashgpt.saasprint.service;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.*;
import org.springframework.web.server.ResponseStatusException;
import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

/** Delegates Razorpay operations to the existing Next.js server payment routes. */
@Service
public class QrPaymentGateway {
    private final RestClient client;

    public QrPaymentGateway(@Value("${app.frontend-base-url:http://localhost:3000}") String frontend) {
        var factory = new JdkClientHttpRequestFactory(java.net.http.HttpClient.newBuilder()
                // Next.js's HTTP dev server closes cleartext HTTP/2 (h2c) upgrade requests.
                .version(java.net.http.HttpClient.Version.HTTP_1_1)
                .connectTimeout(Duration.ofSeconds(10)).build());
        factory.setReadTimeout(Duration.ofSeconds(25));
        client = RestClient.builder().baseUrl(frontend.replaceAll("/$", ""))
                .requestFactory(factory).build();
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Order(@JsonProperty("orderId") String id, int amount, String currency) {}
    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Payment(String id, @JsonProperty("order_id") String orderId, String status,
            int amount, String currency, @JsonProperty("amount_refunded") int amountRefunded) {}
    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Verification(boolean success, Payment payment) {}
    public record Proof(@JsonProperty("razorpay_order_id") String orderId,
            @JsonProperty("razorpay_payment_id") String paymentId,
            @JsonProperty("razorpay_signature") String signature) {}
    public record CheckoutConfig(String keyId) {}

    public String keyId() {
        try {
            var config = client.get().uri("/api/createOrder").retrieve().body(CheckoutConfig.class);
            if (config == null || config.keyId() == null || config.keyId().isBlank()) throw unavailable();
            return config.keyId();
        } catch (RestClientException ex) { throw unavailable(); }
    }

    public Order createOrder(int amount, String currency, String receipt) {
        try {
            Order order = client.post().uri("/api/createOrder")
                    .body(Map.of("amount", amount, "currency", currency, "receipt", receipt))
                    .retrieve().body(Order.class);
            if (order == null || order.id() == null || order.amount() != amount || !currency.equals(order.currency()))
                throw unavailable();
            return order;
        } catch (RestClientException ex) { throw unavailable(); }
    }

    public Payment verifiedPayment(String storedOrderId, int amount, String currency, Proof proof) {
        if (proof != null && (!storedOrderId.equals(proof.orderId()) || proof.paymentId() == null || proof.signature() == null))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Payment details do not match this QR order");
        Map<String, Object> body = new HashMap<>();
        body.put("razorpay_order_id", storedOrderId);
        body.put("expectedAmount", amount); body.put("expectedCurrency", currency);
        if (proof != null) {
            body.put("razorpay_payment_id", proof.paymentId()); body.put("razorpay_signature", proof.signature());
        }
        try {
            var result = client.post().uri("/api/verifyOrder").body(body).retrieve().body(Verification.class);
            var payment = result == null ? null : result.payment();
            if (result == null || !result.success() || payment == null || payment.id() == null
                    || !storedOrderId.equals(payment.orderId()) || !"captured".equals(payment.status())
                    || payment.amount() != amount || !currency.equals(payment.currency()) || payment.amountRefunded() != 0
                    || (proof != null && !proof.paymentId().equals(payment.id())))
                throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Payment verification did not match this QR order");
            return payment;
        } catch (RestClientResponseException ex) {
            if (ex.getStatusCode().value() == 409) throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Payment is not captured yet. Check payment again before paying again.");
            if (ex.getStatusCode().value() == 400) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid payment verification");
            throw unavailable();
        } catch (RestClientException ex) { throw unavailable(); }
    }

    private ResponseStatusException unavailable() {
        return new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE,
                "Payment service unavailable. Check that the Next.js server and its Razorpay configuration are running.");
    }
}
