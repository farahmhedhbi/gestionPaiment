package com.example.gestionpaimentback.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "session_affectations")
public class SessionAffectation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Une affectation appartient à une session
    @ManyToOne
    @JoinColumn(name = "session_id", nullable = false)
    @JsonBackReference   // 🔥 Empêche la boucle infinie JSON
    private Session session;

    @ManyToOne
    @JoinColumn(name = "formateur_id", nullable = false)
    private User formateur;

    @ManyToOne
    @JoinColumn(name = "coordinateur_id", nullable = false)
    private User coordinateur;

    private LocalDate dateAffectation = LocalDate.now();

    // GETTERS & SETTERS

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Session getSession() {
        return session;
    }

    public void setSession(Session session) {
        this.session = session;
    }

    public User getFormateur() {
        return formateur;
    }

    public void setFormateur(User formateur) {
        this.formateur = formateur;
    }

    public User getCoordinateur() {
        return coordinateur;
    }

    public void setCoordinateur(User coordinateur) {
        this.coordinateur = coordinateur;
    }

    public LocalDate getDateAffectation() {
        return dateAffectation;
    }

    public void setDateAffectation(LocalDate dateAffectation) {
        this.dateAffectation = dateAffectation;
    }
}
