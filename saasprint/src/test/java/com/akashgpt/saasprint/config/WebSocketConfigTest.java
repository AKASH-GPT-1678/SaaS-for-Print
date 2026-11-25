package com.akashgpt.saasprint.config;

import com.akashgpt.saasprint.model.db.User;
import com.akashgpt.saasprint.repository.UserRepo;
import com.akashgpt.saasprint.service.JwtService;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.security.access.AccessDeniedException;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class WebSocketConfigTest {
    private final UserRepo userRepo = mock(UserRepo.class);
    private final JwtService jwtService = new JwtService(UUID.randomUUID().toString());
    private final MessageChannel channel = mock(MessageChannel.class);
    private final ChannelInterceptor interceptor;

    WebSocketConfigTest() {
        var registration = mock(ChannelRegistration.class);
        new WebSocketConfig(jwtService, userRepo).configureClientInboundChannel(registration);
        var captured = ArgumentCaptor.forClass(ChannelInterceptor.class);
        verify(registration).interceptors(captured.capture());
        interceptor = captured.getValue();
    }

    @Test
    void requiresAValidTokenAndAnExistingShop() {
        var connect = StompHeaderAccessor.create(StompCommand.CONNECT);
        assertThrows(AccessDeniedException.class, () -> accept(connect));

        connect.setNativeHeader("Authorization", "Bearer invalid");
        assertThrows(AccessDeniedException.class, () -> accept(connect));

        connect.setNativeHeader("Authorization", "Bearer " + jwtService.generateToken("missing-shop"));
        assertThrows(AccessDeniedException.class, () -> accept(connect));
    }

    @Test
    void allowsSubscriptionsOnlyToTheSignedInShopsInbox() {
        var shop = new User();
        shop.setId(UUID.randomUUID());
        when(userRepo.findByUsername("shop")).thenReturn(shop);
        var connect = StompHeaderAccessor.create(StompCommand.CONNECT);
        connect.setNativeHeader("Authorization", "Bearer " + jwtService.generateToken("shop"));
        accept(connect);
        assertEquals(shop.getId().toString(), connect.getUser().getName());

        var subscribe = StompHeaderAccessor.create(StompCommand.SUBSCRIBE);
        subscribe.setDestination("/topic/user/" + shop.getId());
        assertThrows(AccessDeniedException.class, () -> accept(subscribe));

        subscribe.setUser(connect.getUser());
        accept(subscribe);
        subscribe.setDestination("/topic/user/" + UUID.randomUUID());
        assertThrows(AccessDeniedException.class, () -> accept(subscribe));
        subscribe.setDestination("/topic/user/*");
        assertThrows(AccessDeniedException.class, () -> accept(subscribe));
    }

    @Test
    void clientsCannotPublishInboxNotifications() {
        for (var command : new StompCommand[]{StompCommand.SEND, StompCommand.MESSAGE}) {
            var message = StompHeaderAccessor.create(command);
            message.setDestination("/topic/user/" + UUID.randomUUID());
            assertThrows(AccessDeniedException.class, () -> accept(message));
        }
    }

    private void accept(StompHeaderAccessor headers) {
        headers.setLeaveMutable(true);
        interceptor.preSend(MessageBuilder.createMessage(new byte[0], headers.getMessageHeaders()), channel);
    }
}
