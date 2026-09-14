package com.example.demo.repository;

import com.example.demo.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Integer> {

    // LEFT JOIN FETCH を使うことで、resource が NULL のタスクも取得できます
    @Query("SELECT t FROM Task t LEFT JOIN FETCH t.resource")
    List<Task> findAllWithResource();
}