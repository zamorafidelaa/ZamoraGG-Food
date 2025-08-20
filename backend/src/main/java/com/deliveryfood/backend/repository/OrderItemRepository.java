package com.deliveryfood.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.deliveryfood.backend.model.OrderItem;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
}