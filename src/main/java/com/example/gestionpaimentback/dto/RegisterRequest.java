package com.example.gestionpaimentback.dto;

import java.util.Set;

public class RegisterRequest {
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private Set<String> roles; // "admin", "formateur", "coordinateur"

    // Constructeurs
    public RegisterRequest() {}

    public RegisterRequest(String firstName, String lastName, String email, String password, Set<String> roles) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.roles = roles;
    }

    // Getters et Setters
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public Set<String> getRoles() { return roles; }
    public void setRoles(Set<String> roles) { this.roles = roles; }
}