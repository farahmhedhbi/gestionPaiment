package com.example.gestionpaimentback.controller;

import com.example.gestionpaimentback.entity.Session;
import com.example.gestionpaimentback.service.SessionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api/coordinateur")
public class CoordinateurSessionController {

    private final SessionService sessionService;

    public CoordinateurSessionController(SessionService sessionService) {
        this.sessionService = sessionService;
    }

    @GetMapping("/{id}/sessions")
    public List<Session> getSessions(@PathVariable Long id) {
        return sessionService.getSessionsByCoordinateur(id);
    }
}

