package com.example.demo.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.List;

@Entity
@Table(name = "resource")
public class Resource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "resource_id")
    private Integer resourceId;

    @Column(nullable = false, length = 100)
    private String name;

    private String department;
    private String position;

    @Column(unique = true, length = 100)
    private String email;

    @OneToMany(mappedBy = "resource")
    @JsonIgnore // Resource 側からの Task 参照を無視して無限ループを防止
    private List<Task> tasks;

    // ゲッター・セッター（省略可: Lombok使用時）
    public Integer getResourceId() { return resourceId; }
    public void setResourceId(Integer resourceId) { this.resourceId = resourceId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public String getPosition() { return position; }
    public void setPosition(String position) { this.position = position; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public List<Task> getTasks() { return tasks; }
    public void setTasks(List<Task> tasks) { this.tasks = tasks; }
}