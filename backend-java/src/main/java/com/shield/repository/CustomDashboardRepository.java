package com.shield.repository;

import com.shield.entity.CustomDashboard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomDashboardRepository extends JpaRepository<CustomDashboard, Long> {
    List<CustomDashboard> findByUserId(Long userId);
    List<CustomDashboard> findByIsPublicTrue();
}
