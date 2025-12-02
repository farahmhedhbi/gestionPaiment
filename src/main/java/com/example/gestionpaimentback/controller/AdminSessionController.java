package com.example.gestionpaimentback.controller;

import com.example.gestionpaimentback.dto.SessionRequest;
import com.example.gestionpaimentback.entity.Session;
import com.example.gestionpaimentback.entity.SessionAffectation;
import com.example.gestionpaimentback.service.SessionService;

import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api/admin/session")
public class AdminSessionController {

    private final SessionService sessionService;

    public AdminSessionController(SessionService sessionService) {
        this.sessionService = sessionService;
    }

    // 📌 Récupérer toutes les sessions
    @GetMapping("/all")
    public List<Session> getAll() {
        return sessionService.getAllSessions();
    }

    // 📌 Créer une session
    @PostMapping("/create")
    public Session create(@RequestBody SessionRequest request) {
        return sessionService.createSession(request);
    }

    // 📌 Supprimer une session
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        sessionService.deleteSession(id);
    }

    // 📌 NOUVEAU : Ajouter une affectation (formateur + coordinateur)
    @PostMapping("/{sessionId}/affecter")
    public SessionAffectation affecter(
            @PathVariable Long sessionId,
            @RequestParam Long formateurId,
            @RequestParam Long coordinateurId
    ) {
        return sessionService.addAffectation(sessionId, formateurId, coordinateurId);
    }
}
