package com.online.shop.e_commerce.Controller;

import com.online.shop.e_commerce.Dto.ProductDto;
import com.online.shop.e_commerce.Entity.Product;
import com.online.shop.e_commerce.Service.ProductService;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    @Autowired
    private ProductService productService;

    private ModelMapper modelMapper = new ModelMapper();

    @PostMapping
    public ResponseEntity<ProductDto> create(@Valid @RequestBody ProductDto productDto) {
        Product product = productService.createProduct(productDto);
        ProductDto response = modelMapper.map(product, ProductDto.class);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDto> findById(@PathVariable Long id) {
        Product product = productService.getById(id);
        ProductDto response = modelMapper.map(product, ProductDto.class);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<Page<ProductDto>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<Product> products;
        
        if (category != null && !category.isEmpty()) {
            products = productService.getProductsByCategory(category, pageable);
        } else if (search != null && !search.isEmpty()) {
            products = productService.searchProducts(search, pageable);
        } else {
            products = productService.getAllProducts(pageable);
        }
        
        Page<ProductDto> productDtos = products.map(product -> modelMapper.map(product, ProductDto.class));
        return ResponseEntity.ok(productDtos);
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<ProductDto>> getProductsByCategory(@PathVariable String category) {
        List<Product> products = productService.getProductsByCategory(category);
        List<ProductDto> response = products.stream()
                .map(product -> modelMapper.map(product, ProductDto.class))
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/search")
    public ResponseEntity<List<ProductDto>> searchProducts(@RequestParam String query) {
        List<Product> products = productService.searchProducts(query);
        List<ProductDto> response = products.stream()
                .map(product -> modelMapper.map(product, ProductDto.class))
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/in-stock")
    public ResponseEntity<List<ProductDto>> getInStockProducts() {
        List<Product> products = productService.getInStockProducts();
        List<ProductDto> response = products.stream()
                .map(product -> modelMapper.map(product, ProductDto.class))
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductDto> update(@Valid @RequestBody ProductDto productDto, @PathVariable Long id) {
        Product product = productService.update(productDto, id);
        ProductDto response = modelMapper.map(product, ProductDto.class);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ProductDto> partialUpdate(@RequestBody ProductDto productDto, @PathVariable Long id) {
        Product product = productService.partialUpdate(productDto, id);
        ProductDto response = modelMapper.map(product, ProductDto.class);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable Long id) {
        productService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/stock")
    public ResponseEntity<ProductDto> updateStock(
            @PathVariable Long id,
            @RequestParam Integer quantity) {
        Product product = productService.updateStock(id, quantity);
        ProductDto response = modelMapper.map(product, ProductDto.class);
        return ResponseEntity.ok(response);
    }
}
