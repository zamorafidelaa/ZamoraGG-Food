package com.deliveryfood.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.deliveryfood.backend.model.Restaurant;

public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {
    List<Restaurant> findByNameContainingIgnoreCaseOrAddressContainingIgnoreCase(String name, String address);

    // Sorting ASC & DESC by Name
    List<Restaurant> findAllByOrderByNameAsc();
    List<Restaurant> findAllByOrderByNameDesc();

    // Sorting ASC & DESC by Address
    List<Restaurant> findAllByOrderByAddressAsc();
    List<Restaurant> findAllByOrderByAddressDesc();
}
