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
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

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
                    // ★ 1. CORS 設定を有効化（React からのアクセス許可）
                    .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                    .csrf(AbstractHttpConfigurer::disable)
                    .headers(headers -> headers.frameOptions(HeadersConfigurer.FrameOptionsConfig::disable))
                    .authorizeHttpRequests(auth -> auth
                            // 静的リソース・認証不要API・開発用リソースAPIを許可
                            .requestMatchers(
                                    "/",
                                    "/index.html",
                                    "/assets/**",
                                    "/favicon.ico",
                                    "/*.svg",
                                    "/h2-console/**",
                                    "/api/auth/**",
                                    "/api/resources/**" // ★ 2. CRUD用APIを許可
                            ).permitAll()

                            // 管理者専用エリア
                            .requestMatchers("/api/admin/**").hasRole("ADMIN")

                            // 一般ユーザー & 管理者共有エリア
                            .requestMatchers("/api/user/**").hasAnyRole("USER", "ADMIN")

                            // 上記以外のすべてのリクエストは認証が必要
                            .anyRequest().authenticated()
                    )
                    .formLogin(AbstractHttpConfigurer::disable)
                    .httpBasic(Customizer.withDefaults());

            return http.build();
        } catch (Exception e) {
            throw new RuntimeException("SecurityFilterChain 構築エラー", e);
        }
    }

    // ★ 3. React (Vite: localhost:5173) からの通信を許可する CORS 設定
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:5173"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}