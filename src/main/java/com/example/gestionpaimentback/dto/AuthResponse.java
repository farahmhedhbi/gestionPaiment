package com.example.gestionpaimentback.dto;

import java.util.List;

public class AuthResponse {
    private String message;
    private Long userId;
    private String email;
    private String firstName;
    private String lastName;
    private List<String> roles;

    // Constructeurs
    public AuthResponse() {}

    public AuthResponse(String message, Long userId, String email, String firstName, String lastName, List<String> roles) {
        this.message = message;
        this.userId = userId;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.roles = roles;
    }

    // Getters et Setters
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public List<String> getRoles() { return roles; }
    public void setRoles(List<String> roles) { this.roles = roles; }
}
