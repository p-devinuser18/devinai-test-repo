package com.healthapi.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.healthapi.model.Product;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private List<Product> products;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @PostConstruct
    public void init() throws IOException {
        InputStream is = new ClassPathResource("products.json").getInputStream();
        products = objectMapper.readValue(is, new TypeReference<List<Product>>() {});
    }

    public List<Product> getAllProducts() {
        return products;
    }

    public List<Product> getProductsByCategory(String category) {
        return products.stream()
                .filter(p -> p.getCategory().equalsIgnoreCase(category))
                .collect(Collectors.toList());
    }
}
