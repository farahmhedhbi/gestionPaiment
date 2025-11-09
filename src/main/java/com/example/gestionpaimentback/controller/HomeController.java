package com.example.gestionpaimentback.controller;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/home")
public class HomeController {

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'FORMATEUR', 'COORDINATEUR')")
    public Map<String, Object> getHome(HttpServletRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        HttpSession session = request.getSession(false);

        System.out.println("HomeController appelé");
        System.out.println("Utilisateur: " + authentication.getName());
        System.out.println("Authentifié: " + authentication.isAuthenticated());
        System.out.println("Rôles: " + authentication.getAuthorities());
        System.out.println("Classe: " + authentication.getClass().getSimpleName());
        System.out.println("Session: " + (session != null ? session.getId() : "AUCUNE"));


        if (authentication instanceof AnonymousAuthenticationToken ||
                !authentication.isAuthenticated() ||
                "anonymousUser".equals(authentication.getName())) {

            System.out.println(" ACCÈS REFUSÉ - UTILISATEUR ANONYME");
            throw new AccessDeniedException("Accès non autorisé");
        }

        Map<String, Object> homeData = new HashMap<>();
        homeData.put("message", "Bienvenue sur la page d'accueil!");
        homeData.put("user", authentication.getName());
        homeData.put("username", authentication.getName());
        homeData.put("authenticated", authentication.isAuthenticated());
        homeData.put("roles", authentication.getAuthorities()
                .stream()
                .map(auth -> auth.getAuthority())
                .collect(Collectors.toList()));
        homeData.put("timestamp", System.currentTimeMillis());
        homeData.put("sessionActive", session != null);
        homeData.put("sessionId", session != null ? session.getId() : "none");

        System.out.println("Données envoyées à l'utilisateur: " + authentication.getName());

        return homeData;
    }
}