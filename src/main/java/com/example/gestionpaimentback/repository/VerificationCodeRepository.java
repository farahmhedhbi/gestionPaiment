package com.example.gestionpaimentback.repository;

import com.example.gestionpaimentback.entity.VerificationCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;

@Repository
public interface VerificationCodeRepository extends JpaRepository<VerificationCode, Long> {

    Optional<VerificationCode> findByEmailAndCodeAndUsedFalse(String email, String code);

    @Modifying
    @Transactional
    @Query("UPDATE VerificationCode v SET v.used = true WHERE v.email = ?1 AND v.used = false")
    void invalidatePreviousCodes(String email);

    //  méthode pour trouver le code actif le plus récent
    Optional<VerificationCode> findTopByEmailAndUsedFalseOrderByCreatedAtDesc(String email);
}