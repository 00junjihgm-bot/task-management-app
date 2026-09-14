package com.example.demo.controller;

import com.example.demo.entity.Resource;
import com.example.demo.service.ResourceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resources")
@CrossOrigin(origins = "*") // CORSエラー防止
public class ResourceController {

    private final ResourceService resourceService;

    // ResourceService をコンストラクタで注入
    public ResourceController(ResourceService resourceService) {
        this.resourceService = resourceService;
    }

    /**
     * 全リソース（担当者情報）取得エンドポイント
     * GET http://localhost:8080/api/resources
     */
    @GetMapping
    public List<Resource> getAllResources() {
        return resourceService.findAllResources();
    }

    /**
     * 新規リソース（担当者）登録エンドポイント
     * POST http://localhost:8080/api/resources
     */
    @PostMapping
    public Resource createResource(@RequestBody Resource resource) {
        return resourceService.createResource(resource);
    }

    /**
     * リソース（担当者）更新エンドポイント
     * PUT http://localhost:8080/api/resources/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<Resource> updateResource(@PathVariable Integer id, @RequestBody Resource resourceDetails) {
        Resource updatedResource = resourceService.updateResource(id, resourceDetails);
        return ResponseEntity.ok(updatedResource);
    }

    /**
     * リソース（担当者）削除エンドポイント
     * DELETE http://localhost:8080/api/resources/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResource(@PathVariable Integer id) {
        resourceService.deleteResource(id);
        return ResponseEntity.noContent().build(); // 204 No Content
    }
}