package com.example.demo.controller;

import com.example.demo.dto.RegisterRequestDto;
import com.example.demo.entity.UserAccount;
import com.example.demo.service.UserAccountService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserAccountService userAccountService;

    public AuthController(UserAccountService userAccountService) {
        this.userAccountService = userAccountService;
    }

    /**
     * ユーザー新規登録（認証不要）
     * POST /api/auth/register
     */
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequestDto dto) {
        UserAccount registeredUser = userAccountService.registerUser(dto);
        return ResponseEntity.ok("ユーザー登録が完了しました。ID: " + registeredUser.getId());
    }

    /**
     * ログイン確認エンドポイント（要認証）
     * GET /api/auth/me
     */
    @GetMapping("/me")
    public ResponseEntity<String> getCurrentUser(Authentication authentication) {
        return ResponseEntity.ok("ログイン成功: " + authentication.getName());
    }
}