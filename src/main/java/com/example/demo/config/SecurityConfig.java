package com.example.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    @Order(0)
    public SecurityFilterChain securityFilterChain(HttpSecurity http) {
        try {
            http
                    .csrf(AbstractHttpConfigurer::disable)
                    .headers(headers -> headers.frameOptions(HeadersConfigurer.FrameOptionsConfig::disable))
                    .authorizeHttpRequests(auth -> auth
                            // 1. 未認証で許可する公開エンドポイント
                            .requestMatchers("/api/auth/**", "/h2-console/**", "/", "/index.html").permitAll()

                            // 2. 管理者専用エリア (DB上の "ROLE_ADMIN" が必要)
                            .requestMatchers("/api/admin/**").hasRole("ADMIN")

                            // 3. 一般ユーザー & 管理者共有エリア (DB上の "ROLE_USER" または "ROLE_ADMIN" が必要)
                            .requestMatchers("/api/user/**").hasAnyRole("USER", "ADMIN")

                            // 4. 上記以外のすべてのリクエストはログイン認証が必要
                            .anyRequest().authenticated()
                    )
                    .formLogin(AbstractHttpConfigurer::disable)
                    // ★ Basic 認証を有効化（これで Authorization ヘッダーが認識されます）
                    .httpBasic(Customizer.withDefaults());

            return http.build();
        } catch (Exception e) {
            throw new RuntimeException("SecurityFilterChain 構築エラー", e);
        }
    }
}