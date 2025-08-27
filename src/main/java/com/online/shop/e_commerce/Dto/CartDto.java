package com.online.shop.e_commerce.Dto;

import java.util.List;

public class CartDto {
    private Long id;
    private Long userId;
    private List<CartItemDto> cartItems;
    private Double totalPrice;
    private Integer totalItems;

    public CartDto() {
    }

    public CartDto(Long id, Long userId, List<CartItemDto> cartItems, Double totalPrice, Integer totalItems) {
        this.id = id;
        this.userId = userId;
        this.cartItems = cartItems;
        this.totalPrice = totalPrice;
        this.totalItems = totalItems;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public List<CartItemDto> getCartItems() {
        return cartItems;
    }

    public void setCartItems(List<CartItemDto> cartItems) {
        this.cartItems = cartItems;
    }

    public Double getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(Double totalPrice) {
        this.totalPrice = totalPrice;
    }

    public Integer getTotalItems() {
        return totalItems;
    }

    public void setTotalItems(Integer totalItems) {
        this.totalItems = totalItems;
    }
}
