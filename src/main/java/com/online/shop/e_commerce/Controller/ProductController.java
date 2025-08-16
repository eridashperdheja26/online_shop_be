package com.online.shop.e_commerce.Controller;

import com.online.shop.e_commerce.Dto.ProductDto;
import com.online.shop.e_commerce.Entity.Product;
import com.online.shop.e_commerce.Service.ProductService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/apiProduct")
public class ProductController {
    @Autowired
    private ProductService productService;

private ModelMapper modelMapper = new ModelMapper;
    public ResponseEntity <ProductDto> create(@RequestBody ProductDto productDto){
           Product product = productService.createProduct(productDto);
           ProductDto response = modelMapper.map(product, ProductDto.class);
           return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

}
