package com.akashgpt.saasprint.impl;


import com.akashgpt.saasprint.model.db.User;
import com.akashgpt.saasprint.model.response.QRTokensResponse;
import com.akashgpt.saasprint.repository.UserRepo;
import com.akashgpt.saasprint.service.QRService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class QRServiceImpl implements QRService {
    @Autowired
    private UserRepo userRepo;
    /**
     * @return
     */
    @Override
    public QRTokensResponse numOfTokens() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String name = authentication.getName();
        User user
                = userRepo.findByUsername(name);
        QRTokensResponse response = new QRTokensResponse();
        response.setQrTokens(user.getQrToken());
        response.setUserId(user.getId());
        response.setUserName(user.getUsername());
        return response;
    }
}
