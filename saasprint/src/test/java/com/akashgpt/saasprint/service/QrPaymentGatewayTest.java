package com.akashgpt.saasprint.service;

import org.junit.jupiter.api.*;
import org.springframework.http.MediaType;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestClient;
import org.springframework.web.server.ResponseStatusException;
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
}
