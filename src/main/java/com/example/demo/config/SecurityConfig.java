package com.example.demo.config;

import org.jspecify.annotations.NullMarked;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
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
@NullMarked
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) {
        http
                // CORS設定の有効化
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // H2 Console と API 用に CSRF を無効化
                .csrf(csrf -> csrf.ignoringRequestMatchers("/h2-console/**", "/api/**"))

                // リクエストの認可設定
                .authorizeHttpRequests(auth -> auth
                        // 1. プレフライトリクエスト(OPTIONS)は無条件で許可
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // 2. H2 Console へのアクセスを完全許可（文字列パス指定）
                        .requestMatchers("/h2-console/**").permitAll()

                        // 3. ログイン確認エンドポイント（/api/auth/me）は認証試行用に許可
                        .requestMatchers("/api/auth/me").permitAll()

                        // 4. 新規ユーザー登録 API は ROLE_ADMIN 権限を持つユーザーのみ許可
                        .requestMatchers("/api/auth/register").hasRole("ADMIN")

                        // 5. その他の API・リクエストはログイン認証が必要
                        .anyRequest().authenticated()
                )

                // H2 Console 用：sameOrigin からの frame/iframe 表示を許可
                .headers(headers -> headers
                        .frameOptions(HeadersConfigurer.FrameOptionsConfig::sameOrigin)
                )

                // Basic認証を有効化
                .httpBasic(Customizer.withDefaults());

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // 5173 と 5174 の両方を許可（Viteのポート自動繰り上がり対策）
        configuration.setAllowedOrigins(List.of(
                "http://localhost:5173",
                "http://localhost:5174"
        ));

        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}