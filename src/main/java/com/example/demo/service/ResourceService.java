package com.example.demo.service;

import com.example.demo.entity.Resource;
import com.example.demo.repository.ResourceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ResourceService {

    private final ResourceRepository resourceRepository;

    public ResourceService(ResourceRepository resourceRepository) {
        this.resourceRepository = resourceRepository;
    }

    // 全リソース（担当者情報）取得
    public List<Resource> findAllResources() {
        return resourceRepository.findAll();
    }

    // ID指定でリソース取得
    public Optional<Resource> findResourceById(Integer id) {
        return resourceRepository.findById(id);
    }

    // 新規リソース（担当者）登録
    @Transactional
    public Resource createResource(Resource resource) {
        return resourceRepository.save(resource);
    }

    // リソース（担当者）更新（PUT）
    @Transactional
    public Resource updateResource(Integer id, Resource resourceDetails) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource not found: " + id));

        resource.setName(resourceDetails.getName());
        resource.setDepartment(resourceDetails.getDepartment());
        resource.setPosition(resourceDetails.getPosition());
        resource.setEmail(resourceDetails.getEmail());

        return resourceRepository.save(resource);
    }

    // リソース（担当者）削除（DELETE）
    @Transactional
    public void deleteResource(Integer id) {
        if (!resourceRepository.existsById(id)) {
            throw new RuntimeException("Resource not found: " + id);
        }
        resourceRepository.deleteById(id);
    }
}