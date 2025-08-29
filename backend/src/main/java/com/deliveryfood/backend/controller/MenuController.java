package com.deliveryfood.backend.controller;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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

    private final Path uploadDir = Paths.get("uploads"); 

    // ------------------- CREATE -------------------
    @PostMapping("/create")
    public Map<String, Object> createMenu(@RequestPart("menu") Menu menu,
                                          @RequestPart(value = "image", required = false) MultipartFile imageFile) {
        Map<String, Object> response = new LinkedHashMap<>();
        try {
            Long restaurantId = menu.getRestaurant().getId();
            Restaurant restaurant = restaurantRepository.findById(restaurantId).orElse(null);
            if (restaurant == null) {
                response.put("message", "Restaurant not found");
                response.put("data", null);
                return response;
            }
            menu.setRestaurant(restaurant);

            if (imageFile != null && !imageFile.isEmpty()) {
                Files.createDirectories(uploadDir); 
                String filename = System.currentTimeMillis() + "_" + imageFile.getOriginalFilename();
                Path filepath = uploadDir.resolve(filename);
                Files.write(filepath, imageFile.getBytes());
                menu.setImageUrl("/menus/uploads/" + filename);
            }

            Menu saved = menuRepository.save(menu);
            response.put("message", "Menu successfully created");
            response.put("data", saved);
        } catch (Exception e) {
            response.put("message", "Failed to create menu: " + e.getMessage());
            response.put("data", null);
        }
        return response;
    }

    // ------------------- UPDATE -------------------
    @PutMapping("/update/{id}")
    public Map<String, Object> updateMenu(@PathVariable Long id,
                                          @RequestPart("menu") Menu menuDetails,
                                          @RequestPart(value = "image", required = false) MultipartFile imageFile) {
        Map<String, Object> response = new LinkedHashMap<>();
        try {
            Menu existing = menuRepository.findById(id).orElse(null);
            if (existing == null) {
                response.put("message", "Menu with ID " + id + " not found");
                response.put("data", null);
                return response;
            }

            existing.setName(menuDetails.getName());
            existing.setPrice(menuDetails.getPrice());
            existing.setDescription(menuDetails.getDescription());

            if (menuDetails.getRestaurant() != null && menuDetails.getRestaurant().getId() != null) {
                Restaurant restaurant = restaurantRepository.findById(menuDetails.getRestaurant().getId()).orElse(null);
                if (restaurant != null) existing.setRestaurant(restaurant);
            }

            if (imageFile != null && !imageFile.isEmpty()) {
                Files.createDirectories(uploadDir);
                String filename = System.currentTimeMillis() + "_" + imageFile.getOriginalFilename();
                Path filepath = uploadDir.resolve(filename);
                Files.write(filepath, imageFile.getBytes());
                existing.setImageUrl("/menus/uploads/" + filename);
            }

            Menu updated = menuRepository.save(existing);
            response.put("message", "Menu updated successfully");
            response.put("data", updated);
        } catch (Exception e) {
            response.put("message", "Failed to update menu: " + e.getMessage());
            response.put("data", null);
        }
        return response;
    }

    // ------------------- GET ALL -------------------
    @GetMapping("/get")
    public Map<String, Object> getAllMenus() {
        Map<String, Object> response = new LinkedHashMap<>();
        List<Menu> menus = menuRepository.findAll();
        response.put("message", "Successfully retrieved all menus");
        response.put("data", menus);
        return response;
    }

    // ------------------- GET BY ID -------------------
    @GetMapping("/get/{id}")
    public Map<String, Object> getMenuById(@PathVariable Long id) {
        Map<String, Object> response = new LinkedHashMap<>();
        Menu menu = menuRepository.findById(id).orElse(null);
        response.put("message", menu != null ? "Menu found" : "Menu not found");
        response.put("data", menu);
        return response;
    }

    // ------------------- DELETE -------------------
    @DeleteMapping("/delete/{id}")
    public Map<String, Object> deleteMenu(@PathVariable Long id) {
        Map<String, Object> response = new LinkedHashMap<>();
        Menu menu = menuRepository.findById(id).orElse(null);
        if (menu == null) {
            response.put("message", "Menu not found");
            response.put("data", null);
        } else {
            menuRepository.delete(menu);
            response.put("message", "Menu deleted successfully");
            response.put("data", menu);
        }
        return response;
    }

    // ------------------- SERVE IMAGE -------------------
    @GetMapping("/uploads/{filename:.+}")
    public ResponseEntity<Resource> serveFile(@PathVariable String filename) throws Exception {
        Path file = uploadDir.resolve(filename);
        Resource resource = new UrlResource(file.toUri());
        if (resource.exists() || resource.isReadable()) {
            return ResponseEntity.ok().body(resource);
        } else {
            throw new RuntimeException("Could not read file: " + filename);
        }
    }

}
