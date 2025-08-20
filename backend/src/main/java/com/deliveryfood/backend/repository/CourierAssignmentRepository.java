package com.deliveryfood.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.deliveryfood.backend.model.CourierAssignment;

public interface CourierAssignmentRepository extends JpaRepository<CourierAssignment, Long> {
}