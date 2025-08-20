package com.deliveryfood.backend.controller;

import com.deliveryfood.backend.model.User;
import com.deliveryfood.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    // Get all users
    @GetMapping("/all")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Register Customer
    @PostMapping("/register/customer")
    public String registerCustomer(@RequestBody User user) {
        // Cek apakah email sudah ada
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return "Email already registered!";
        }
        user.setRole(User.Role.CUSTOMER);
        userRepository.save(user);
        return "Customer registered successfully!";
    }

    // Register Admin (hanya boleh 1)
    @PostMapping("/register/admin")
    public String registerAdmin(@RequestBody User user) {
        // Cek apakah email sudah ada
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return "Email already registered!";
        }
        Optional<User> existingAdmin = userRepository.findByRole(User.Role.ADMIN);
        if (existingAdmin.isPresent()) {
            return "Admin already exists!";
        }
        user.setRole(User.Role.ADMIN);
        userRepository.save(user);
        return "Admin registered successfully!";
    }

    // Tambah Courier (hanya bisa dibuat admin)
    @PostMapping("/register/courier/{adminId}")
    public String addCourier(@PathVariable Long adminId, @RequestBody User user) {
        Optional<User> admin = userRepository.findById(adminId);
        if (admin.isEmpty() || admin.get().getRole() != User.Role.ADMIN) {
            return "Only admin can add courier!";
        }

        // Cek apakah email sudah ada
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return "Email already registered!";
        }

        user.setRole(User.Role.COURIER);
        userRepository.save(user);
        return "Courier registered successfully!";
    }

    // Login
    @PostMapping("/login")
    public String login(@RequestBody User loginUser) {
        Optional<User> user = userRepository.findByEmail(loginUser.getEmail());
        if (user.isPresent() && user.get().getPassword().equals(loginUser.getPassword())) {
            return "Login successful as " + user.get().getRole();
        }
        return "Invalid email or password!";
    }
}
