package com.deliveryfood.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.deliveryfood.backend.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
}
