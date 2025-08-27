package com.online.shop.e_commerce.Enum;

public enum OrderStatus {
    PENDING,        // Order created but not yet processed
    PROCESSING,     // Order is being prepared or packaged
    SHIPPED,        // Order has been shipped
    DELIVERED,      // Order delivered to customer
    CANCELLED,      // Order cancelled by user or admin
    RETURNED        // Order returned by customer
}

