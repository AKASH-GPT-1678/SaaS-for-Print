package com.akashgpt.saasprint.service;

import com.akashgpt.saasprint.model.db.User;
import com.akashgpt.saasprint.model.request.RegisterUserRequest;
import com.akashgpt.saasprint.repository.UserRepo;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepo userRepo;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    @Test
    void saveUserPersistsEmailAndHashedPassword() {
        RegisterUserRequest request = new RegisterUserRequest("shop@example.com", "shopowner", "password1");
        when(userRepo.existsByUsername("shopowner")).thenReturn(false);
        when(userRepo.existsByEmail("shop@example.com")).thenReturn(false);
        when(passwordEncoder.encode("password1")).thenReturn("hashed-password");
        when(userRepo.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        User saved = userService.saveUser(request);

        assertEquals("shop@example.com", saved.getEmail());
        assertEquals("shopowner", saved.getUsername());
        assertEquals("hashed-password", saved.getPassword());

        ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);
        verify(userRepo).save(captor.capture());
        assertEquals("shop@example.com", captor.getValue().getEmail());
    }

    @Test
    void saveUserRejectsDuplicateUsername() {
        RegisterUserRequest request = new RegisterUserRequest("shop@example.com", "shopowner", "password1");
        when(userRepo.existsByUsername("shopowner")).thenReturn(true);

        assertThrows(IllegalArgumentException.class, () -> userService.saveUser(request));
    }
}
