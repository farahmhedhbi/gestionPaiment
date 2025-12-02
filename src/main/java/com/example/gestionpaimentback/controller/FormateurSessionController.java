package com.example.gestionpaimentback.controller;

import com.example.gestionpaimentback.entity.Session;
import com.example.gestionpaimentback.service.SessionService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
@RestController
@RequestMapping("/api/formateur")
public class FormateurSessionController {

    private final SessionService sessionService;

    public FormateurSessionController(SessionService sessionService) {
        this.sessionService = sessionService;
    }

    @GetMapping("/{id}/sessions")
    public List<Session> getSessions(@PathVariable Long id) {
        return sessionService.getSessionsByFormateur(id);
    }
}
