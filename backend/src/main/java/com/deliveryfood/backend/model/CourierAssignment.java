package com.deliveryfood.backend.model;

import java.time.Instant;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class CourierAssignment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "order_id", referencedColumnName = "id", unique = true) 
    @JsonIgnoreProperties("courierAssignment")
    private Order order;

    @ManyToOne
    @JoinColumn(name = "courier_id", referencedColumnName = "id")
    private User courier;

    private Instant assignedAt = Instant.now();
}
