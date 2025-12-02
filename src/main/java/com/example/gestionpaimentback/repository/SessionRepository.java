package com.example.gestionpaimentback.repository;

import com.example.gestionpaimentback.entity.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;

public interface SessionRepository extends JpaRepository<Session, Long> {

    // Vérifier doublon : même classe + même semestre
    List<Session> findByClasseAndSemestre(String classe, String semestre);

    // BONUS : charger affectations automatiquement si tu veux
    @Query("SELECT DISTINCT s FROM Session s LEFT JOIN FETCH s.affectations")
    List<Session> findAllWithAffectations();

    @Query("SELECT s FROM Session s WHERE (s.dateDebut <= :dateFin AND s.dateFin >= :dateDebut)")
    List<Session> findSessionsChevauchantes(LocalDate dateDebut, LocalDate dateFin);
}
