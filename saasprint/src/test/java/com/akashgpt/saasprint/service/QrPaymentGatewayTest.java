package com.akashgpt.saasprint.service;

import org.junit.jupiter.api.*;
import org.springframework.http.MediaType;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestClient;
import org.springframework.web.server.ResponseStatusException;
import com.sun.net.httpserver.HttpServer;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.atomic.AtomicBoolean;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.*;
import static org.springframework.test.web.client.response.MockRestResponseCreators.*;

class QrPaymentGatewayTest {
    QrPaymentGateway gateway;
    MockRestServiceServer server;
    @BeforeEach void setup() {
        var builder = RestClient.builder().baseUrl("http://next.test");
        server = MockRestServiceServer.bindTo(builder).build();
        gateway = new QrPaymentGateway("http://next.test");
        ReflectionTestUtils.setField(gateway, "client", builder.build());
    }

    @Test void delegatesVerificationToNextAndChecksTheReturnedOrderAndAmount() {
        server.expect(requestTo("http://next.test/api/verifyOrder"))
                .andExpect(jsonPath("$.razorpay_order_id").value("order_one"))
                .andExpect(jsonPath("$.expectedAmount").value(1000))
                .andRespond(withSuccess("{\"success\":true,\"payment\":{\"id\":\"pay_one\",\"order_id\":\"order_one\",\"status\":\"captured\",\"amount\":1000,\"currency\":\"INR\",\"amount_refunded\":0}}", MediaType.APPLICATION_JSON));
        var payment = gateway.verifiedPayment("order_one", 1000, "INR", null);
        assertEquals("pay_one", payment.id()); server.verify();
    }

    @Test void cannotUseProofForADifferentQrOrder() {
        assertThrows(ResponseStatusException.class, () -> gateway.verifiedPayment("order_one", 1000, "INR",
                new QrPaymentGateway.Proof("order_other", "pay_other", "signature")));
        server.verify();
    }

    @Test void rejectsMismatchedPaymentEvenIfNextReturnsSuccess() {
        server.expect(requestTo("http://next.test/api/verifyOrder"))
                .andRespond(withSuccess("{\"success\":true,\"payment\":{\"id\":\"pay_one\",\"order_id\":\"order_one\",\"status\":\"captured\",\"amount\":100,\"currency\":\"INR\",\"amount_refunded\":0}}", MediaType.APPLICATION_JSON));
        assertThrows(ResponseStatusException.class, () -> gateway.verifiedPayment("order_one", 1000, "INR", null));
        server.verify();
    }

    @Test void realHttpClientUsesHttp11WithoutH2cUpgradeForNextRoutes() throws Exception {
        // Exercise the actual request factory; MockRestServiceServer bypasses the HTTP client.
        HttpServer next = HttpServer.create(new InetSocketAddress("127.0.0.1", 0), 0);
        AtomicBoolean attemptedUpgrade = new AtomicBoolean(false);
        AtomicBoolean sawJsonOrder = new AtomicBoolean(false);
        next.createContext("/api/createOrder", exchange -> {
            boolean upgrade = exchange.getRequestHeaders().containsKey("Upgrade")
                    || exchange.getRequestHeaders().containsKey("HTTP2-Settings");
            attemptedUpgrade.set(attemptedUpgrade.get() || upgrade);
            boolean post = exchange.getRequestMethod().equals("POST");
            if (post) {
                String body = new String(exchange.getRequestBody().readAllBytes(), StandardCharsets.UTF_8);
                sawJsonOrder.set(body.contains("1000") && body.contains("INR")
                        && exchange.getRequestHeaders().getFirst("Content-Type").contains("application/json"));
            }
            String json = post ? "{\"orderId\":\"order_one\",\"amount\":1000,\"currency\":\"INR\"}"
                    : "{\"keyId\":\"test_public_key\"}";
            byte[] bytes = json.getBytes(StandardCharsets.UTF_8);
            exchange.getResponseHeaders().set("Content-Type", "application/json");
            exchange.sendResponseHeaders(upgrade ? 400 : 200, bytes.length);
            exchange.getResponseBody().write(bytes);
            exchange.close();
        });
        next.start();
        try {
            var realGateway = new QrPaymentGateway("http://127.0.0.1:" + next.getAddress().getPort());
            assertEquals("test_public_key", realGateway.keyId());
            assertEquals("order_one", realGateway.createOrder(1000, "INR", "test-receipt").id());
            assertFalse(attemptedUpgrade.get());
            assertTrue(sawJsonOrder.get());
        } finally { next.stop(0); }
    }
}
