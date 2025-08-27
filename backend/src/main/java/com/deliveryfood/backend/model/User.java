package com.deliveryfood.backend.model;

import java.util.List;
import java.util.Optional;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.Data;

@Entity
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String email;
    private String password;
    @Enumerated(EnumType.STRING)
    private Role role;

    public enum Role {
        ADMIN, COURIER, CUSTOMER
    }

    @OneToMany(mappedBy = "courier")
    @JsonIgnore // supaya Jackson tidak looping saat serialisasi JSON
    private List<CourierAssignment> assignments;

    public List<CourierAssignment> getAssignments() {
        return assignments;
    }

}
