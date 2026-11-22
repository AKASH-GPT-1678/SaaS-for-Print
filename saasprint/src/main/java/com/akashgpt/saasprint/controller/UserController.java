package com.akashgpt.saasprint.controller;

import com.akashgpt.saasprint.model.db.User;
import com.akashgpt.saasprint.model.request.LoginUserRequest;
import com.akashgpt.saasprint.model.request.RegisterUserRequest;
import com.akashgpt.saasprint.model.response.ApiError;
import com.akashgpt.saasprint.model.response.LoginData;
import com.akashgpt.saasprint.model.response.RegisterUser;
import com.akashgpt.saasprint.repository.UserRepo;
import com.akashgpt.saasprint.service.JwtService;
import com.akashgpt.saasprint.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.Locale;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@Tag(name = "Authentication", description = "Shop account registration and login")
public class UserController {

    private final UserService userService;
    private final JwtService jwtService;
    private final UserRepo userRepo;
    private final AuthenticationManager authenticationManager;

    public UserController(
            UserService userService,
            JwtService jwtService,
            UserRepo userRepo,
            AuthenticationManager authenticationManager
    ) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.userRepo = userRepo;
        this.authenticationManager = authenticationManager;
    }

    @PostMapping("/register")
    @Operation(summary = "Register a shop account",
            description = "Creates an account with a unique username and email address.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Account created"),
            @ApiResponse(responseCode = "400", description = "Invalid or duplicate account",
                    content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    public RegisterUser register(@Valid @RequestBody RegisterUserRequest users) {
        User user = userService.saveUser(users);
        return new RegisterUser("User Registered Successfully", true, user.getEmail());
    }

    @PostMapping("/login")
    @Operation(summary = "Sign in",
            description = "Authenticates a shop account and returns a JWT for protected endpoints.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Login successful"),
            @ApiResponse(responseCode = "400", description = "Invalid request",
                    content = @Content(schema = @Schema(implementation = ApiError.class))),
            @ApiResponse(responseCode = "401", description = "Invalid email or password",
                    content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    public LoginData login(@Valid @RequestBody LoginUserRequest user) {
        User dbUser = userRepo.findByEmail(user.getEmail().trim().toLowerCase(Locale.ROOT));
        if (dbUser == null) {
            throw new BadCredentialsException("Invalid email or password");
        }
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(dbUser.getUsername(), user.getPassword())
        );

        LoginData data = new LoginData();
        data.setToken(jwtService.generateToken(authentication.getName()));
        data.setUserid(dbUser.getId());
        data.setEmail(dbUser.getEmail());
        data.setRemarks("User Logged in Successfully");
        return data;
    }
}
