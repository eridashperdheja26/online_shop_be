package com.online.shop.e_commerce.Repository;

import com.online.shop.e_commerce.Entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByName(String name);

    List<Product> findByPriceLessThan(Double price);

    List<Product> findByDescriptionContaining(String keyword);

    List<Product> findByCategoryIgnoreCase(String category);

    Page<Product> findByCategoryIgnoreCase(String category, Pageable pageable);

    List<Product> findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String name, String description);

    Page<Product> findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String name, String description, Pageable pageable);

    List<Product> findByQuantityGreaterThan(Integer quantity);

    List<Product> findByIsActiveTrue();

    List<Product> findByCategoryIgnoreCaseAndIsActiveTrue(String category);
}
