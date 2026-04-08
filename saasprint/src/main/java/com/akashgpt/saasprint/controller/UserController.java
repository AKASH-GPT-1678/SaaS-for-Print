package com.akashgpt.saasprint.controller;

import com.akashgpt.saasprint.model.User;
import com.akashgpt.saasprint.service.JwtService;
import com.akashgpt.saasprint.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;


@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    AuthenticationManager authenticationManager;

    @PostMapping("register")
    public User register(@RequestBody User users){
        return userService.saveUser(users);
    }

    @GetMapping("/oauth-success")
    public String oauthSuccess(Authentication authentication) {

        OAuth2User user = (OAuth2User) authentication.getPrincipal();

        String email = user.getAttribute("email");

        // 🔥 Generate JWT here
        String token = "generate-your-jwt-here";

        return token;
    }

    @PostMapping("login")
    public String login(@RequestBody User user){
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));
        if(authentication.isAuthenticated()){
            return jwtService.generateToken(user.getUsername());
        }
        else
            return "Login Failed";

    }

}
