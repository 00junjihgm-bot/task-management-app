package com.example.demo.service;

import com.example.demo.dto.RegisterRequestDto;
import com.example.demo.entity.UserAccount;
import com.example.demo.repository.UserAccountRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserAccountService {

    private final UserAccountRepository userAccountRepository;
    private final PasswordEncoder passwordEncoder;

    public UserAccountService(UserAccountRepository userAccountRepository, PasswordEncoder passwordEncoder) {
        this.userAccountRepository = userAccountRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * 一般ユーザー登録（デフォルト: ROLE_USER）
     */
    @Transactional
    public UserAccount registerUser(RegisterRequestDto dto) {
        return createAccount(dto.getUsername(), dto.getPassword(), "ROLE_USER");
    }

    /**
     * 管理者ユーザー登録（ROLE_ADMIN）
     */
    @Transactional
    public UserAccount registerAdmin(RegisterRequestDto dto) {
        return createAccount(dto.getUsername(), dto.getPassword(), "ROLE_ADMIN");
    }

    /**
     * アカウント作成の共通ロジック
     */
    private UserAccount createAccount(String username, String password, String role) {
        // ユーザー名の重複チェック
        if (userAccountRepository.findByUsername(username).isPresent()) {
            throw new RuntimeException("このユーザー名は既に存在します: " + username);
        }

        UserAccount user = new UserAccount();
        user.setUsername(username);

        // パスワードを BCrypt で暗号化（ハッシュ化）してセット
        String encodedPassword = passwordEncoder.encode(password);
        user.setPassword(encodedPassword);

        // ロール（ROLE_USER または ROLE_ADMIN）をセット
        user.setRole(role);

        return userAccountRepository.save(user);
    }
}