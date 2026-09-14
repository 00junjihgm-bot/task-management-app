package com.example.demo.controller;

import com.example.demo.dto.TaskRequestDto;
import com.example.demo.entity.Task;
import com.example.demo.service.TaskService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*") // CORSエラー防止
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    /**
     * 全タスク取得エンドポイント
     * GET http://localhost:8080/api/tasks
     */
    @GetMapping
    public List<Task> getAllTasks() {
        return taskService.findAllTasks();
    }

    /**
     * 新規タスク登録エンドポイント
     * POST http://localhost:8080/api/tasks
     */
    @PostMapping
    public Task createTask(@RequestBody TaskRequestDto dto) {
        return taskService.createTask(dto);
    }

    /**
     * タスク更新エンドポイント
     * PUT http://localhost:8080/api/tasks/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable Integer id, @RequestBody TaskRequestDto dto) {
        Task updatedTask = taskService.updateTask(id, dto);
        return ResponseEntity.ok(updatedTask);
    }

    /**
     * タスク削除エンドポイント
     * DELETE http://localhost:8080/api/tasks/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Integer id) {
        taskService.deleteTask(id);
        return ResponseEntity.noContent().build(); // 204 No Content
    }
}