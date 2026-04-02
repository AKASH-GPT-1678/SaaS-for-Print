package com.akashgpt.saasprint;

import com.akashgpt.saasprint.model.User;
import com.akashgpt.saasprint.service.MyUserDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class HelloController {

    @Autowired
    private MyUserDetailService userDetailService;

    @GetMapping("hello")
    public String sayHello() {
        return "Hello World!";
    }

    @PostMapping("add")
    public User addUser(@RequestBody User user){
        return userDetailService.addUser(user);
    }
}