package com.cdac.moneymanager.service;

import com.cdac.moneymanager.entity.ProfileEntity;
import com.cdac.moneymanager.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class AppUserDetailsService implements UserDetailsService {
    private final ProfileRepository profileRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        ProfileEntity existingProfile =profileRepository.findByEmail(email).orElseThrow(()->new UsernameNotFoundException("Profile Not Found:"+email));

    return User.builder()
            .username(existingProfile.getEmail())
            .password(existingProfile.getPassword())
            .authorities(Collections.emptyList())
            .build();
    }
}
