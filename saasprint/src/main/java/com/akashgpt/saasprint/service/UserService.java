package com.akashgpt.saasprint.service;

import com.akashgpt.saasprint.model.db.User;
import com.akashgpt.saasprint.model.request.RegisterUserRequest;
import com.akashgpt.saasprint.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepo userRepo;


    public User saveUser(RegisterUserRequest users){
        User user = new User();
        user.setEmail(user.getEmail());
        user.setPassword(users.getPassword());
        user.setUsername(users.getUsername());
        return userRepo.save(user);
    }

}
