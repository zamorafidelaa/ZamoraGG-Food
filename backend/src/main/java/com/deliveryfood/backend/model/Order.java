package com.deliveryfood.backend.model;

import java.time.Instant;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // siapa customer yang buat order
    @ManyToOne
    @JoinColumn(name = "customer_id", referencedColumnName = "id")
    private User customer;

    @Enumerated(EnumType.STRING)
    private Status status;

    private Double totalPrice;
    private Double deliveryFee;
    private Instant createdAt = Instant.now();

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items;

    @OneToOne(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JsonIgnoreProperties("order")
    private CourierAssignment courierAssignment;

    public enum Status {
        PENDING,
        ASSIGNED,
        PICKED_UP,
        ON_DELIVERY,
        DELIVERED
    }

    @JsonProperty("customerName")
    public String getCustomerName() {
        return customer != null ? customer.getName() : null;
    }
}
