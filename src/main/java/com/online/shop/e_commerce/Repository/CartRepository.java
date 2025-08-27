package com.online.shop.e_commerce.Repository;

import com.online.shop.e_commerce.Entity.Cart;
import com.online.shop.e_commerce.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {
    Optional<Cart> findByUser(User user);
}
