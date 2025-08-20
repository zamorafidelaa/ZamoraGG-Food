package com.deliveryfood.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.deliveryfood.backend.model.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {
}