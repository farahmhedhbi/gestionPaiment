package com.example.gestionpaimentback.service;

import com.example.gestionpaimentback.dto.SessionRequest;
import com.example.gestionpaimentback.entity.Session;
import com.example.gestionpaimentback.entity.SessionAffectation;
import com.example.gestionpaimentback.entity.User;
import com.example.gestionpaimentback.repository.SessionAffectationRepository;
import com.example.gestionpaimentback.repository.SessionRepository;
import com.example.gestionpaimentback.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class SessionService {

    private final SessionRepository sessionRepository;
    private final UserRepository userRepository;
    private final SessionAffectationRepository affectationRepository;

    public SessionService(
            SessionRepository sessionRepository,
            UserRepository userRepository,
            SessionAffectationRepository affectationRepository
    ) {
        this.sessionRepository = sessionRepository;
        this.userRepository = userRepository;
        this.affectationRepository = affectationRepository;
    }

    public List<Session> getAllSessions() {
        return sessionRepository.findAll();
    }

    public void deleteSession(Long id) {
        if (!sessionRepository.existsById(id)) {
            throw new IllegalArgumentException("Session introuvable avec ID : " + id);
        }
        sessionRepository.deleteById(id);
    }

    public Session createSession(SessionRequest request) {

        if (isEmpty(request.getClasse()))
            throw new IllegalArgumentException("La classe est obligatoire.");
        if (isEmpty(request.getSpecialite()))
            throw new IllegalArgumentException("La spécialité est obligatoire.");
        if (isEmpty(request.getPromotion()))
            throw new IllegalArgumentException("La promotion est obligatoire.");
        if (isEmpty(request.getNiveau()))
            throw new IllegalArgumentException("Le niveau est obligatoire.");
        if (isEmpty(request.getSemestre()))
            throw new IllegalArgumentException("Le semestre est obligatoire.");

        LocalDate dateDebut = request.getDateDebut();
        LocalDate dateFin = request.getDateFin();

        if (dateDebut.isBefore(LocalDate.now()))
            throw new IllegalArgumentException("La date de début ne peut pas être dans le passé.");
        if (dateFin.isBefore(LocalDate.now()))
            throw new IllegalArgumentException("La date de fin ne peut pas être dans le passé.");
        if (dateDebut.isAfter(dateFin))
            throw new IllegalArgumentException("La date de début doit être avant la date de fin.");

        Session s = new Session();
        s.setClasse(request.getClasse());
        s.setSpecialite(request.getSpecialite());
        s.setPromotion(request.getPromotion());
        s.setNiveau(request.getNiveau());
        s.setSemestre(request.getSemestre());
        s.setDateDebut(dateDebut);
        s.setDateFin(dateFin);

        return sessionRepository.save(s);
    }

    // AJOUT D'UNE AFFECTATION
    public SessionAffectation addAffectation(Long sessionId, Long formateurId, Long coordinateurId) {

        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session introuvable"));

        User formateur = userRepository.findById(formateurId)
                .orElseThrow(() -> new RuntimeException("Formateur introuvable"));

        User coordinateur = userRepository.findById(coordinateurId)
                .orElseThrow(() -> new RuntimeException("Coordinateur introuvable"));

        // Vérifier si le formateur participe déjà
        if (affectationRepository.existsBySessionIdAndFormateurId(sessionId, formateurId)) {
            throw new IllegalArgumentException("Ce formateur participe déjà à cette session !");
        }

        SessionAffectation aff = new SessionAffectation();
        aff.setSession(session);
        aff.setFormateur(formateur);
        aff.setCoordinateur(coordinateur);

        return affectationRepository.save(aff);
    }

    private boolean isEmpty(String value) {
        return value == null || value.trim().isEmpty();
    }// 🔵 Sessions d’un formateur
    public List<Session> getSessionsByFormateur(Long formateurId) {

        // 1) vérifier l'utilisateur
        User formateur = userRepository.findById(formateurId)
                .orElseThrow(() -> new RuntimeException("Formateur introuvable"));

        if (!formateur.hasRole("ROLE_FORMATEUR")) {
            throw new IllegalArgumentException("Cet utilisateur n'est pas un formateur.");
        }

        // 2) récupérer affectations
        List<SessionAffectation> affs = affectationRepository.findByFormateurId(formateurId);

        // 3) extraire les sessions
        return affs.stream()
                .map(SessionAffectation::getSession)
                .distinct()
                .toList();
    }

    // 🟣 Sessions d’un coordinateur
    public List<Session> getSessionsByCoordinateur(Long coordId) {

        User coordinateur = userRepository.findById(coordId)
                .orElseThrow(() -> new RuntimeException("Coordinateur introuvable"));

        if (!coordinateur.hasRole("ROLE_COORDINATEUR")) {
            throw new IllegalArgumentException("Cet utilisateur n'est pas un coordinateur.");
        }

        List<SessionAffectation> affs = affectationRepository.findByCoordinateurId(coordId);

        return affs.stream()
                .map(SessionAffectation::getSession)
                .distinct()
                .toList();
    }



}
