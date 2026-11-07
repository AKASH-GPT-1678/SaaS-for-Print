package com.akashgpt.saasprint.controller;

import com.akashgpt.saasprint.model.db.User;
import com.akashgpt.saasprint.model.request.LoginUserRequest;
import com.akashgpt.saasprint.repository.UserRepo;
import com.akashgpt.saasprint.service.JwtService;
import com.akashgpt.saasprint.service.UserService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserControllerTest {
    @Mock UserService userService;
    @Mock JwtService jwtService;
    @Mock UserRepo userRepo;
    @Mock AuthenticationManager authenticationManager;
    @InjectMocks UserController controller;

    @Test
    void loginResolvesEmailAndIssuesUsernameToken() {
        User account = new User();
        account.setId(UUID.randomUUID());
        account.setEmail("owner@example.com");
        account.setUsername("cityprint");
        when(userRepo.findByEmail("owner@example.com")).thenReturn(account);
        when(authenticationManager.authenticate(any())).thenReturn(
                new UsernamePasswordAuthenticationToken("cityprint", null));
        when(jwtService.generateToken("cityprint")).thenReturn("token");

        var result = controller.login(new LoginUserRequest(" Owner@Example.COM ", "password"));

        assertEquals("token", result.getToken());
        assertEquals(account.getId(), result.getUserid());
        assertEquals(account.getEmail(), result.getEmail());
        verify(authenticationManager).authenticate(
                new UsernamePasswordAuthenticationToken("cityprint", "password"));
    }

    @Test
    void loginRejectsUnknownEmail() {
        assertThrows(BadCredentialsException.class,
                () -> controller.login(new LoginUserRequest("unknown@example.com", "password")));
    }

    @Test
    void loginRejectsWrongPassword() {
        User account = new User();
        account.setUsername("cityprint");
        when(userRepo.findByEmail("owner@example.com")).thenReturn(account);
        when(authenticationManager.authenticate(any())).thenThrow(new BadCredentialsException("Bad credentials"));

        assertThrows(BadCredentialsException.class,
                () -> controller.login(new LoginUserRequest("owner@example.com", "wrong")));
    }
}
