package com.example.gestionpaimentback.controller;


import com.example.gestionpaimentback.entity.User;
import com.example.gestionpaimentback.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/user")
public class UserProfileController {
    @Autowired
    private UserRepository userRepository;

    // Récupérer le profil utilisateur
    @GetMapping("/profile")
    @PreAuthorize("hasAnyRole('ADMIN', 'FORMATEUR', 'COORDINATEUR')")
    public ResponseEntity<?> getUserProfile() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();

            Optional<User> userOptional = userRepository.findByEmail(email);

            if (userOptional.isPresent()) {
                User user = userOptional.get();

                Map<String, Object> profileData = new HashMap<>();
                profileData.put("id", user.getId());
                profileData.put("firstName", user.getFirstName());
                profileData.put("lastName", user.getLastName());
                profileData.put("email", user.getEmail());
                profileData.put("cin", user.getCin());
                profileData.put("rib", user.getRib());
                profileData.put("bankName", user.getBankName());
                profileData.put("accountNumber", user.getAccountNumber());
                profileData.put("createdAt", user.getCreatedAt());

                return ResponseEntity.ok(profileData);
            } else {
                return ResponseEntity.status(404).body("Utilisateur non trouvé");
            }

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erreur serveur: " + e.getMessage());
        }
    }

    // Mettre à jour le profil utilisateur
    @PutMapping("/profile")
    @PreAuthorize("hasAnyRole('ADMIN', 'FORMATEUR', 'COORDINATEUR')")
    public ResponseEntity<?> updateUserProfile(@RequestBody Map<String, String> updateData) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();

            Optional<User> userOptional = userRepository.findByEmail(email);

            if (userOptional.isPresent()) {
                User user = userOptional.get();

                // Mettre à jour les champs
                if (updateData.containsKey("cin")) {
                    user.setCin(updateData.get("cin"));
                }
                if (updateData.containsKey("rib")) {
                    user.setRib(updateData.get("rib"));
                }
                if (updateData.containsKey("bankName")) {
                    user.setBankName(updateData.get("bankName"));
                }
                if (updateData.containsKey("accountNumber")) {
                    user.setAccountNumber(updateData.get("accountNumber"));
                }

                userRepository.save(user);

                Map<String, Object> response = new HashMap<>();
                response.put("message", "Profil mis à jour avec succès");
                response.put("user", user.getEmail());

                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(404).body("Utilisateur non trouvé");
            }

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erreur serveur: " + e.getMessage());
        }
    }
}
