package com.cdac.moneymanager.controller;

import com.cdac.moneymanager.dto.AuthDTO;
import com.cdac.moneymanager.dto.ProfileDTO;
import com.cdac.moneymanager.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

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

    @GetMapping("/activate")
    public ResponseEntity<String> activateProile(@RequestParam String token)
    {
        boolean isActivated=profileService.activateProfile(token);
        if(isActivated)
        {
            return ResponseEntity.ok("Profile is Activated");
        }
        else{
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Activation token not found or already used");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String,Object>> login(@RequestBody AuthDTO authDTO) {
        try {
            if (!profileService.isAccountActive(authDTO.getEmail())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of(
                        "message", "Account not active. Please check your email for activation."
                ));
            }

            Map<String,Object> response = profileService.authentiacteAndGenerateToken(authDTO);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                    "message", "Invalid email or password",
                    "error", e.getMessage()  // More detailed error (optional)
            ));
        }
    }

    @GetMapping("/test")
    public String test()
    {
        return "Test Successful";
    }

    @GetMapping("/profile")
    public ResponseEntity<ProfileDTO> getPublicProfile()
    {
        ProfileDTO profileDTO=profileService.getPublicProfile(null);
        return ResponseEntity.ok(profileDTO);
    }


}

