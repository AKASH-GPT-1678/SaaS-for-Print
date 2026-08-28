package com.akashgpt.saasprint.controller;

import com.akashgpt.saasprint.model.db.User;
import com.akashgpt.saasprint.model.request.LoginUserRequest;
import com.akashgpt.saasprint.model.request.RegisterUserRequest;
import com.akashgpt.saasprint.model.response.LoginData;
import com.akashgpt.saasprint.model.response.RegisterUser;
import com.akashgpt.saasprint.repository.UserRepo;
import com.akashgpt.saasprint.service.JwtService;
import com.akashgpt.saasprint.service.UserService;
import jakarta.validation.Valid;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
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
    public RegisterUser register(@Valid @RequestBody RegisterUserRequest users) {
        User user = userService.saveUser(users);
        return new RegisterUser("User Registered Successfully", true, user.getEmail());
    }

    @PostMapping("/login")
    public LoginData login(@Valid @RequestBody LoginUserRequest user) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword())
        );

        User dbUser = userRepo.findByUsername(authentication.getName());
        LoginData data = new LoginData();
        data.setToken(jwtService.generateToken(user.getUsername()));
        data.setUserid(dbUser.getId());
        data.setEmail(dbUser.getEmail());
        data.setRemarks("User Logged in Successfully");
        return data;
    }
}
