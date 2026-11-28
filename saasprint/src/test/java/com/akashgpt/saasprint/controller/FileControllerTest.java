package com.akashgpt.saasprint.controller;

import com.akashgpt.saasprint.repository.UserRepo;
import com.akashgpt.saasprint.service.FileUploadService;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.messaging.simp.user.SimpUser;
import org.springframework.messaging.simp.user.SimpUserRegistry;
import org.springframework.messaging.simp.user.SimpSession;
import org.springframework.messaging.simp.user.SimpSubscription;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

class FileControllerTest {
    private final SimpMessagingTemplate messaging = mock(SimpMessagingTemplate.class);
    private final FileUploadService uploadService = mock(FileUploadService.class);
    private final UserRepo userRepo = mock(UserRepo.class);
    private final SimpUserRegistry userRegistry = mock(SimpUserRegistry.class);
    private final FileController controller = new FileController(messaging, uploadService, userRepo, userRegistry);
    private final UUID shopId = UUID.randomUUID();
    private final MockMultipartFile file = new MockMultipartFile(
            "file", "sample.txt", "text/plain", new byte[]{1});

    @Test
    void includesTheTrimmedNoteAndFileBytesInTheShopsNotification() throws Exception {
        stubConnectedShop();

        controller.uploadFile(file, shopId, "  Aman\nPrint 2 copies  ");

        var notification = org.mockito.ArgumentCaptor.forClass(
                com.akashgpt.saasprint.model.request.FileNotification.class);
        verify(messaging).convertAndSend(org.mockito.ArgumentMatchers.eq("/topic/user/" + shopId),
                notification.capture());
        assertEquals("Aman\nPrint 2 copies", notification.getValue().getNote());
        assertEquals("sample.txt", notification.getValue().getFileName());
        assertEquals(file.getSize(), notification.getValue().getFileSize());
        assertEquals(file.getBytes(), notification.getValue().getFileData());
        verify(uploadService, org.mockito.Mockito.never()).uploadFile(file);
    }

    @Test
    void allowsMissingAndBlankNotes() throws Exception {
        stubConnectedShop();

        controller.uploadFile(file, shopId, null);
        controller.uploadFile(file, shopId, " \t ");
        var captor = org.mockito.ArgumentCaptor.forClass(
                com.akashgpt.saasprint.model.request.FileNotification.class);
        verify(messaging, org.mockito.Mockito.times(2)).convertAndSend(
                org.mockito.ArgumentMatchers.eq("/topic/user/" + shopId), captor.capture());
        assertNull(captor.getAllValues().get(0).getNote());
        assertNull(captor.getAllValues().get(1).getNote());
    }

    @Test
    void rejectsAnOversizedNoteBeforeTransferringTheFile() {
        assertThrows(IllegalArgumentException.class,
                () -> controller.uploadFile(file, shopId, "a".repeat(301)));
        verifyNoInteractions(uploadService, messaging);
    }

    @Test
    void doesNotAcceptFilesWhenTheShopIsOffline() {
        when(userRepo.existsById(shopId)).thenReturn(true);
        when(userRegistry.getUser(shopId.toString())).thenReturn(null);
        assertThrows(org.springframework.web.server.ResponseStatusException.class,
                () -> controller.uploadFile(file, shopId, null));
        verifyNoInteractions(uploadService, messaging);
    }

    private void stubConnectedShop() throws Exception {
        when(userRepo.existsById(shopId)).thenReturn(true);
        var user = mock(SimpUser.class);
        var session = mock(SimpSession.class);
        var subscription = mock(SimpSubscription.class);
        when(userRegistry.getUser(shopId.toString())).thenReturn(user);
        when(user.getSessions()).thenReturn(Set.of(session));
        when(session.getSubscriptions()).thenReturn(Set.of(subscription));
        when(subscription.getDestination()).thenReturn("/topic/user/" + shopId);
        when(uploadService.readDocument(file)).thenReturn(file.getBytes());
    }
}
