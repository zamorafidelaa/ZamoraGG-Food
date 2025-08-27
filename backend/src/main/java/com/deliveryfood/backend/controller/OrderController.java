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

                        // ✅ Set harga per unit dari menu
                        item.setPrice(menu.getPrice());

                        // ✅ Hitung total per item (price × qty)
                        double totalItem = menu.getPrice() * item.getQuantity();
                        item.setTotalPriceItem(totalItem);

                        // ✅ Tambah ke subtotal
                        subtotal += totalItem;

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

    @GetMapping("/customer/{customerId}/history")
public Map<String, Object> getCustomerOrderHistory(@PathVariable Long customerId) {
    Map<String, Object> response = new LinkedHashMap<>();

    Optional<User> customerOpt = userRepository.findById(customerId);
    if (customerOpt.isEmpty() || customerOpt.get().getRole() != User.Role.CUSTOMER) {
        response.put("message", "Customer not found");
        response.put("data", null);
        return response;
    }

    List<Order> orders = orderRepository.findByCustomerId(customerId); // pastikan repository ada
    // urutkan dari terbaru
    orders.sort((o1, o2) -> o2.getCreatedAt().compareTo(o1.getCreatedAt()));

    response.put("message", "Order history retrieved successfully");
    response.put("data", orders);
    return response;
}

@GetMapping("/reports")
public Map<String, Object> getRevenueReport(@RequestParam(defaultValue = "daily") String type) {
    Map<String, Object> response = new LinkedHashMap<>();

    List<Order> allOrders = orderRepository.findAll();
    Map<String, Double> report = new LinkedHashMap<>();

    System.out.println("Total orders found: " + allOrders.size());
    for (Order o : allOrders) {
        System.out.println("Order ID: " + o.getId() +
                ", createdAt=" + o.getCreatedAt() +
                ", totalPrice=" + o.getTotalPrice());
    }

    switch (type.toLowerCase()) {
        case "daily":
            report = allOrders.stream()
                    .collect(Collectors.groupingBy(
                            o -> o.getCreatedAt()
                                    .atZone(java.time.ZoneId.systemDefault())
                                    .toLocalDate()
                                    .toString(),
                            TreeMap::new,
                            Collectors.summingDouble(Order::getTotalPrice)
                    ));
            response.put("type", "daily");
            break;

        case "monthly":
            report = allOrders.stream()
                    .collect(Collectors.groupingBy(
                            o -> {
                                var date = o.getCreatedAt()
                                        .atZone(java.time.ZoneId.systemDefault())
                                        .toLocalDate();
                                return date.getYear() + "-" + String.format("%02d", date.getMonthValue());
                            },
                            TreeMap::new,
                            Collectors.summingDouble(Order::getTotalPrice)
                    ));
            response.put("type", "monthly");
            break;

        case "yearly":
            report = allOrders.stream()
                    .collect(Collectors.groupingBy(
                            o -> String.valueOf(
                                    o.getCreatedAt().atZone(java.time.ZoneId.systemDefault()).getYear()
                            ),
                            TreeMap::new,
                            Collectors.summingDouble(Order::getTotalPrice)
                    ));
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
