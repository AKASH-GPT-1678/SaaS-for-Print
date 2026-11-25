package com.akashgpt.saasprint.config;

import com.akashgpt.saasprint.model.db.User;
import com.akashgpt.saasprint.repository.UserRepo;
import com.akashgpt.saasprint.service.JwtService;
import io.jsonwebtoken.JwtException;
import java.security.Principal;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.WebSocketTransportRegistration;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final JwtService jwtService;
    private final UserRepo userRepo;

    @Value("${app.cors.allowed-origins:http://localhost:3000}")
    private String allowedOrigins;

    public WebSocketConfig(JwtService jwtService, UserRepo userRepo) {
        this.jwtService = jwtService;
        this.userRepo = userRepo;
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.enableSimpleBroker("/topic");
        registry.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(new ChannelInterceptor() {
            @Override
            public Message<?> preSend(Message<?> message, MessageChannel channel) {
                StompHeaderAccessor headers = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
                if (headers == null || headers.getCommand() == null) return message;

                switch (headers.getCommand()) {
                    case CONNECT, STOMP -> {
                        headers.setUser(authenticate(headers.getFirstNativeHeader("Authorization")));
                        headers.removeNativeHeader("Authorization");
                    }
                    case SUBSCRIBE -> {
                        Principal shop = headers.getUser();
                        if (shop == null || !("/topic/user/" + shop.getName()).equals(headers.getDestination())) {
                            throw new AccessDeniedException("Inbox subscription denied");
                        }
                    }
                    case UNSUBSCRIBE, DISCONNECT -> { }
                    default -> throw new AccessDeniedException("Unsupported inbox command");
                }
                return message;
            }
        });
    }

    @Override
    public void configureWebSocketTransport(WebSocketTransportRegistration registration) {
        registration
                .setMessageSizeLimit(15 * 1024 * 1024)
                .setSendBufferSizeLimit(20 * 1024 * 1024)
                .setSendTimeLimit(20_000);
    }

    private Principal authenticate(String authorization) {
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            throw new AccessDeniedException("Inbox authentication required");
        }
        try {
            String username = jwtService.extractUserName(authorization.substring(7));
            User shop = userRepo.findByUsername(username);
            if (shop != null) {
                return () -> shop.getId().toString();
            }
        } catch (JwtException | IllegalArgumentException ex) {
            throw new AccessDeniedException("Invalid inbox credentials");
        }
        throw new AccessDeniedException("Invalid inbox credentials");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        String[] origins = allowedOrigins.split(",");
        for (int i = 0; i < origins.length; i++) {
            origins[i] = origins[i].trim();
        }
        registry.addEndpoint("/ws")
                .setAllowedOrigins(origins)
                .withSockJS();
    }
}
