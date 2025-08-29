package com.deliveryfood.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.deliveryfood.backend.model.Restaurant;

public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {
    List<Restaurant> findByNameContainingIgnoreCaseOrAddressContainingIgnoreCase(String name, String address);

    List<Restaurant> findAllByOrderByNameAsc();
    List<Restaurant> findAllByOrderByNameDesc();

    List<Restaurant> findAllByOrderByAddressAsc();
    List<Restaurant> findAllByOrderByAddressDesc();
}
