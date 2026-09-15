package com.example.demo.controller;

import com.example.demo.entity.Resource;
import com.example.demo.service.ResourceService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resources")
@CrossOrigin(origins = "*") // CORSエラー防止
public class ResourceController {

    private final ResourceService resourceService;

    public ResourceController(ResourceService resourceService) {
        this.resourceService = resourceService;
    }

    /**
     * 全リソース取得
     * GET http://localhost:8080/api/resources
     */
    @GetMapping
    public List<Resource> getAllResources() {
        return resourceService.findAllResources();
    }

    /**
     * ID指定による単体リソース取得（詳細画面・編集用）★追加
     * GET http://localhost:8080/api/resources/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<Resource> getResourceById(@PathVariable Integer id) {
        Resource resource = resourceService.findResourceById(id);
        return ResponseEntity.ok(resource);
    }

    /**
     * 新規リソース登録
     * POST http://localhost:8080/api/resources
     */
    @PostMapping
    public ResponseEntity<Resource> createResource(@RequestBody Resource resource) {
        Resource createdResource = resourceService.createResource(resource);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdResource); // 201 Created を返却
    }

    /**
     * リソース更新
     * PUT http://localhost:8080/api/resources/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<Resource> updateResource(@PathVariable Integer id, @RequestBody Resource resourceDetails) {
        Resource updatedResource = resourceService.updateResource(id, resourceDetails);
        return ResponseEntity.ok(updatedResource);
    }

    /**
     * リソース削除
     * DELETE http://localhost:8080/api/resources/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResource(@PathVariable Integer id) {
        resourceService.deleteResource(id);
        return ResponseEntity.noContent().build(); // 204 No Content
    }
}