package com.example.demo.controller;

import com.example.demo.dto.RegisterRequestDto;
import com.example.demo.entity.UserAccount;
import com.example.demo.service.UserAccountService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
// ※ モノリス構成のため @CrossOrigin は不要ですが、残しておいても動作に影響はありません
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
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(Map.of("message", "未認証です"));
        }

        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("username", authentication.getName());
        userInfo.put("roles", authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList()));

        return ResponseEntity.ok(userInfo);
    }
}
