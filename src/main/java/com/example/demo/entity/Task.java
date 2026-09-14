package com.example.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonGetter;

@Entity
@Table(name = "task")
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "task_id")
    private Integer taskId;

    @Column(length = 255)
    private String taskname;

    private LocalDate deadline;
    private LocalDate complete;

    @Column(name = "check_flag")
    private Boolean checkFlag;

    // Resource との多対1リレーション設定
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resource_id")
    @JsonIgnore // JSON出力時に resource オブジェクト全体を除外する
    private Resource resource;

    // --- JSON出力用：Resource の名前だけを「resourceName」として出力 ---
    @JsonGetter("resourceName")
    public String getResourceName() {
        return (resource != null) ? resource.getName() : null;
    }

    // ゲッター・セッター
    public Integer getTaskId() { return taskId; }
    public void setTaskId(Integer taskId) { this.taskId = taskId; }
    public String getTaskname() { return taskname; }
    public void setTaskname(String taskname) { this.taskname = taskname; }
    public LocalDate getDeadline() { return deadline; }
    public void setDeadline(LocalDate deadline) { this.deadline = deadline; }
    public LocalDate getComplete() { return complete; }
    public void setComplete(LocalDate complete) { this.complete = complete; }
    public Boolean getCheckFlag() { return checkFlag; }
    public void setCheckFlag(Boolean checkFlag) { this.checkFlag = checkFlag; }
    public Resource getResource() { return resource; }
    public void setResource(Resource resource) { this.resource = resource; }
}