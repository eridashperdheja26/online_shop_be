package com.online.shop.e_commerce.Service;

import com.online.shop.e_commerce.Dto.ProductDto;
import com.online.shop.e_commerce.Entity.Product;
import com.online.shop.e_commerce.Repository.ProductRepository;
import org.modelmapper.Conditions;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    private ModelMapper modelMapper = new ModelMapper();

    public Product getById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }

    public List<Product> getAll() {
        return productRepository.findAll();
    }

    public Page<Product> getAllProducts(Pageable pageable) {
        return productRepository.findAll(pageable);
    }

    public List<Product> getProductsByCategory(String category) {
        return productRepository.findByCategoryIgnoreCase(category);
    }

    public Page<Product> getProductsByCategory(String category, Pageable pageable) {
        return productRepository.findByCategoryIgnoreCase(category, pageable);
    }

    public List<Product> searchProducts(String query) {
        return productRepository.findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(query, query);
    }

    public Page<Product> searchProducts(String query, Pageable pageable) {
        return productRepository.findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(query, query, pageable);
    }

    public List<Product> getInStockProducts() {
        return productRepository.findByQuantityGreaterThan(0);
    }

    public Product createProduct(ProductDto productDto) {
        Product product = modelMapper.map(productDto, Product.class);
        product.setId(null);
        return productRepository.save(product);
    }

    public Product update(ProductDto productDto, Long id) {
        Product existing = getById(id);
        modelMapper.getConfiguration().setPropertyCondition(Conditions.isNotNull());
        modelMapper.map(productDto, existing);
        return productRepository.save(existing);
    }

    public Product partialUpdate(ProductDto productDto, Long id) {
        Product existing = getById(id);
        modelMapper.getConfiguration().setPropertyCondition(Conditions.isNotNull());
        modelMapper.map(productDto, existing);
        return productRepository.save(existing);
    }

    public Product updateStock(Long id, Integer quantity) {
        if (quantity < 0) {
            throw new RuntimeException("Quantity cannot be negative");
        }
        
        Product product = getById(id);
        product.setQuantity(quantity);
        return productRepository.save(product);
    }

    public void deleteById(Long id) {
        productRepository.deleteById(id);
    }
}