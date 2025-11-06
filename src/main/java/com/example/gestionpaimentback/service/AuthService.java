package com.example.gestionpaimentback.service;

import com.example.gestionpaimentback.dto.RegisterRequest;
import com.example.gestionpaimentback.entity.Role;
import com.example.gestionpaimentback.entity.User;
import com.example.gestionpaimentback.repository.RoleRepository;
import com.example.gestionpaimentback.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.HashSet;
import java.util.Set;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public User registerUser(RegisterRequest registerRequest) {
        User user = new User();
        user.setFirstName(registerRequest.getFirstName());
        user.setLastName(registerRequest.getLastName());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));

        Set<Role> roles = new HashSet<>();

        // Si aucun rôle n'est spécifié, utiliser FORMATEUR par défaut
        if (registerRequest.getRoles() == null || registerRequest.getRoles().isEmpty()) {
            Role formateurRole = roleRepository.findByName(Role.ERole.ROLE_FORMATEUR)
                    .orElseThrow(() -> new RuntimeException("Error: Role FORMATEUR not found."));
            roles.add(formateurRole);
        } else {
            //  les rôles spécifiés
            registerRequest.getRoles().forEach(role -> {
                switch (role.toLowerCase()) {
                    case "admin":
                        Role adminRole = roleRepository.findByName(Role.ERole.ROLE_ADMIN)
                                .orElseThrow(() -> new RuntimeException("Error: Role ADMIN not found."));
                        roles.add(adminRole);
                        break;
                    case "coordinateur":
                        Role coordinateurRole = roleRepository.findByName(Role.ERole.ROLE_COORDINATEUR)
                                .orElseThrow(() -> new RuntimeException("Error: Role COORDINATEUR not found."));
                        roles.add(coordinateurRole);
                        break;
                    default:
                        // Par défaut, assigner FORMATEUR
                        Role formateurRole = roleRepository.findByName(Role.ERole.ROLE_FORMATEUR)
                                .orElseThrow(() -> new RuntimeException("Error: Role FORMATEUR not found."));
                        roles.add(formateurRole);
                }
            });
        }

        user.setRoles(roles);
        return userRepository.save(user);
    }
}