package com.online.shop.e_commerce.Repository;

import com.online.shop.e_commerce.Entity.Order;
import com.online.shop.e_commerce.Entity.User;
import com.online.shop.e_commerce.Enum.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUser(User user);
    
    List<Order> findByStatus(OrderStatus status);
    
    List<Order> findByUserAndStatus(User user, OrderStatus status);
    
    List<Order> findByOrderDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    List<Order> findByTotalPriceGreaterThan(Double minPrice);
    
    List<Order> findByUserOrderByOrderDateDesc(User user);
}

