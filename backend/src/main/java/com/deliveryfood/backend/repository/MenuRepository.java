package com.deliveryfood.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.deliveryfood.backend.model.Menu;

public interface MenuRepository extends JpaRepository<Menu, Long> {

    List<Menu> findByNameContainingIgnoreCase(String name);

}