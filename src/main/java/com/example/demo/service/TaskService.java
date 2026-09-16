package com.example.demo.service;

import com.example.demo.dto.TaskRequestDto;
import com.example.demo.entity.Resource;
import com.example.demo.entity.Task;
import com.example.demo.repository.ResourceRepository;
import com.example.demo.repository.TaskRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final ResourceRepository resourceRepository;

    public TaskService(TaskRepository taskRepository, ResourceRepository resourceRepository) {
        this.taskRepository = taskRepository;
        this.resourceRepository = resourceRepository;
    }

    // 全タスク取得
    public List<Task> findAllTasks() {
        return taskRepository.findAll();
    }

    // ID指定でタスク取得
    public Optional<Task> findTaskById(Integer id) {
        return taskRepository.findById(id);
    }

    // タスクの新規登録（POST）
    @Transactional
    public Task createTask(TaskRequestDto dto) {
        Task task = new Task();
        copyDtoToEntity(dto, task);
        return taskRepository.save(task);
    }

    // タスクの更新（PUT）
    @Transactional
    public Task updateTask(Integer id, TaskRequestDto dto) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found: " + id));

        copyDtoToEntity(dto, task);
        return taskRepository.save(task);
    }

    // タスクの削除（DELETE）
    @Transactional
    public void deleteTask(Integer id) {
        if (!taskRepository.existsById(id)) {
            throw new RuntimeException("Task not found: " + id);
        }
        taskRepository.deleteById(id);
    }

    // DTOからTaskエンティティへのデータ移送処理（共通化）
    private void copyDtoToEntity(TaskRequestDto dto, Task task) {
        task.setTaskName(dto.getTaskName());
        task.setDeadline(dto.getDeadline());
        task.setComplete(dto.getComplete());
        task.setCheckFlag(dto.getCheckFlag() != null ? dto.getCheckFlag() : false);

        if (dto.getResourceId() != null) {
            Resource resource = resourceRepository.findById(dto.getResourceId())
                    .orElseThrow(() -> new RuntimeException("Resource not found: " + dto.getResourceId()));
            task.setResource(resource);
        } else {
            task.setResource(null);
        }
    }
}