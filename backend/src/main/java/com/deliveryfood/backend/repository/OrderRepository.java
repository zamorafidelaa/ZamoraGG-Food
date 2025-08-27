package com.deliveryfood.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.deliveryfood.backend.model.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByCustomerId(Long customerId);

}