package com.deliveryfood.backend.controller;

import com.deliveryfood.backend.model.Address;
import com.deliveryfood.backend.model.User;
import com.deliveryfood.backend.repository.AddressRepository;
import com.deliveryfood.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/addresses")
public class AddressController {

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private UserRepository userRepository;

    // Tambah alamat baru
    @PostMapping("/add")
    public Map<String, Object> addAddress(@RequestBody Address address) {
        Map<String, Object> response = new HashMap<>();
        try {
            if (address.getUser() == null || address.getUser().getId() == null) {
                throw new RuntimeException("User ID is required");
            }
            if (address.getStreet() == null || address.getStreet().isEmpty() ||
                address.getCity() == null || address.getCity().isEmpty() ||
                address.getPostalCode() == null || address.getPostalCode().isEmpty() ||
                address.getPhone() == null || address.getPhone().isEmpty()) {
                throw new RuntimeException("All address fields are required");
            }

            User user = userRepository.findById(address.getUser().getId())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            address.setUser(user);
            Address saved = addressRepository.save(address);

            response.put("message", "Address added successfully");
            response.put("data", saved);
        } catch (Exception e) {
            response.put("message", "Failed to add address: " + e.getMessage());
            response.put("data", null);
        }
        return response;
    }

    // GET semua alamat user
    @GetMapping("/user/{userId}")
    public Map<String, Object> getUserAddresses(@PathVariable Long userId) {
        Map<String, Object> response = new HashMap<>();
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            List<Address> addresses = addressRepository.findByUserId(userId);

            response.put("message", "User addresses retrieved successfully");
            response.put("data", addresses);
        } catch (Exception e) {
            response.put("message", "Failed to retrieve addresses: " + e.getMessage());
            response.put("data", null);
        }
        return response;
    }

    // Update alamat
    @PutMapping("/update/{id}")
    public Map<String, Object> updateAddress(@PathVariable Long id,
                                             @RequestBody Address updatedAddress) {
        Map<String, Object> response = new HashMap<>();
        try {
            Address address = addressRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Address not found"));

            if (updatedAddress.getStreet() != null) address.setStreet(updatedAddress.getStreet());
            if (updatedAddress.getCity() != null) address.setCity(updatedAddress.getCity());
            if (updatedAddress.getPostalCode() != null) address.setPostalCode(updatedAddress.getPostalCode());
            if (updatedAddress.getPhone() != null) address.setPhone(updatedAddress.getPhone());

            Address saved = addressRepository.save(address);

            response.put("message", "Address updated successfully");
            response.put("data", saved);
        } catch (Exception e) {
            response.put("message", "Failed to update address: " + e.getMessage());
            response.put("data", null);
        }
        return response;
    }

    // Hapus alamat
    @DeleteMapping("/delete/{id}")
    public Map<String, Object> deleteAddress(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        try {
            Address address = addressRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Address not found"));

            addressRepository.delete(address);

            response.put("message", "Address deleted successfully");
            response.put("data", address);
        } catch (Exception e) {
            response.put("message", "Failed to delete address: " + e.getMessage());
            response.put("data", null);
        }
        return response;
    }
}
