package com.example.gestionpaimentback.service;

import com.example.gestionpaimentback.entity.Role;
import com.example.gestionpaimentback.entity.User;
import com.example.gestionpaimentback.repository.RoleRepository;
import com.example.gestionpaimentback.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    public AdminService(UserRepository userRepository, RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

    public List<User> getFormateurs() {
        Role formateurRole = roleRepository.findByName(Role.ERole.ROLE_FORMATEUR)
                .orElseThrow(() -> new RuntimeException("Role FORMATEUR introuvable"));

        return userRepository.findUsersByRole(formateurRole);
    }

    public List<User> getCoordinateurs() {
        Role coordRole = roleRepository.findByName(Role.ERole.ROLE_COORDINATEUR)
                .orElseThrow(() -> new RuntimeException("Role COORDINATEUR introuvable"));

        return userRepository.findUsersByRole(coordRole);
    }

    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("Utilisateur introuvable");
        }
        userRepository.deleteById(id);
    }
}
