package com.example.gestionpaimentback.controller;

import com.example.gestionpaimentback.dto.AuthResponse;
import com.example.gestionpaimentback.dto.LoginRequest;
import com.example.gestionpaimentback.dto.RegisterRequest;
import com.example.gestionpaimentback.entity.User;
import com.example.gestionpaimentback.security.UserDetailsImpl;
import com.example.gestionpaimentback.service.AuthService;
import com.example.gestionpaimentback.service.UserDetailsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        try {
            // Vérifier manuellement les credentials
            UserDetailsImpl userDetails = (UserDetailsImpl) userDetailsService.loadUserByUsername(loginRequest.getEmail());

            // Vérifier le mot de passe
            if (!passwordEncoder.matches(loginRequest.getPassword(), userDetails.getPassword())) {
                return ResponseEntity.badRequest().body("Error: Mot de passe invalide!");
            }

            // Authentifier l'utilisateur
            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(authentication);

            List<String> roles = userDetails.getAuthorities().stream()
                    .map(item -> item.getAuthority())
                    .collect(Collectors.toList());

            AuthResponse response = new AuthResponse(
                    "Connexion réussie!",
                    userDetails.getId(),
                    userDetails.getEmail(),
                    "",
                    "",
                    roles
            );

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest registerRequest) {
        if (authService.existsByEmail(registerRequest.getEmail())) {
            return ResponseEntity.badRequest().body("Error: Cet email est déjà utilisé!");
        }

        User user = authService.registerUser(registerRequest);

        AuthResponse response = new AuthResponse(
                "Utilisateur inscrit avec succès!",
                user.getId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getRoles().stream()
                        .map(role -> role.getName().name())
                        .collect(Collectors.toList())
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/test")
    public String testEndpoint() {
        return "API Auth fonctionne!";
    }
}