package com.deliveryfood.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.deliveryfood.backend.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByRole(User.Role role);
}
