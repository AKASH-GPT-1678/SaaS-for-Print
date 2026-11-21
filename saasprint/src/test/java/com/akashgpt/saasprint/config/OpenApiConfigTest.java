package com.akashgpt.saasprint.config;

import io.swagger.v3.oas.models.security.SecurityScheme;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

class OpenApiConfigTest {

    @Test
    void describesTheApiAndJwtAuthentication() {
        var openApi = new OpenApiConfig().printarOpenApi();

        assertEquals("Printar API", openApi.getInfo().getTitle());
        assertEquals("v1", openApi.getInfo().getVersion());

        var bearer = openApi.getComponents().getSecuritySchemes().get(OpenApiConfig.BEARER_AUTH);
        assertNotNull(bearer);
        assertEquals(SecurityScheme.Type.HTTP, bearer.getType());
        assertEquals("bearer", bearer.getScheme());
        assertEquals("JWT", bearer.getBearerFormat());
    }
}
