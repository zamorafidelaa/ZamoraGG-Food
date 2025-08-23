package com.deliveryfood.backend.controller;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.deliveryfood.backend.model.Restaurant;
import com.deliveryfood.backend.repository.RestaurantRepository;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/restaurants")
public class RestaurantController {

    @Autowired
    private RestaurantRepository restaurantRepository;

    @PostMapping("/create")
    public ResponseEntity<String> createRestaurant(@RequestBody Restaurant restaurant) {
        Restaurant savedRestaurant = restaurantRepository.save(restaurant);
        return ResponseEntity.ok("Restaurant with ID " + savedRestaurant.getId() + " successfully added!");
    }

    @GetMapping
    public List<Restaurant> getAllRestaurants() {
        return restaurantRepository.findAll();
    }

    @GetMapping("/get/{id}")
    public Map<String, Object> getRestaurantById(@PathVariable Long id) {
        Map<String, Object> response = new LinkedHashMap<>();
        Restaurant restaurant = restaurantRepository.findById(id).orElse(null);

        if (restaurant == null) {
            response.put("message", "Restaurant dengan ID " + id + " tidak ditemukan");
            response.put("data", null);
        } else {
            response.put("message", "Berhasil mengambil restaurant dengan ID " + id);
            response.put("data", restaurant);
        }

        return response;
    }

    @PutMapping("/update/{id}")
    public Map<String, Object> updateRestaurant(@PathVariable Long id, @RequestBody Restaurant updated) {
        Map<String, Object> response = new LinkedHashMap<>();

        return restaurantRepository.findById(id).map(restaurant -> {
            restaurant.setName(updated.getName());
            restaurant.setAddress(updated.getAddress());
            restaurant.setPhone(updated.getPhone());

            Restaurant saved = restaurantRepository.save(restaurant);

            response.put("message", "Restaurant dengan ID " + id + " berhasil diperbarui");
            response.put("data", saved);
            return response;
        }).orElseGet(() -> {
            response.put("message", "Restaurant dengan ID " + id + " tidak ditemukan");
            response.put("data", null);
            return response;
        });
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteRestaurant(@PathVariable Long id) {
        if (!restaurantRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Restaurant with ID " + id + " not found");
        }
        restaurantRepository.deleteById(id);
        return ResponseEntity.ok("Restaurant deleted successfully!");
    }

    @GetMapping("/sort/name")
    public List<Restaurant> sortByName(@RequestParam(defaultValue = "asc") String order) {
        return order.equalsIgnoreCase("desc")
                ? restaurantRepository.findAllByOrderByNameDesc()
                : restaurantRepository.findAllByOrderByNameAsc();
    }

    @GetMapping("/sort/address")
    public List<Restaurant> sortByAddress(@RequestParam(defaultValue = "asc") String order) {
        return order.equalsIgnoreCase("desc")
                ? restaurantRepository.findAllByOrderByAddressDesc()
                : restaurantRepository.findAllByOrderByAddressAsc();
    }

    @GetMapping("/search-name-address")
    public List<Restaurant> searchRestaurant(@RequestParam String keyword) {
        return restaurantRepository.findByNameContainingIgnoreCaseOrAddressContainingIgnoreCase(keyword, keyword);
    }

}