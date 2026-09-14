package com.example.demo.dto;

import java.time.LocalDate;

public class TaskRequestDto {

    private String taskname;
    private LocalDate deadline;
    private LocalDate complete;
    private Boolean checkFlag;
    private Integer resourceId; // 担当者のID

    // ゲッター・セッター
    public String getTaskname() { return taskname; }
    public void setTaskname(String taskname) { this.taskname = taskname; }

    public LocalDate getDeadline() { return deadline; }
    public void setDeadline(LocalDate deadline) { this.deadline = deadline; }

    public LocalDate getComplete() { return complete; }
    public void setComplete(LocalDate complete) { this.complete = complete; }

    public Boolean getCheckFlag() { return checkFlag; }
    public void setCheckFlag(Boolean checkFlag) { this.checkFlag = checkFlag; }

    public Integer getResourceId() { return resourceId; }
    public void setResourceId(Integer resourceId) { this.resourceId = resourceId; }
}