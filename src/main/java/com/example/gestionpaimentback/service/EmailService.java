package com.example.gestionpaimentback.service;

import com.example.gestionpaimentback.entity.VerificationCode;
import com.example.gestionpaimentback.entity.User;
import com.example.gestionpaimentback.repository.VerificationCodeRepository;
import com.example.gestionpaimentback.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import java.util.Random;
import java.util.Optional;

@Service
public class EmailService {

    @Autowired
    private VerificationCodeRepository verificationCodeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JavaMailSender emailSender;

    // Générer un code à 6 chiffres
    public String genererCode() {
        Random random = new Random();
        return String.valueOf(100000 + random.nextInt(900000));
    }

    // ENVOYER EMAIL
    public void envoyerCode(String emailUtilisateur, String code) {
        try {
            // 1. Préparer l'email
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(emailUtilisateur);
            message.setSubject("🔐 Ton code de vérification");
            message.setText(
                    "Bonjour !\n\n" +
                            "Ton code de vérification est : " + code + "\n\n" +
                            "Utilise-le pour te connecter à l'application.\n\n" +
                            "L'équipe Gestion Paiement"
            );

            // 2. Envoyer l'email
            emailSender.send(message);

            // 3. Confirmation
            System.out.println("✅ EMAIL ENVOYÉ : " + emailUtilisateur);
            System.out.println("🔑 CODE : " + code);

        } catch (Exception e) {
            // Si erreur, on montre le code dans la console
            System.out.println("❌ Email non envoyé, mais CODE DISPONIBLE :");
            System.out.println("📧 Pour : " + emailUtilisateur);
            System.out.println("🔑 Code : " + code);
            System.out.println("📋 Copie ce code pour te connecter !");
        }
    }

    // Vérifier si l'utilisateur a déjà reçu un code (première connexion)
    public boolean isPremiereConnexion(String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            return user.getStatus() == 0; // status 0 = première connexion
        }
        return false;
    }

    // Sauvegarder et envoyer le code UNIQUEMENT pour la première connexion
    public void sauvegarderEtEnvoyerCode(String email) {
        try {
            // Vérifier si c'est la première connexion
            if (!isPremiereConnexion(email)) {
                System.out.println("ℹ️ Utilisateur déjà vérifié, pas d'envoi de code");
                return;
            }

            // 1. Invalider anciens codes
            verificationCodeRepository.invalidatePreviousCodes(email);

            // 2. Générer nouveau code
            String code = genererCode();

            // 3. Sauvegarder en base
            VerificationCode verificationCode = new VerificationCode(email, code);
            verificationCodeRepository.save(verificationCode);

            // 4. Envoyer par email
            envoyerCode(email, code);

            System.out.println("✅ Code envoyé pour première connexion : " + email);

        } catch (Exception e) {
            System.out.println("❌ Erreur envoi code : " + e.getMessage());
        }
    }

    // Vérifier le code et activer l'utilisateur
    public boolean verifierCodeEtActiver(String email, String code) {
        try {
            Optional<VerificationCode> verificationCode =
                    verificationCodeRepository.findByEmailAndCodeAndUsedFalse(email, code);

            if (verificationCode.isPresent()) {
                VerificationCode vc = verificationCode.get();

                if (vc.isExpired()) {
                    return false;
                }

                // Marquer le code comme utilisé
                vc.setUsed(true);
                verificationCodeRepository.save(vc);

                // Activer l'utilisateur (changer status de 0 à 1)
                Optional<User> userOptional = userRepository.findByEmail(email);
                if (userOptional.isPresent()) {
                    User user = userOptional.get();
                    user.setStatus(1); // Activer l'utilisateur
                    userRepository.save(user);
                    System.out.println("✅ Utilisateur activé : " + email);
                }

                return true;
            }

            return false;

        } catch (Exception e) {
            System.out.println("❌ Erreur vérification : " + e.getMessage());
            return false;
        }
    }
}