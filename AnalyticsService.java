package com.example.SkillForge.repository;

import com.example.SkillForge.entity.Announcement;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {
    List<Announcement> findByTargetRoleInOrderByCreatedAtDesc(List<String> roles);
}
