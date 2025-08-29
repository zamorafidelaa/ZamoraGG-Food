package com.deliveryfood.backend.controller;

import java.util.*;
import java.util.stream.Collectors;

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

    @Autowired
    private CourierAssignmentRepository courierAssignmentRepository;

    // ================= CREATE ORDER =================
    @PostMapping("/create")
    public Map<String, Object> createOrder(@RequestBody Order order) {
        Map<String, Object> response = new LinkedHashMap<>();

        try {
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

            if (customer.getStreet() == null || customer.getCity() == null || customer.getPostalCode() == null) {
                response.put("message", "Customer address is incomplete. Please update your address.");
                response.put("data", null);
                return response;
            }

            Order savedOrder = orderRepository.save(order);

            double subtotal = 0.0;
            Set<Long> restoIds = new HashSet<>();

            if (order.getItems() != null) {
                for (OrderItem item : order.getItems()) {
                    if (item.getMenu() != null && item.getMenu().getId() != null) {
                        Menu menu = menuRepository.findById(item.getMenu().getId())
                                .orElseThrow(() -> new RuntimeException(
                                        "Menu with ID " + item.getMenu().getId() + " not found"));

                        item.setMenu(menu);
                        item.setOrder(savedOrder);

                        item.setPrice(menu.getPrice());
                        double totalItem = menu.getPrice() * item.getQuantity();
                        item.setTotalPriceItem(totalItem);
                        subtotal += totalItem;

                        if (menu.getRestaurant() != null) {
                            restoIds.add(menu.getRestaurant().getId());
                        }

                        orderItemRepository.save(item);
                    }
                }
            }

            double deliveryFee = !restoIds.isEmpty() ? 5000 + (restoIds.size() - 1) * 2000 : 0.0;

            savedOrder.setDeliveryFee(deliveryFee);
            savedOrder.setTotalPrice(subtotal + deliveryFee);
            savedOrder = orderRepository.save(savedOrder);

            Map<String, Object> dataWithAddress = new LinkedHashMap<>();
            dataWithAddress.put("order", savedOrder);
            dataWithAddress.put("address", Map.of(
                    "street", customer.getStreet(),
                    "city", customer.getCity(),
                    "postalCode", customer.getPostalCode(),
                    "phone", customer.getPhone()));

            response.put("message", "Order successfully created");
            response.put("data", dataWithAddress);

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

    // ================= ASSIGN COURIER =================
    @PostMapping("/{orderId}/assign/{courierId}")
    public Map<String, Object> assignCourier(@PathVariable Long orderId, @PathVariable Long courierId) {
        Map<String, Object> response = new LinkedHashMap<>();

        Order order = orderRepository.findById(orderId).orElse(null);
        User courier = userRepository.findById(courierId).orElse(null);

        if (order == null) {
            response.put("message", "Order not found");
            response.put("data", null);
            return response;
        }
        if (courier == null || courier.getRole() != User.Role.COURIER) {
            response.put("message", "Courier not found or invalid");
            response.put("data", null);
            return response;
        }

        CourierAssignment assignment = new CourierAssignment();
        assignment.setOrder(order);
        assignment.setCourier(courier);

        order.setCourierAssignment(assignment);

        courierAssignmentRepository.save(assignment);
        orderRepository.save(order); 

        response.put("message", "Courier assigned successfully");
        response.put("data", assignment);
        return response;
    }

    // ================= CUSTOMER HISTORY =================
    @GetMapping("/customer/{customerId}/history")
    public Map<String, Object> getCustomerOrderHistory(@PathVariable Long customerId) {
        Map<String, Object> response = new LinkedHashMap<>();

        Optional<User> customerOpt = userRepository.findById(customerId);
        if (customerOpt.isEmpty() || customerOpt.get().getRole() != User.Role.CUSTOMER) {
            response.put("message", "Customer not found");
            response.put("data", null);
            return response;
        }

        List<Order> orders = orderRepository.findByCustomerId(customerId);
        orders.sort((o1, o2) -> o2.getCreatedAt().compareTo(o1.getCreatedAt()));

        List<Map<String, Object>> orderResponses = orders.stream().map(order -> {
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("id", order.getId());
            map.put("status", order.getStatus());
            map.put("createdAt", order.getCreatedAt());
            map.put("totalPrice", order.getTotalPrice());
            map.put("deliveryFee", order.getDeliveryFee());
            map.put("items", order.getItems());

            String courierName = null;
            if (order.getCourierAssignment() != null && order.getCourierAssignment().getCourier() != null) {
                courierName = order.getCourierAssignment().getCourier().getName();
            }
            map.put("courierName", courierName);

            return map;
        }).collect(Collectors.toList());

        response.put("message", "Order history retrieved successfully");
        response.put("data", orderResponses);
        return response;
    }

    // ================= REPORT =================
    @GetMapping("/reports")
    public Map<String, Object> getRevenueReport(@RequestParam(defaultValue = "daily") String type) {
        Map<String, Object> response = new LinkedHashMap<>();

        List<Order> allOrders = orderRepository.findAll();
        Map<String, Double> report = new LinkedHashMap<>();

        switch (type.toLowerCase()) {
            case "daily":
                report = allOrders.stream()
                        .collect(Collectors.groupingBy(
                                o -> o.getCreatedAt().atZone(java.time.ZoneId.systemDefault()).toLocalDate().toString(),
                                TreeMap::new,
                                Collectors.summingDouble(Order::getTotalPrice)));
                response.put("type", "daily");
                break;

            case "monthly":
                report = allOrders.stream()
                        .collect(Collectors.groupingBy(
                                o -> {
                                    var date = o.getCreatedAt().atZone(java.time.ZoneId.systemDefault()).toLocalDate();
                                    return date.getYear() + "-" + String.format("%02d", date.getMonthValue());
                                },
                                TreeMap::new,
                                Collectors.summingDouble(Order::getTotalPrice)));
                response.put("type", "monthly");
                break;

            case "yearly":
                report = allOrders.stream()
                        .collect(Collectors.groupingBy(
                                o -> String
                                        .valueOf(o.getCreatedAt().atZone(java.time.ZoneId.systemDefault()).getYear()),
                                TreeMap::new,
                                Collectors.summingDouble(Order::getTotalPrice)));
                response.put("type", "yearly");
                break;

            default:
                response.put("error", "Invalid type. Use: daily, monthly, or yearly");
                return response;
        }

        response.put("orders_count", allOrders.size());
        response.put("report", report);
        response.put("message", "Revenue report (" + type + ") generated successfully");

        return response;
    }

}
