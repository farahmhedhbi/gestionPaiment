package com.example.gestionpaimentback.service;

import com.example.gestionpaimentback.entity.Role;
import com.example.gestionpaimentback.entity.User;
import com.example.gestionpaimentback.repository.RoleRepository;
import com.example.gestionpaimentback.repository.UserRepository;
import jakarta.transaction.Transactional;
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
    public List<User> getAllUsers() {
        return userRepository.findAll();
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

    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec l'ID: " + id));

        // Vider les collections avant suppression
        user.getRoles().clear();

        // Sauvegarder pour vider les relations
        userRepository.save(user);

        // Maintenant supprimer l'utilisateur
        userRepository.delete(user);
    }
}
