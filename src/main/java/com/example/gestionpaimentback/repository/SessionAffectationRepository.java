package com.example.gestionpaimentback.repository;

import com.example.gestionpaimentback.entity.SessionAffectation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SessionAffectationRepository extends JpaRepository<SessionAffectation, Long> {

    List<SessionAffectation> findByFormateurId(Long formateurId);

    List<SessionAffectation> findByCoordinateurId(Long coordinateurId);

    boolean existsBySessionIdAndFormateurId(Long sessionId, Long formateurId);
}
