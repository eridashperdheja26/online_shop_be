package com.online.shop.e_commerce.Dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

public class CreateOrderDto {
    @NotNull(message = "User ID is required")
    private Long userId;
    
    @NotNull(message = "Order items are required")
    @Size(min = 1, message = "At least one order item is required")
    private List<CreateOrderItemDto> orderItems;
    
    @NotBlank(message = "Shipping address is required")
    private String shippingAddress;
    
    @NotBlank(message = "Billing address is required")
    private String billingAddress;

    public CreateOrderDto() {
    }

    public CreateOrderDto(Long userId, List<CreateOrderItemDto> orderItems, String shippingAddress, String billingAddress) {
        this.userId = userId;
        this.orderItems = orderItems;
        this.shippingAddress = shippingAddress;
        this.billingAddress = billingAddress;
    }

    // Getters and Setters
    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public List<CreateOrderItemDto> getOrderItems() {
        return orderItems;
    }

    public void setOrderItems(List<CreateOrderItemDto> orderItems) {
        this.orderItems = orderItems;
    }

    public String getShippingAddress() {
        return shippingAddress;
    }

    public void setShippingAddress(String shippingAddress) {
        this.shippingAddress = shippingAddress;
    }

    public String getBillingAddress() {
        return billingAddress;
    }

    public void setBillingAddress(String billingAddress) {
        this.billingAddress = billingAddress;
    }
}
