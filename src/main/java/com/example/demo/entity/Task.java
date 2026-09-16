package com.example.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonGetter;

@Entity
@Table(name = "task")
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "task_id")
    @JsonProperty("taskId")
    private Integer taskId;

    @Column(name = "taskname", length = 255)
    @JsonProperty("taskName")
    private String taskName;

    @JsonProperty("deadline")
    private LocalDate deadline;

    @JsonProperty("complete")
    private LocalDate complete;

    @Column(name = "check_flag")
    @JsonProperty("checkFlag")
    private Boolean checkFlag;

    // DBの resource_id カラム直接操作用
    @Column(name = "resource_id", insertable = false, updatable = false)
    private Integer resourceId;

    // Resource との多対1リレーション設定
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "resource_id")
    private Resource resource;

    // --- JSON出力用 ---

    @JsonGetter("resourceName")
    public String getResourceName() {
        return (resource != null) ? resource.getName() : null;
    }

    @JsonGetter("resourceId")
    public Integer getResourceId() {
        if (this.resourceId != null) return this.resourceId;
        return (resource != null) ? resource.getResourceId() : null;
    }

    // --- ゲッター・セッター ---

    public Integer getTaskId() { return taskId; }
    public void setTaskId(Integer taskId) { this.taskId = taskId; }

    @JsonProperty("taskName")
    public String getTaskName() { return taskName; }

    @JsonProperty("taskName")
    public void setTaskName(String taskName) { this.taskName = taskName; }

    public LocalDate getDeadline() { return deadline; }
    public void setDeadline(LocalDate deadline) { this.deadline = deadline; }

    public LocalDate getComplete() { return complete; }
    public void setComplete(LocalDate complete) { this.complete = complete; }

    public Boolean getCheckFlag() { return checkFlag; }
    public void setCheckFlag(Boolean checkFlag) { this.checkFlag = checkFlag; }

    public Resource getResource() { return resource; }
    public void setResource(Resource resource) { this.resource = resource; }

    public void setResourceId(Integer resourceId) { this.resourceId = resourceId; }
}