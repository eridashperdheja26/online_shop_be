package com.online.shop.e_commerce.Service;

import com.online.shop.e_commerce.Dto.ProductDto;
import com.online.shop.e_commerce.Entity.Product;
import com.online.shop.e_commerce.Repository.ProductRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.ui.ModelMap;

@Service
public class ProductService {
    @Autowired
    private ProductRepository productRepository;
    private ModelMapper modelMapper = new ModelMapper();

    public Product createProduct (ProductDto productDto) {
        Product product = modelMapper.map(productDto,Product.class);
        return productRepository.save(product);

    }
}
