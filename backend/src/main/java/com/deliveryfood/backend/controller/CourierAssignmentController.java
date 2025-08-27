package com.deliveryfood.backend.controller;

import com.deliveryfood.backend.model.CourierAssignment;
import com.deliveryfood.backend.model.Order;
import com.deliveryfood.backend.model.User;
import com.deliveryfood.backend.repository.CourierAssignmentRepository;
import com.deliveryfood.backend.repository.OrderRepository;
import com.deliveryfood.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.*;

@RestController
@RequestMapping("/courier-assignments")
public class CourierAssignmentController {

    @Autowired
    private CourierAssignmentRepository courierAssignmentRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    // === Assign courier to order ===
    @PostMapping("/assign/{orderId}/{courierId}")
    @Transactional
    public Map<String, Object> assignCourier(@PathVariable Long orderId, @PathVariable Long courierId) {
        Map<String, Object> response = new LinkedHashMap<>();

        try {
            Optional<Order> orderOpt = orderRepository.findById(orderId);
            Optional<User> courierOpt = userRepository.findById(courierId);

            if (orderOpt.isEmpty() || courierOpt.isEmpty()) {
                response.put("message", "Order or courier not found");
                response.put("data", null);
                return response;
            }

            Order order = orderOpt.get();
            User courier = courierOpt.get();

            if (courier.getRole() != User.Role.COURIER) {
                response.put("message", "Selected user is not a courier!");
                response.put("data", null);
                return response;
            }

            // Cegah duplicate assignment
            List<CourierAssignment> existing = courierAssignmentRepository.findByOrder(order);
            if (!existing.isEmpty()) {
                response.put("message", "Order already has a courier assigned!");
                response.put("data", existing.get(0));
                return response;
            }

            // Assign courier
            CourierAssignment assignment = new CourierAssignment();
            assignment.setOrder(order);
            assignment.setCourier(courier);
            assignment.setAssignedAt(Instant.now());

            CourierAssignment saved = courierAssignmentRepository.save(assignment);

            // Update order status
            order.setStatus(Order.Status.ASSIGNED);
            orderRepository.save(order);

            response.put("message", "Courier successfully assigned to order");
            response.put("data", saved);
        } catch (Exception e) {
            response.put("message", "Failed to assign courier: " + e.getMessage());
            response.put("data", null);
        }

        return response;
    }

    // === Get all unassigned orders ===
    @GetMapping("/unassigned-orders")
    public Map<String, Object> getUnassignedOrders() {
        Map<String, Object> response = new LinkedHashMap<>();
        List<Order> allOrders = orderRepository.findAll();
        List<Order> unassigned = new ArrayList<>();

        for (Order o : allOrders) {
            List<CourierAssignment> assignments = courierAssignmentRepository.findByOrder(o);
            if (assignments.isEmpty()) {
                unassigned.add(o);
            }
        }

        response.put("message", "Unassigned orders retrieved successfully");
        response.put("data", unassigned);
        return response;
    }

    // === Get all available couriers (no current assignment) ===
    @GetMapping("/available-couriers")
    public Map<String, Object> getAvailableCouriers() {
        Map<String, Object> response = new LinkedHashMap<>();

        // semua user dengan role COURIER
        List<User> couriers = userRepository.findByRole(User.Role.COURIER);

        // filter yang belum ada assignment aktif (status ASSIGNED atau ON_DELIVERY)
        List<User> available = new ArrayList<>();
        for (User c : couriers) {
            boolean busy = c.getAssignments().stream()
                    .anyMatch(a -> a.getOrder().getStatus() == Order.Status.ASSIGNED
                                || a.getOrder().getStatus() == Order.Status.ON_DELIVERY);
            if (!busy) available.add(c);
        }

        response.put("message", "Available couriers retrieved successfully");
        response.put("data", available);
        return response;
    }

    // === Get orders assigned to a courier ===
@GetMapping("/courier-orders/{courierId}")
public Map<String, Object> getOrdersForCourier(@PathVariable Long courierId) {
    Map<String, Object> response = new LinkedHashMap<>();

    Optional<User> courierOpt = userRepository.findById(courierId);
    if (courierOpt.isEmpty() || courierOpt.get().getRole() != User.Role.COURIER) {
        response.put("message", "Courier not found");
        response.put("data", null);
        return response;
    }

    List<CourierAssignment> assignments = courierAssignmentRepository.findByCourier(courierOpt.get());
    List<Order> orders = new ArrayList<>();
    for (CourierAssignment a : assignments) {
        orders.add(a.getOrder());
    }

    response.put("message", "Orders for courier retrieved");
    response.put("data", orders);
    return response;
}

// === Update order status (by courier) ===
@PutMapping("/update-status/{orderId}/{courierId}")
@Transactional
public Map<String, Object> updateOrderStatus(
        @PathVariable Long orderId,
        @PathVariable Long courierId,
        @RequestParam("status") Order.Status status) {

    Map<String, Object> response = new LinkedHashMap<>();

    Optional<Order> orderOpt = orderRepository.findById(orderId);
    Optional<User> courierOpt = userRepository.findById(courierId);

    if (orderOpt.isEmpty() || courierOpt.isEmpty()) {
        response.put("message", "Order or courier not found");
        response.put("data", null);
        return response;
    }

    Order order = orderOpt.get();
    User courier = courierOpt.get();

    // Pastikan order ini memang ditugaskan ke kurir ini
    List<CourierAssignment> assignments = courierAssignmentRepository.findByOrder(order);
    boolean assignedToCourier = assignments.stream()
            .anyMatch(a -> a.getCourier().getId().equals(courierId));

    if (!assignedToCourier) {
        response.put("message", "This order is not assigned to this courier");
        response.put("data", null);
        return response;
    }

    // Update status
    order.setStatus(status);
    orderRepository.save(order);

    response.put("message", "Order status updated successfully");
    response.put("data", order);
    return response;
}

// === Update order status by courier ===
@PutMapping("/update-status/{orderId}")
public Map<String, Object> updateOrderStatus(
        @PathVariable Long orderId,
        @RequestBody Map<String, String> body) {

    Map<String, Object> response = new LinkedHashMap<>();
    Optional<Order> orderOpt = orderRepository.findById(orderId);

    if (orderOpt.isEmpty()) {
        response.put("message", "Order not found");
        response.put("data", null);
        return response;
    }

    Order order = orderOpt.get();
    String newStatus = body.get("status");
    try {
        order.setStatus(Order.Status.valueOf(newStatus));
        orderRepository.save(order);
        response.put("message", "Order status updated successfully");
        response.put("data", order);
    } catch (Exception e) {
        response.put("message", "Failed to update status: " + e.getMessage());
        response.put("data", null);
    }

    return response;
}

// Get all orders for a customer
@GetMapping("/customer-orders/{customerId}")
public Map<String, Object> getCustomerOrders(@PathVariable Long customerId) {
    Map<String, Object> response = new LinkedHashMap<>();

    List<Order> orders = orderRepository.findByCustomerId(customerId);
    response.put("message", "Customer orders retrieved successfully");
    response.put("data", orders);
    return response;
}

}
