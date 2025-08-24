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
    private UserRepository userRepository;

    @Autowired
    private MenuRepository menuRepository;

    @PostMapping("/create")
    public Map<String, Object> createOrder(@RequestBody Order order) {
        Map<String, Object> response = new LinkedHashMap<>();

        try {
            // ✅ validasi customer
            if (order.getCustomer() == null || order.getCustomer().getId() == null) {
                response.put("message", "Customer is required");
                response.put("data", null);
                return response;
            }

            User customer = userRepository.findById(order.getCustomer().getId()).orElse(null);
            if (customer == null) {
                response.put("message", "Customer with ID " + order.getCustomer().getId() + " not found");
                response.put("data", null);
                return response;
            }
            order.setCustomer(customer);

            // ✅ simpan order kosong dulu biar dapet ID
            Order savedOrder = orderRepository.save(order);

            double subtotal = 0.0;
            Set<Long> restoIds = new HashSet<>();

            // ✅ proses item
            if (order.getItems() != null) {
                for (OrderItem item : order.getItems()) {
                    if (item.getMenu() != null && item.getMenu().getId() != null) {
                        Menu menu = menuRepository.findById(item.getMenu().getId())
                                .orElseThrow(() -> new RuntimeException(
                                        "Menu with ID " + item.getMenu().getId() + " not found"));

                        item.setMenu(menu);
                        item.setOrder(savedOrder);

                        // hitung subtotal
                        subtotal += menu.getPrice() * item.getQuantity();

                        // kumpulin restoId
                        if (menu.getRestaurant() != null) {
                            restoIds.add(menu.getRestaurant().getId());
                        }

                        orderItemRepository.save(item);
                    }
                }
            }

            // ✅ hitung ongkir: 5rb + (resto - 1) * 2rb
            double deliveryFee = 0.0;
            if (!restoIds.isEmpty()) {
                deliveryFee = 5000 + (restoIds.size() - 1) * 2000;
            }

            savedOrder.setDeliveryFee(deliveryFee);
            savedOrder.setTotalPrice(subtotal + deliveryFee);

            // ✅ update order dengan harga final
            savedOrder = orderRepository.save(savedOrder);

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
            if (orderDetails.getStatus() != null) {
                existing.setStatus(orderDetails.getStatus());
            }
            if (orderDetails.getTotalPrice() != null) {
                existing.setTotalPrice(orderDetails.getTotalPrice());
            }
            if (orderDetails.getDeliveryFee() != null) {
                existing.setDeliveryFee(orderDetails.getDeliveryFee());
            }

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
}
