package com.cdac.moneymanager.service;

import com.cdac.moneymanager.dto.AuthDTO;
import com.cdac.moneymanager.dto.ProfileDTO;
import com.cdac.moneymanager.entity.ProfileEntity;
import com.cdac.moneymanager.repository.ProfileRepository;
import com.cdac.moneymanager.util.JwtUtil;
import lombok.Builder;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final ProfileRepository profileRepository;
    private final EmailService  emailService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public ProfileDTO registerProfile(ProfileDTO profileDTO)
    {
        ProfileEntity newProfile=toEntity(profileDTO);
        newProfile.setActivationToken(UUID.randomUUID().toString());
        profileRepository.save(newProfile);
        String activationLink= "http://localhost:8080/api/v1.0/activate?token="+newProfile.getActivationToken();
        String subject="activate your Money Manager account";
        String body="Click on the following link to activate your account:"+activationLink;
        emailService.sendEmail(newProfile.getEmail(),subject,body);
        return toDTO(newProfile);
    }

    public boolean activateProfile(String activationToken) {
        return profileRepository.findByActivationToken(activationToken)
                .map(profile -> {
                    profile.setIsActive(true);
                    profileRepository.save(profile);
                    return true;
                })
                .orElse(false);
    }

    public boolean isAccountActive(String email)
    {
    return profileRepository.findByEmail(email)
            .map(ProfileEntity::getIsActive)
            .orElse(false);
    }

    public ProfileEntity getCurrentProfile()
    {
        Authentication authentication=SecurityContextHolder.getContext().getAuthentication();
        String email=authentication.getName();
        return profileRepository.findByEmail(email).orElseThrow(()->new UsernameNotFoundException("Profile not found with email address"));
    }
    public ProfileDTO getPublicProfile(String email)
    {
        ProfileEntity currentUser=null;
        if(email==null)
        {
            currentUser=getCurrentProfile();
        }
        else{
            currentUser=profileRepository.findByEmail(email)
                    .orElseThrow(()->new UsernameNotFoundException("Profile not found with email"+email));
        }
        return toDTO(currentUser);
    }

    public Map<String,Object> authentiacteAndGenerateToken(AuthDTO authDTO) {
        try {
            // Debug logs (optional, helps verify password match)
            ProfileEntity user = profileRepository.findByEmail(authDTO.getEmail())
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));
            boolean matches = passwordEncoder.matches(authDTO.getPassword(), user.getPassword());
            System.out.println("[DEBUG] Password matches: " + matches);

            // Authenticate
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(authDTO.getEmail(), authDTO.getPassword())
            );

            // Generate & return actual token
            String token = jwtUtil.generateToken(authDTO.getEmail());
            System.out.println("[DEBUG] Generated JWT: " + token);  // Log token for debugging

            return Map.of(
                    "token", token,  // ✅ Return the real token
                    "user", getPublicProfile(authDTO.getEmail())
            );
        } catch (Exception e) {
            e.printStackTrace();  // Log the full error
            throw new RuntimeException("Invalid email or password");
        }
    }

    public ProfileEntity toEntity(ProfileDTO profileDTO) {
        return ProfileEntity.builder()
                .fullName(profileDTO.getFullName())
                .email(profileDTO.getEmail())
                .password(passwordEncoder.encode(profileDTO.getPassword()))
                .profileImageUrl(profileDTO.getProfileImageUrl())
                .createdAt(profileDTO.getCreatedAt())
                .updatedAt(profileDTO.getUpdatedAt())
                .build();

    }
    public ProfileDTO toDTO(ProfileEntity profileEntity) {
        return ProfileDTO.builder()
                .id(profileEntity.getId())
                .fullName(profileEntity.getFullName())
                .email(profileEntity.getEmail())
                .profileImageUrl(profileEntity.getProfileImageUrl())
                .createdAt(profileEntity.getCreatedAt())
                .updatedAt(profileEntity.getUpdatedAt())
                .build();

    }


}

