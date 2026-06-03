package com.akashgpt.saasprint.controller;

import com.akashgpt.saasprint.model.db.User;
import com.akashgpt.saasprint.model.request.LoginUserRequest;
import com.akashgpt.saasprint.model.request.RegisterUserRequest;
import com.akashgpt.saasprint.model.response.LoginData;
import com.akashgpt.saasprint.model.response.RegisterUser;
import com.akashgpt.saasprint.service.JwtService;
import com.akashgpt.saasprint.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;


@CrossOrigin(origins =  "https://saa-s-for-print-qf7asv57v-akash-gupta-s-projects-b3af644f.vercel.app")
@RestController
@RequestMapping("/auth")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    AuthenticationManager authenticationManager;

    @PostMapping("register")
    public RegisterUser register(@RequestBody RegisterUserRequest users){


        User user = userService.saveUser(users);
        RegisterUser user1 = new RegisterUser("User Registered Successfully" , true , user.getEmail() );
        return user1;

    }

    @GetMapping("/oauth-success")
    public String oauthSuccess(Authentication authentication) {

        OAuth2User user = (OAuth2User) authentication.getPrincipal();

        String email = user.getAttribute("email");

        // 🔥 Generate JWT here
        String token = "generate-your-jwt-here";

        return token;
    }

    @PostMapping("/login")
    public LoginData login(@RequestBody LoginUserRequest user){
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));
        if(authentication.isAuthenticated()){
            LoginData data = new LoginData();
            String token = jwtService.generateToken(user.getUsername());
            System.out.println(token);
            data.setToken(token  );

            data.setRemarks("User Logged in Successfully");
            return data;

        }
        else
            return null;

    }

}
