package com.example.gestionpaimentback.controller;

import com.example.gestionpaimentback.entity.User;
import com.example.gestionpaimentback.service.AdminService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin("*")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/formateurs")
    public List<User> getFormateurs() {
        return adminService.getFormateurs();
    }

    @GetMapping("/coordinateurs")
    public List<User> getCoordinateurs() {
        return adminService.getCoordinateurs();
    }

    @DeleteMapping("/user/{id}")
    public String deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return "Utilisateur supprimé avec succès";
    }
}
