package com.online.shop.e_commerce.Service;

import com.online.shop.e_commerce.Dto.CreateOrderDto;
import com.online.shop.e_commerce.Dto.CreateOrderItemDto;
import com.online.shop.e_commerce.Entity.Order;
import com.online.shop.e_commerce.Entity.OrderItem;
import com.online.shop.e_commerce.Entity.Product;
import com.online.shop.e_commerce.Entity.User;
import com.online.shop.e_commerce.Enum.OrderStatus;
import com.online.shop.e_commerce.Repository.OrderRepository;
import com.online.shop.e_commerce.Repository.ProductRepository;
import com.online.shop.e_commerce.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    public Order createOrder(CreateOrderDto createOrderDto) {
        // Validate user exists
        User user = userRepository.findById(createOrderDto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Create order
        Order order = new Order();
        order.setUser(user);
        order.setStatus(OrderStatus.PROCESSING);
        order.setShippingAddress(createOrderDto.getShippingAddress());
        order.setBillingAddress(createOrderDto.getBillingAddress());

        // Process order items
        for (CreateOrderItemDto itemDto : createOrderDto.getOrderItems()) {
            Product product = productRepository.findById(itemDto.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found with ID: " + itemDto.getProductId()));

            // Check stock availability
            if (!product.hasStock(itemDto.getQuantity())) {
                throw new RuntimeException("Insufficient stock for product: " + product.getName());
            }

            // Create order item
            OrderItem orderItem = new OrderItem(product, itemDto.getQuantity(), product.getPrice());
            order.addOrderItem(orderItem);

            // Update product stock
            product.setQuantity(product.getQuantity() - itemDto.getQuantity());
            productRepository.save(product);
        }

        // Calculate total price
        order.calculateTotalPrice();

        // Save order
        return orderRepository.save(order);
    }

    public Order getOrderById(Long orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }

    public List<Order> getUserOrders(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return orderRepository.findByUser(user);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Order updateOrderStatus(Long orderId, OrderStatus status) {
        Order order = getOrderById(orderId);
        order.setStatus(status);
        return orderRepository.save(order);
    }

    public void cancelOrder(Long orderId) {
        Order order = getOrderById(orderId);
        
        if (order.getStatus() == OrderStatus.CANCELLED) {
            throw new RuntimeException("Order is already cancelled");
        }

        if (order.getStatus() == OrderStatus.DELIVERED) {
            throw new RuntimeException("Cannot cancel delivered order");
        }

        // Restore product stock
        for (OrderItem item : order.getOrderItems()) {
            Product product = item.getProduct();
            product.setQuantity(product.getQuantity() + item.getQuantity());
            productRepository.save(product);
        }

        order.setStatus(OrderStatus.CANCELLED);
        orderRepository.save(order);
    }

    public List<Order> getOrdersByStatus(OrderStatus status) {
        return orderRepository.findByStatus(status);
    }

    public Order createOrderFromCart(Long userId, String shippingAddress, String billingAddress) {
        // This method would integrate with CartService to convert cart to order
        // For now, we'll create a basic order - you can enhance this later
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Order order = new Order();
        order.setUser(user);
        order.setStatus(OrderStatus.PROCESSING);
        order.setShippingAddress(shippingAddress);
        order.setBillingAddress(billingAddress);
        order.setTotalPrice(0.0); // Will be calculated when items are added

        return orderRepository.save(order);
    }
}
