package com.example.gestionpaimentback.dto;

public class ResendCodeRequest {
    private String email;

    // Constructeurs
    public ResendCodeRequest() {}

    public ResendCodeRequest(String email) {
        this.email = email;
    }

    // Getters et Setters
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}