package com.deliveryfood.backend.controller;

import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.deliveryfood.backend.model.*;
import com.deliveryfood.backend.repository.*;

@RestController
@RequestMapping("/orders")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private CourierAssignmentRepository courierAssignmentRepository;

    @Autowired
    private UserRepository userRepository; 

    @PostMapping("/create")
    public Map<String, Object> createOrder(@RequestBody Order order) {
        Map<String, Object> response = new LinkedHashMap<>();

        try {
            if (order.getCustomer() != null && order.getCustomer().getId() != null) {
                User customer = userRepository.findById(order.getCustomer().getId()).orElse(null);
                if (customer == null) {
                    response.put("message", "Customer with ID " + order.getCustomer().getId() + " not found");
                    response.put("data", null);
                    return response;
                }
                order.setCustomer(customer);
            }

            Order savedOrder = orderRepository.save(order);

            if (order.getItems() != null) {
                for (OrderItem item : order.getItems()) {
                    item.setOrder(savedOrder);
                    orderItemRepository.save(item);
                }
            }

            savedOrder = orderRepository.findById(savedOrder.getId()).orElse(null);
            response.put("message", "Order successfully created");
            response.put("data", savedOrder);
        } catch (Exception e) {
            response.put("message", "Failed to create order: " + e.getMessage());
            response.put("data", null);
        }

        return response;
    }

    @GetMapping("/get")
    public Map<String, Object> getAllOrders() {
        Map<String, Object> response = new LinkedHashMap<>();
        List<Order> orders = orderRepository.findAll();
        response.put("message", "Successfully retrieved all orders");
        response.put("data", orders);
        return response;
    }

    @GetMapping("/get/{id}")
    public Map<String, Object> getOrderById(@PathVariable Long id) {
        Map<String, Object> response = new LinkedHashMap<>();
        Order order = orderRepository.findById(id).orElse(null);
        if (order == null) {
            response.put("message", "Order with ID " + id + " not found");
            response.put("data", null);
        } else {
            response.put("message", "Successfully retrieved order with ID " + id);
            response.put("data", order);
        }
        return response;
    }

    @PutMapping("/update/{id}")
    public Map<String, Object> updateOrder(@PathVariable Long id, @RequestBody Order orderDetails) {
        Map<String, Object> response = new LinkedHashMap<>();
        Order existing = orderRepository.findById(id).orElse(null);

        if (existing == null) {
            response.put("message", "Order with ID " + id + " not found");
            response.put("data", null);
        } else {
            existing.setStatus(orderDetails.getStatus());
            existing.setTotalPrice(orderDetails.getTotalPrice());
            existing.setDeliveryFee(orderDetails.getDeliveryFee());
            Order updated = orderRepository.save(existing);

            response.put("message", "Order with ID " + id + " successfully updated");
            response.put("data", updated);
        }
        return response;
    }

    @DeleteMapping("/delete/{id}")
    public Map<String, Object> deleteOrder(@PathVariable Long id) {
        Map<String, Object> response = new LinkedHashMap<>();
        Order order = orderRepository.findById(id).orElse(null);

        if (order == null) {
            response.put("message", "Order with ID " + id + " not found");
            response.put("data", null);
        } else {
            orderRepository.delete(order);
            response.put("message", "Order with ID " + id + " successfully deleted");
            response.put("data", order);
        }
        return response;
    }

    @PostMapping("/{orderId}/assign-courier/{courierId}")
    public Map<String, Object> assignCourier(@PathVariable Long orderId, @PathVariable Long courierId) {
        Map<String, Object> response = new LinkedHashMap<>();
        Order order = orderRepository.findById(orderId).orElse(null);
        User courier = userRepository.findById(courierId).orElse(null);

        if (order == null || courier == null) {
            response.put("message", "Order or Courier not found");
            response.put("data", null);
            return response;
        }

        CourierAssignment assignment = new CourierAssignment();
        assignment.setOrder(order);
        assignment.setCourier(courier);
        courierAssignmentRepository.save(assignment);

        order.setStatus(Order.Status.ASSIGNED);
        orderRepository.save(order);

        response.put("message", "Courier successfully assigned to order");
        response.put("data", assignment);
        return response;
    }
}
