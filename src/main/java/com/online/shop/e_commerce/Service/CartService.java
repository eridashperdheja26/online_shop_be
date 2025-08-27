package com.online.shop.e_commerce.Service;

import com.online.shop.e_commerce.Dto.CartDto;
import com.online.shop.e_commerce.Dto.CartItemDto;
import com.online.shop.e_commerce.Entity.Cart;
import com.online.shop.e_commerce.Entity.CartItem;
import com.online.shop.e_commerce.Entity.Product;
import com.online.shop.e_commerce.Entity.User;
import com.online.shop.e_commerce.Repository.CartRepository;
import com.online.shop.e_commerce.Repository.CartItemRepository;
import com.online.shop.e_commerce.Repository.ProductRepository;
import com.online.shop.e_commerce.Repository.UserRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ModelMapper modelMapper;

    public CartDto getUserCart(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = cartRepository.findByUser(user)
                .orElseGet(() -> {
                    Cart newCart = new Cart(user);
                    return cartRepository.save(newCart);
                });

        return convertToDto(cart);
    }

    public CartDto addItemToCart(Long userId, CartItemDto cartItemDto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Product product = productRepository.findById(cartItemDto.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (!product.isInStock()) {
            throw new RuntimeException("Product is out of stock");
        }

        if (product.getQuantity() < cartItemDto.getQuantity()) {
            throw new RuntimeException("Insufficient stock available");
        }

        Cart cart = cartRepository.findByUser(user)
                .orElseGet(() -> {
                    Cart newCart = new Cart(user);
                    return cartRepository.save(newCart);
                });

        // Check if item already exists in cart
        CartItem existingItem = cart.getCartItems().stream()
                .filter(item -> item.getProduct().getId().equals(cartItemDto.getProductId()))
                .findFirst()
                .orElse(null);

        if (existingItem != null) {
            // Update quantity
            existingItem.setQuantity(existingItem.getQuantity() + cartItemDto.getQuantity());
            cartItemRepository.save(existingItem);
        } else {
            // Add new item
            CartItem newItem = new CartItem(cart, product, cartItemDto.getQuantity());
            cart.addCartItem(newItem);
            cartItemRepository.save(newItem);
        }

        cartRepository.save(cart);
        return convertToDto(cart);
    }

    public CartDto updateCartItemQuantity(Long userId, Long cartItemId, Integer quantity) {
        if (quantity <= 0) {
            throw new RuntimeException("Quantity must be greater than 0");
        }

        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        // Verify the cart item belongs to the user
        if (!cartItem.getCart().getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to cart item");
        }

        // Check stock availability
        if (cartItem.getProduct().getQuantity() < quantity) {
            throw new RuntimeException("Insufficient stock available");
        }

        cartItem.setQuantity(quantity);
        cartItemRepository.save(cartItem);

        Cart cart = cartItem.getCart();
        return convertToDto(cart);
    }

    public CartDto removeItemFromCart(Long userId, Long cartItemId) {
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        // Verify the cart item belongs to the user
        if (!cartItem.getCart().getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to cart item");
        }

        Cart cart = cartItem.getCart();
        cart.removeCartItem(cartItem);
        cartItemRepository.delete(cartItem);
        cartRepository.save(cart);

        return convertToDto(cart);
    }

    public void clearCart(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = cartRepository.findByUser(user)
                .orElse(null);

        if (cart != null) {
            cart.clearCart();
            cartRepository.save(cart);
        }
    }

    private CartDto convertToDto(Cart cart) {
        CartDto cartDto = new CartDto();
        cartDto.setId(cart.getId());
        cartDto.setUserId(cart.getUser().getId());
        cartDto.setTotalPrice(cart.getTotalPrice());
        cartDto.setTotalItems(cart.getTotalItems());

        List<CartItemDto> cartItemDtos = cart.getCartItems().stream()
                .map(this::convertToItemDto)
                .collect(Collectors.toList());

        cartDto.setCartItems(cartItemDtos);
        return cartDto;
    }

    private CartItemDto convertToItemDto(CartItem cartItem) {
        CartItemDto dto = new CartItemDto();
        dto.setId(cartItem.getId());
        dto.setProductId(cartItem.getProduct().getId());
        dto.setQuantity(cartItem.getQuantity());
        dto.setProductName(cartItem.getProduct().getName());
        dto.setProductPrice(cartItem.getProduct().getPrice());
        dto.setProductImageUrl(cartItem.getProduct().getImageUrl());
        dto.setSubtotal(cartItem.getSubtotal());
        return dto;
    }
}
