package com.deliveryfood.backend.controller;

import com.deliveryfood.backend.model.CourierAssignment;
import com.deliveryfood.backend.model.Order;
import com.deliveryfood.backend.model.User;
import com.deliveryfood.backend.repository.CourierAssignmentRepository;
import com.deliveryfood.backend.repository.OrderRepository;
import com.deliveryfood.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
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
    public Map<String, Object> assignCourier(@PathVariable Long orderId, @PathVariable Long courierId) {
        Map<String, Object> response = new LinkedHashMap<>();

        Optional<Order> orderOpt = orderRepository.findById(orderId);
        Optional<User> courierOpt = userRepository.findById(courierId);

        if (orderOpt.isEmpty() || courierOpt.isEmpty()) {
            response.put("message", "Order or courier not found");
            response.put("data", null);
            return response;
        }

        // Cegah duplicate assignment
        List<CourierAssignment> existingAssignments = courierAssignmentRepository.findByOrder(orderOpt.get());
        if (!existingAssignments.isEmpty()) {
            response.put("message", "Order already has a courier assigned!");
            response.put("data", existingAssignments.get(0));
            return response;
        }

        User courier = courierOpt.get();
        if (courier.getRole() != User.Role.COURIER) {
            response.put("message", "Selected user is not a courier!");
            response.put("data", null);
            return response;
        }

        CourierAssignment assignment = new CourierAssignment();
        assignment.setOrder(orderOpt.get());
        assignment.setCourier(courier);
        assignment.setAssignedAt(Instant.now());

        CourierAssignment saved = courierAssignmentRepository.save(assignment);

        response.put("message", "Courier successfully assigned to order");
        response.put("data", saved);
        return response;
    }

    // === Get all assignments ===
    @GetMapping("/all")
    public Map<String, Object> getAllAssignments() {
        Map<String, Object> response = new LinkedHashMap<>();
        List<CourierAssignment> assignments = courierAssignmentRepository.findAll();
        response.put("message", "All courier assignments retrieved");
        response.put("data", assignments);
        return response;
    }

    // === Get assignments by courier ===
    @GetMapping("/courier/{courierId}")
    public Map<String, Object> getAssignmentsByCourier(@PathVariable Long courierId) {
        Map<String, Object> response = new LinkedHashMap<>();
        Optional<User> courierOpt = userRepository.findById(courierId);

        if (courierOpt.isEmpty()) {
            response.put("message", "Courier not found");
            response.put("data", null);
            return response;
        }

        List<CourierAssignment> assignments = courierAssignmentRepository.findByCourier(courierOpt.get());
        response.put("message", "Assignments for courier retrieved");
        response.put("data", assignments);
        return response;
    }

    // === Get assignments by order ===
    @GetMapping("/order/{orderId}")
    public Map<String, Object> getAssignmentsByOrder(@PathVariable Long orderId) {
        Map<String, Object> response = new LinkedHashMap<>();
        Optional<Order> orderOpt = orderRepository.findById(orderId);

        if (orderOpt.isEmpty()) {
            response.put("message", "Order not found");
            response.put("data", null);
            return response;
        }

        List<CourierAssignment> assignments = courierAssignmentRepository.findByOrder(orderOpt.get());
        response.put("message", "Assignments for order retrieved");
        response.put("data", assignments);
        return response;
    }

    // === Update courier for an assignment ===
    @PutMapping("/update/{assignmentId}/{newCourierId}")
    public Map<String, Object> updateAssignment(
            @PathVariable Long assignmentId,
            @PathVariable Long newCourierId) {

        Map<String, Object> response = new LinkedHashMap<>();

        Optional<CourierAssignment> assignmentOpt = courierAssignmentRepository.findById(assignmentId);
        Optional<User> courierOpt = userRepository.findById(newCourierId);

        if (assignmentOpt.isEmpty() || courierOpt.isEmpty()) {
            response.put("message", "Assignment or courier not found");
            response.put("data", null);
            return response;
        }

        User newCourier = courierOpt.get();
        if (newCourier.getRole() != User.Role.COURIER) {
            response.put("message", "Selected user is not a courier!");
            response.put("data", null);
            return response;
        }

        CourierAssignment assignment = assignmentOpt.get();
        assignment.setCourier(newCourier);
        assignment.setAssignedAt(Instant.now()); // refresh waktu assign

        CourierAssignment updated = courierAssignmentRepository.save(assignment);
        response.put("message", "Courier assignment updated successfully");
        response.put("data", updated);

        return response;
    }

    // === Delete assignment ===
    @DeleteMapping("/delete/{assignmentId}")
    public Map<String, Object> deleteAssignment(@PathVariable Long assignmentId) {
        Map<String, Object> response = new LinkedHashMap<>();

        Optional<CourierAssignment> assignmentOpt = courierAssignmentRepository.findById(assignmentId);
        if (assignmentOpt.isEmpty()) {
            response.put("message", "Assignment not found");
            response.put("data", null);
            return response;
        }

        courierAssignmentRepository.delete(assignmentOpt.get());
        response.put("message", "Courier assignment deleted successfully");
        response.put("data", null);

        return response;
    }

    // === Get unassigned orders ===
    @GetMapping("/unassigned-orders")
    public Map<String, Object> getUnassignedOrders() {
        Map<String, Object> response = new LinkedHashMap<>();

        // Ambil semua order
        List<Order> allOrders = orderRepository.findAll();

        // Filter order yang belum punya assignment
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

}
