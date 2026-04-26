package com.akashgpt.saasprint.service;

import com.akashgpt.saasprint.model.UserPrincipal;
import com.akashgpt.saasprint.model.db.User;
import com.akashgpt.saasprint.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class MyUserDetailService implements UserDetailsService {

    @Autowired
    private UserRepo userRepo;


    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
       User user =  userRepo.findByUsername(username);
       if(user == null){
           throw new UsernameNotFoundException("User 404");
       }


        return new UserPrincipal(user);
    }


    public User addUser(User user) {
        return userRepo.save(user);
    }
}
