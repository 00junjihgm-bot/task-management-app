package com.example.demo.repository;

import com.example.demo.entity.UserAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserAccountRepository extends JpaRepository<UserAccount, Integer> {
    // ユーザー名で検索（重複チェック用）
    Optional<UserAccount> findByUsername(String username);
}