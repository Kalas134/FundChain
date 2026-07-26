package com.fundchain.repository;

import com.fundchain.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByCreator_UserId(String userId);
}
