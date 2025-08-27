package com.online.shop.e_commerce.Controller;

import com.online.shop.e_commerce.Dto.CartDto;
import com.online.shop.e_commerce.Dto.CartItemDto;
import com.online.shop.e_commerce.Service.CartService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @GetMapping("/{userId}")
    public ResponseEntity<CartDto> getUserCart(@PathVariable Long userId) {
        CartDto cart = cartService.getUserCart(userId);
        return ResponseEntity.ok(cart);
    }

    @PostMapping("/{userId}/add-item")
    public ResponseEntity<CartDto> addItemToCart(
            @PathVariable Long userId,
            @Valid @RequestBody CartItemDto cartItemDto) {
        CartDto cart = cartService.addItemToCart(userId, cartItemDto);
        return ResponseEntity.ok(cart);
    }

    @PutMapping("/{userId}/update-item/{cartItemId}")
    public ResponseEntity<CartDto> updateCartItemQuantity(
            @PathVariable Long userId,
            @PathVariable Long cartItemId,
            @RequestParam Integer quantity) {
        CartDto cart = cartService.updateCartItemQuantity(userId, cartItemId, quantity);
        return ResponseEntity.ok(cart);
    }

    @DeleteMapping("/{userId}/remove-item/{cartItemId}")
    public ResponseEntity<CartDto> removeItemFromCart(
            @PathVariable Long userId,
            @PathVariable Long cartItemId) {
        CartDto cart = cartService.removeItemFromCart(userId, cartItemId);
        return ResponseEntity.ok(cart);
    }

    @DeleteMapping("/{userId}/clear")
    public ResponseEntity<Void> clearCart(@PathVariable Long userId) {
        cartService.clearCart(userId);
        return ResponseEntity.noContent().build();
    }
}
