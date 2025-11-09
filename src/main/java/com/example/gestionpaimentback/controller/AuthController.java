package com.example.gestionpaimentback.controller;

import com.example.gestionpaimentback.dto.*;
import com.example.gestionpaimentback.entity.User;
import com.example.gestionpaimentback.security.UserDetailsImpl;
import com.example.gestionpaimentback.service.AuthService;
import com.example.gestionpaimentback.service.EmailService;
import com.example.gestionpaimentback.service.UserDetailsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    @PostMapping("/signin")
    public ResponseEntity<?> initiateLogin(@RequestBody LoginRequest loginRequest) {
        try {
            System.out.println("CONNEXION TENTATIVE : " + loginRequest.getEmail());

            UserDetailsImpl userDetails = (UserDetailsImpl) userDetailsService.loadUserByUsername(loginRequest.getEmail());

            if (!passwordEncoder.matches(loginRequest.getPassword(), userDetails.getPassword())) {
                System.out.println(" MOT DE PASSE INCORRECT");
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("error", "Mot de passe invalide!");
                return ResponseEntity.badRequest().body(errorResponse);
            }

            System.out.println(" UTILISATEUR TROUVÉ - ENVOI DU CODE...");
            emailService.sauvegarderEtEnvoyerCode(loginRequest.getEmail());

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Code de vérification envoyé!");
            response.put("status", "code_sent");
            response.put("email", loginRequest.getEmail());
            response.put("nextStep", "verify_code");

            return ResponseEntity.ok(response);

        } catch (UsernameNotFoundException e) {
            System.out.println(" UTILISATEUR NON TROUVÉ : " + loginRequest.getEmail());
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Utilisateur non trouvé avec cet email");
            return ResponseEntity.badRequest().body(errorResponse);
        } catch (Exception e) {
            System.out.println(" ERREUR CONNEXION : " + e.getMessage());
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Erreur de connexion: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @PostMapping("/verify-code")
    public ResponseEntity<?> verifyCodeAndLogin(@RequestBody VerifyCodeRequest verifyCodeRequest, HttpServletRequest request) {
        try {
            System.out.println("VÉRIFICATION CODE : " + verifyCodeRequest.getEmail());

            boolean isValid = emailService.verifierCode(verifyCodeRequest.getEmail(), verifyCodeRequest.getCode());

            if (!isValid) {
                System.out.println("CODE INVALIDE : " + verifyCodeRequest.getCode());
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("error", "Code invalide ou expiré!");
                return ResponseEntity.badRequest().body(errorResponse);
            }

            UserDetailsImpl userDetails = (UserDetailsImpl) userDetailsService.loadUserByUsername(verifyCodeRequest.getEmail());


            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );


            SecurityContext securityContext = SecurityContextHolder.getContext();
            securityContext.setAuthentication(authentication);


            HttpSession session = request.getSession(true);
            session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, securityContext);
            session.setMaxInactiveInterval(86400);

            System.out.println(" CONNEXION RÉUSSIE : " + verifyCodeRequest.getEmail());
            System.out.println(" SESSION CRÉÉE - ID: " + session.getId());
            System.out.println(" UTILISATEUR AUTHENTIFIÉ: " + authentication.getName());
            System.out.println(" RÔLES: " + authentication.getAuthorities());

            List<String> roles = userDetails.getAuthorities().stream()
                    .map(item -> item.getAuthority())
                    .collect(Collectors.toList());

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Connexion réussie!");
            response.put("status", "success");
            response.put("userId", userDetails.getId());
            response.put("email", userDetails.getEmail());
            response.put("roles", roles);
            response.put("redirectTo", "/dashboard");
            response.put("sessionCreated", true);
            response.put("sessionId", session.getId());

            return ResponseEntity.ok(response);

        } catch (UsernameNotFoundException e) {
            System.out.println(" UTILISATEUR NON TROUVÉ LORS DE LA VÉRIFICATION");
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Utilisateur non trouvé");
            return ResponseEntity.badRequest().body(errorResponse);
        } catch (Exception e) {
            System.out.println("ERREUR VÉRIFICATION : " + e.getMessage());
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Erreur de vérification: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @PostMapping("/resend-code")
    public ResponseEntity<?> resendCode(@RequestBody ResendCodeRequest resendCodeRequest) {
        try {
            System.out.println(" RENVOI CODE : " + resendCodeRequest.getEmail());
            emailService.sauvegarderEtEnvoyerCode(resendCodeRequest.getEmail());

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Nouveau code envoyé!");
            response.put("status", "code_resent");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.out.println(" ERREUR RENVOI CODE : " + e.getMessage());
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Erreur lors de l'envoi du code: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest registerRequest) {
        try {
            System.out.println(" INSCRIPTION : " + registerRequest.getEmail());

            if (authService.existsByEmail(registerRequest.getEmail())) {
                System.out.println(" EMAIL DÉJÀ UTILISÉ : " + registerRequest.getEmail());
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("error", "Cet email est déjà utilisé!");
                return ResponseEntity.badRequest().body(errorResponse);
            }

            User user = authService.registerUser(registerRequest);
            System.out.println("UTILISATEUR INSCRIT : " + user.getEmail());

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Utilisateur inscrit avec succès!");
            response.put("userId", user.getId());
            response.put("email", user.getEmail());
            response.put("firstName", user.getFirstName());
            response.put("lastName", user.getLastName());
            response.put("roles", user.getRoles().stream()
                    .map(role -> role.getName().name())
                    .collect(Collectors.toList()));

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.out.println(" ERREUR INSCRIPTION : " + e.getMessage());
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Erreur lors de l'inscription: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @GetMapping("/check-auth")
    public ResponseEntity<?> checkAuthentication(HttpServletRequest request) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            HttpSession session = request.getSession(false);

            System.out.println(" CHECK-AUTH - User: " + authentication.getName());
            System.out.println(" CHECK-AUTH - Authenticated: " + authentication.isAuthenticated());
            System.out.println(" CHECK-AUTH - Session: " + (session != null ? session.getId() : "NO_SESSION"));

            if (authentication == null || !authentication.isAuthenticated() ||
                    authentication.getName().equals("anonymousUser")) {
                System.out.println(" UTILISATEUR NON AUTHENTIFIÉ");
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("error", "Non authentifié");
                return ResponseEntity.status(401).body(errorResponse);
            }

            boolean hasAccess = authentication.getAuthorities().stream()
                    .anyMatch(auth ->
                            auth.getAuthority().equals("ROLE_ADMIN") ||
                                    auth.getAuthority().equals("ROLE_FORMATEUR") ||
                                    auth.getAuthority().equals("ROLE_COORDINATEUR")
                    );

            if (hasAccess) {
                System.out.println(" UTILISATEUR AUTHENTIFIÉ : " + authentication.getName());
                Map<String, Object> response = new HashMap<>();
                response.put("authenticated", true);
                response.put("message", "Utilisateur authentifié");
                response.put("username", authentication.getName());
                response.put("roles", authentication.getAuthorities()
                        .stream()
                        .map(auth -> auth.getAuthority())
                        .collect(Collectors.toList()));
                response.put("sessionActive", session != null);
                return ResponseEntity.ok(response);
            } else {
                System.out.println("ACCÈS REFUSÉ - RÔLES INSUFFISANTS");
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("error", "Accès refusé - Rôles insuffisants");
                return ResponseEntity.status(403).body(errorResponse);
            }

        } catch (Exception e) {
            System.out.println(" ERREUR VÉRIFICATION AUTH : " + e.getMessage());
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Erreur de vérification: " + e.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    @GetMapping("/debug-session")
    public ResponseEntity<?> debugSession(HttpServletRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        HttpSession session = request.getSession(false);

        Map<String, Object> response = new HashMap<>();
        response.put("authenticated", authentication.isAuthenticated());
        response.put("username", authentication.getName());
        response.put("authorities", authentication.getAuthorities().toString());
        response.put("sessionExists", session != null);
        response.put("sessionId", session != null ? session.getId() : "NO_SESSION");
        response.put("authenticationClass", authentication.getClass().getSimpleName());

        System.out.println(" DEBUG SESSION:");
        System.out.println(" User: " + authentication.getName());
        System.out.println(" Auth: " + authentication.isAuthenticated());
        System.out.println(" Roles: " + authentication.getAuthorities());
        System.out.println(" Session: " + (session != null ? session.getId() : "NONE"));

        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        try {
            HttpSession session = request.getSession(false);
            if (session != null) {
                session.invalidate();
                System.out.println("SESSION INVALIDÉE : " + session.getId());
            }

            SecurityContextHolder.clearContext();

            Map<String, String> response = new HashMap<>();
            response.put("message", "Déconnexion réussie");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.out.println(" ERREUR DÉCONNEXION : " + e.getMessage());
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Erreur lors de la déconnexion");
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @GetMapping("/test")
    public ResponseEntity<?> testEndpoint() {
        System.out.println("🧪 TEST ENDPOINT APPELÉ");
        Map<String, String> response = new HashMap<>();
        response.put("message", "API Auth fonctionne!");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/test-email")
    public ResponseEntity<?> testEmail(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            System.out.println(" TEST EMAIL : " + email);

            emailService.sauvegarderEtEnvoyerCode(email);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Test d'email effectué!");
            response.put("email", email);
            response.put("status", "test_sent");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.out.println("ERREUR TEST EMAIL : " + e.getMessage());
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Erreur test email: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
}