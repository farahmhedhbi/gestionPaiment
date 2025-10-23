package com.example.gestionpaimentback.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/test")
public class TestController {

    @GetMapping("/public")
    public String allAccess() {
        return "Contenu public - Accessible à tous";
    }

    @GetMapping("/formateur")
    @PreAuthorize("hasRole('FORMATEUR') or hasRole('ADMIN') or hasRole('COORDINATEUR')")
    public String formateurAccess() {
        return "Contenu Formateur - Accessible aux formateurs, coordinateurs et admins";
    }

    @GetMapping("/coordinateur")
    @PreAuthorize("hasRole('COORDINATEUR') or hasRole('ADMIN')")
    public String coordinateurAccess() {
        return "Contenu Coordinateur - Accessible aux coordinateurs et admins";
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public String adminAccess() {
        return "Contenu Admin - Accessible uniquement aux administrateurs";
    }

    @GetMapping("/dashboard")
    @PreAuthorize("hasAnyRole('FORMATEUR', 'COORDINATEUR', 'ADMIN')")
    public String dashboard() {
        return "Tableau de bord - Accessible à tous les utilisateurs connectés";
    }
}