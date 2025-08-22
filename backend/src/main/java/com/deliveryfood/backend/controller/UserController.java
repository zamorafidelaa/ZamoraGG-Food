package com.deliveryfood.backend.controller;

import com.deliveryfood.backend.model.User;
import com.deliveryfood.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/all")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerCustomer(@RequestBody User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Email already registered!"));
        }

        user.setRole(User.Role.CUSTOMER);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Customer registered successfully!"));
    }

    @PostMapping("/register/courier/{adminId}")
    public ResponseEntity<?> addCourier(@PathVariable Long adminId, @RequestBody User user) {
        Optional<User> admin = userRepository.findById(adminId);
        if (admin.isEmpty() || admin.get().getRole() != User.Role.ADMIN) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "Only admin can add courier!"));
        }

        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Email already registered!"));
        }

        user.setRole(User.Role.COURIER);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Courier registered successfully!"));
    }

// Edit kurir
@PutMapping("/courier/{adminId}/{courierId}")
public ResponseEntity<?> editCourier(
        @PathVariable Long adminId,
        @PathVariable Long courierId,
        @RequestBody User updatedUser) {

    Optional<User> admin = userRepository.findById(adminId);
    if (admin.isEmpty() || admin.get().getRole() != User.Role.ADMIN) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("message", "Only admin can edit courier!"));
    }

    Optional<User> courier = userRepository.findById(courierId);
    if (courier.isEmpty() || courier.get().getRole() != User.Role.COURIER) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", "Courier not found!"));
    }

    User c = courier.get();
    c.setName(updatedUser.getName());
    c.setEmail(updatedUser.getEmail());
    if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
        c.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
    }
    userRepository.save(c);

    return ResponseEntity.ok(Map.of("message", "Courier updated successfully!"));
}

// Delete kurir
@DeleteMapping("/courier/{adminId}/{courierId}")
public ResponseEntity<?> deleteCourier(
        @PathVariable Long adminId,
        @PathVariable Long courierId) {

    Optional<User> admin = userRepository.findById(adminId);
    if (admin.isEmpty() || admin.get().getRole() != User.Role.ADMIN) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("message", "Only admin can delete courier!"));
    }

    Optional<User> courier = userRepository.findById(courierId);
    if (courier.isEmpty() || courier.get().getRole() != User.Role.COURIER) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", "Courier not found!"));
    }

    userRepository.delete(courier.get());
    return ResponseEntity.ok(Map.of("message", "Courier deleted successfully!"));
}

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginUser) {
        Optional<User> user = userRepository.findByEmail(loginUser.getEmail());

        if (user.isPresent() && passwordEncoder.matches(loginUser.getPassword(), user.get().getPassword())) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Login successful");
            response.put("role", user.get().getRole());
            response.put("email", user.get().getEmail());
            response.put("id", user.get().getId()); // <--- tambahkan ini

            return ResponseEntity.ok(response);
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "Invalid email or password!"));
    }
}
