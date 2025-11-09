package com.example.gestionpaimentback.config;

import com.example.gestionpaimentback.entity.Role;
import com.example.gestionpaimentback.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Override
    public void run(String... args) throws Exception {
        // Créer les rôles
        if (roleRepository.findByName(Role.ERole.ROLE_ADMIN).isEmpty()) {
            roleRepository.save(new Role(Role.ERole.ROLE_ADMIN));
            System.out.println("Role ADMIN créé");
        }
        if (roleRepository.findByName(Role.ERole.ROLE_FORMATEUR).isEmpty()) {
            roleRepository.save(new Role(Role.ERole.ROLE_FORMATEUR));
            System.out.println("Role FORMATEUR créé");
        }
        if (roleRepository.findByName(Role.ERole.ROLE_COORDINATEUR).isEmpty()) {
            roleRepository.save(new Role(Role.ERole.ROLE_COORDINATEUR));
            System.out.println("Role COORDINATEUR créé");
        }

        System.out.println("Tous les rôles sont initialisés!");
    }
}