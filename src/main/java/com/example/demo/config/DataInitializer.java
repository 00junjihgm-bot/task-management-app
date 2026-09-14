package com.example.demo.config;

import com.example.demo.entity.UserAccount;
import com.example.demo.repository.UserAccountRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserAccountRepository userAccountRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserAccountRepository userAccountRepository, PasswordEncoder passwordEncoder) {
        this.userAccountRepository = userAccountRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        String adminUsername = "admin";

        // admin ユーザーを取得、または新規作成
        UserAccount admin = userAccountRepository.findByUsername(adminUsername)
                .orElseGet(() -> {
                    UserAccount newAdmin = new UserAccount();
                    newAdmin.setUsername(adminUsername);
                    return newAdmin;
                });

        // パスワードとロール（ROLE_ADMIN）を確実に更新・保存
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setRole("ROLE_ADMIN");

        userAccountRepository.save(admin);
        System.out.println("=== [INIT] admin ユーザーのロールを ROLE_ADMIN に更新しました ===");
    }
}