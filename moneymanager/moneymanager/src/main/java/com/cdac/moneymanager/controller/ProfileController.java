package com.cdac.moneymanager.controller;

import com.cdac.moneymanager.dto.ProfileDTO;
import com.cdac.moneymanager.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class ProfileController {
    private final ProfileService profileService;

    @PostMapping("/register")
    public ResponseEntity<ProfileDTO> responseProfile(@RequestBody ProfileDTO profileDTO)
    {
            ProfileDTO registeredProfile=profileService.registerProfile(profileDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(registeredProfile);
    }
}
