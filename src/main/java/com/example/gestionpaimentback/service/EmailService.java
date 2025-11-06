package com.example.gestionpaimentback.service;

import com.example.gestionpaimentback.entity.VerificationCode;
import com.example.gestionpaimentback.repository.VerificationCodeRepository;
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
            System.out.println(" EMAIL ENVOYÉ : " + emailUtilisateur);
            System.out.println(" CODE : " + code);

        } catch (Exception e) {
            // Si erreur, on montre le code dans la console
            System.out.println(" Email non envoyé, mais CODE DISPONIBLE :");
            System.out.println(" Pour : " + emailUtilisateur);
            System.out.println(" Code : " + code);
            System.out.println(" Copie ce code pour te connecter !");
        }
    }

    // Sauvegarder et envoyer le code
    public void sauvegarderEtEnvoyerCode(String email) {
        try {
            // 1. Invalider anciens codes
            verificationCodeRepository.invalidatePreviousCodes(email);

            // 2. Générer nouveau code
            String code = genererCode();

            // 3. Sauvegarder en base
            VerificationCode verificationCode = new VerificationCode(email, code);
            verificationCodeRepository.save(verificationCode);

            // 4. Envoyer par email
            envoyerCode(email, code);

        } catch (Exception e) {
            System.out.println("❌ Erreur : " + e.getMessage());
        }
    }

    // Vérifier le code
    public boolean verifierCode(String email, String code) {
        try {
            Optional<VerificationCode> verificationCode =
                    verificationCodeRepository.findByEmailAndCodeAndUsedFalse(email, code);

            if (verificationCode.isPresent()) {
                VerificationCode vc = verificationCode.get();

                if (vc.isExpired()) {
                    return false;
                }

                // Marquer comme utilisé
                vc.setUsed(true);
                verificationCodeRepository.save(vc);
                return true;
            }

            return false;

        } catch (Exception e) {
            System.out.println("❌ Erreur vérification : " + e.getMessage());
            return false;
        }
    }
}