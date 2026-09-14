package com.example.demo.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "user_account")
public class UserAccount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password; // BCryptでハッシュ化されたパスワードを保存

    @Column(nullable = false)
    private String role; // "ROLE_USER", "ROLE_ADMIN" を保存

    // JPA用の引数なしコンストラクタ（必須）
    public UserAccount() {}

    // 初期化用の便利コンストラクタ
    public UserAccount(String username, String password, String role) {
        this.username = username;
        this.password = password;
        this.role = role;
    }

    // ゲッター・セッター
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}