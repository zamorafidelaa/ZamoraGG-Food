package com.deliveryfood.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.deliveryfood.backend.model.CourierAssignment;
import com.deliveryfood.backend.model.Order;
import com.deliveryfood.backend.model.User;

public interface CourierAssignmentRepository extends JpaRepository<CourierAssignment, Long> {
    List<CourierAssignment> findByCourier(User courier);
    List<CourierAssignment> findByOrder(Order order);
}