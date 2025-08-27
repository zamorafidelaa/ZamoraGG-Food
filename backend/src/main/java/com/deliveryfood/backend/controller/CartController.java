package com.deliveryfood.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.deliveryfood.backend.model.Cart;
import com.deliveryfood.backend.repository.CartRepository;

import java.util.List;

@RestController
@RequestMapping("/cart")
public class CartController {

    @Autowired
    private CartRepository cartRepository; // langsung inject tanpa constructor

    // Get semua cart
    @GetMapping
    public List<Cart> getAllCart() {
        return cartRepository.findAll();
    }

    // Get cart by userId
    @GetMapping("/{userId}")
    public List<Cart> getCartByUser(@PathVariable Long userId) {
        return cartRepository.findByUserId(userId);
    }

    // Tambah ke cart
    @PostMapping
    public Cart addToCart(@RequestBody Cart cart) {
        return cartRepository.save(cart);
    }

    // Hapus cart item berdasarkan id
    @DeleteMapping("/{id}")
    public void deleteCartItem(@PathVariable Long id) {
        cartRepository.deleteById(id);
    }
}
