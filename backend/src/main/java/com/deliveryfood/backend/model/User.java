package com.deliveryfood.backend.model;

import java.util.List;

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

    private String street;
    private String city;
    private String postalCode;
    private String phone;

    @OneToMany(mappedBy = "courier")
    @JsonIgnore 
    private List<CourierAssignment> assignments;


    public List<CourierAssignment> getAssignments() {
        return assignments;
    }

    public enum Role {
        ADMIN, COURIER, CUSTOMER
    }
}
