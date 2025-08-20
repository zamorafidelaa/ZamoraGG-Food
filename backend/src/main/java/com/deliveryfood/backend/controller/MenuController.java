package com.deliveryfood.backend.controller;

import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.deliveryfood.backend.model.Menu;
import com.deliveryfood.backend.model.Restaurant;
import com.deliveryfood.backend.repository.MenuRepository;
import com.deliveryfood.backend.repository.RestaurantRepository;

@RestController
@RequestMapping("/menus")
public class MenuController {

    @Autowired
    private MenuRepository menuRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    @PostMapping("/create")
    public Map<String, Object> createMenu(@RequestBody Menu menu) {
        Map<String, Object> response = new LinkedHashMap<>();
        try {
            Long restaurantId = menu.getRestaurant().getId();
            Restaurant restaurant = restaurantRepository.findById(restaurantId).orElse(null);

            if (restaurant == null) {
                response.put("message", "Restaurant with ID " + restaurantId + " not found");
                response.put("data", null);
                return response;
            }

            menu.setRestaurant(restaurant);
            Menu saved = menuRepository.save(menu);
            response.put("message", "Menu successfully created");
            response.put("data", saved);
        } catch (Exception e) {
            response.put("message", "Failed to create menu: " + e.getMessage());
            response.put("data", null);
        }
        return response;
    }

    @GetMapping("/get")
    public Map<String, Object> getAllMenus() {
        Map<String, Object> response = new LinkedHashMap<>();
        List<Menu> menus = menuRepository.findAll();
        response.put("message", "Successfully retrieved all menus");
        response.put("data", menus);
        return response;
    }

    @GetMapping("/get/{id}")
    public Map<String, Object> getMenuById(@PathVariable Long id) {
        Map<String, Object> response = new LinkedHashMap<>();
        Menu menu = menuRepository.findById(id).orElse(null);
        if (menu == null) {
            response.put("message", "Menu with ID " + id + " not found");
            response.put("data", null);
        } else {
            response.put("message", "Successfully retrieved menu with ID " + id);
            response.put("data", menu);
        }
        return response;
    }

@PutMapping("/update/{id}")
public Map<String, Object> updateMenu(@PathVariable Long id, @RequestBody Menu menuDetails) {
    Map<String, Object> response = new LinkedHashMap<>();
    Menu existing = menuRepository.findById(id).orElse(null);

    if (existing == null) {
        response.put("message", "Menu with ID " + id + " not found");
        response.put("data", null);
    } else {
        existing.setName(menuDetails.getName());
        existing.setPrice(menuDetails.getPrice());
        existing.setDescription(menuDetails.getDescription());
        // existing.setImageUrl(menuDetails.getImageUrl());

        if (menuDetails.getRestaurant() != null && menuDetails.getRestaurant().getId() != null) {
            Long restaurantId = menuDetails.getRestaurant().getId();
            Restaurant restaurant = restaurantRepository.findById(restaurantId).orElse(null);
            if (restaurant != null) {
                existing.setRestaurant(restaurant);
            } else {
                response.put("message", "Restaurant with ID " + restaurantId + " not found");
                response.put("data", null);
                return response;
            }
        }

        Menu updated = menuRepository.save(existing);
        response.put("message", "Menu with ID " + id + " successfully updated");
        response.put("data", updated);
    }
    return response;
}

    @DeleteMapping("/delete/{id}")
    public Map<String, Object> deleteMenu(@PathVariable Long id) {
        Map<String, Object> response = new LinkedHashMap<>();
        Menu menu = menuRepository.findById(id).orElse(null);

        if (menu == null) {
            response.put("message", "Menu with ID " + id + " not found");
            response.put("data", null);
        } else {
            menuRepository.deleteById(id);
            response.put("message", "Menu with ID " + id + " successfully deleted");
            response.put("data", menu);
        }
        return response;
    }

    @GetMapping("/search")
    public Map<String, Object> searchMenus(@RequestParam String name) {
        Map<String, Object> response = new LinkedHashMap<>();
        List<Menu> results = menuRepository.findAll().stream()
                .filter(menu -> menu.getName().toLowerCase().contains(name.toLowerCase()))
                .collect(Collectors.toList());

        response.put("message", results.isEmpty() ? "No menus found with name containing '" + name + "'"
                : "Successfully found menus with name containing '" + name + "'");
        response.put("data", results);
        return response;
    }

    @GetMapping("/sort")
    public Map<String, Object> sortMenus(@RequestParam String by, @RequestParam(defaultValue = "asc") String order) {
        Map<String, Object> response = new LinkedHashMap<>();
        Comparator<Menu> comparator;

        switch (by.toLowerCase()) {
            case "name":
                comparator = Comparator.comparing(Menu::getName, String.CASE_INSENSITIVE_ORDER);
                break;
            case "price":
                comparator = Comparator.comparing(Menu::getPrice);
                break;
            default:
                response.put("message", "Invalid sort field: " + by);
                response.put("data", null);
                return response;
        }

        if (order.equalsIgnoreCase("desc")) {
            comparator = comparator.reversed();
        }

        List<Menu> sorted = menuRepository.findAll().stream()
                .sorted(comparator)
                .collect(Collectors.toList());

        response.put("message", "Menus successfully sorted by " + by + " in " + order.toUpperCase() + " order");
        response.put("data", sorted);
        return response;
    }
}
