package com.example.demo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @GetMapping("/dashboard")
    public ResponseEntity<String> getAdminDashboard(Authentication authentication) {
        String username = (authentication != null) ? authentication.getName() : "Unknown";
        return ResponseEntity.ok("管理者専用ダッシュボードへようこそ！ ログインユーザー: " + username);
    }
}