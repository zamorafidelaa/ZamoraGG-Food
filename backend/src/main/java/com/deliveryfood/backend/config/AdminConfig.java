package com.deliveryfood.backend.config;

import com.deliveryfood.backend.model.User;
import com.deliveryfood.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.boot.CommandLineRunner;

@Configuration
public class AdminConfig implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public void run(String... args) throws Exception {
        boolean adminExists = userRepository.findAll().stream()
                .anyMatch(user -> user.getRole() == User.Role.ADMIN);

        if (!adminExists) {
            User admin = new User();
            admin.setName("Mora Fidela");
            admin.setEmail("mora@gmail.com");
            admin.setPassword(passwordEncoder.encode("mora123"));
            admin.setRole(User.Role.ADMIN);

            userRepository.save(admin);

            System.out.println("Admin default berhasil dibuat");
        }
    }
}
