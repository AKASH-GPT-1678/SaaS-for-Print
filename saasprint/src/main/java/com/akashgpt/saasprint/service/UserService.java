package com.akashgpt.saasprint.service;

import com.akashgpt.saasprint.model.User;
import com.akashgpt.saasprint.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepo userRepo;


    public User saveUser(User users){
        return userRepo.save(users);
    }

}
