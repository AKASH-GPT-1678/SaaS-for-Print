package com.akashgpt.saasprint.model;

import com.akashgpt.saasprint.model.db.User;
import org.jspecify.annotations.Nullable;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

public class UserPrincipal implements UserDetails {

    private User user;

    public UserPrincipal(User user){
        this.user = user;

    }

    /**
     * @return
     */
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return
                Collections.singleton( new SimpleGrantedAuthority("USER"));
    }

    /**
     * @return
     */
    @Override
    public @Nullable String getPassword() {
        return user.getPassword()

                ;
    }

    /**
     * @return
     */
    @Override
    public String getUsername() {
        return user.getUsername();
    }
}
