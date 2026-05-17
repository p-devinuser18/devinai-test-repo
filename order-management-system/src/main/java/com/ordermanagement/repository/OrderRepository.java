package com.ordermanagement.repository;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ordermanagement.model.Order;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Repository;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Repository
public class OrderRepository {

    private final ConcurrentHashMap<Long, Order> orders = new ConcurrentHashMap<>();
    private final AtomicLong idCounter = new AtomicLong(0);
    private final ObjectMapper objectMapper;

    @Value("${orders.data.file}")
    private Resource dataFile;

    public OrderRepository(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @PostConstruct
    public void init() throws IOException {
        try (InputStream is = dataFile.getInputStream()) {
            List<Order> orderList = objectMapper.readValue(is, new TypeReference<List<Order>>() {});
            long maxId = 0;
            for (Order order : orderList) {
                orders.put(order.getId(), order);
                if (order.getId() > maxId) {
                    maxId = order.getId();
                }
            }
            idCounter.set(maxId);
        }
    }

    public List<Order> findAll() {
        return new ArrayList<>(orders.values());
    }

    public Optional<Order> findById(Long id) {
        return Optional.ofNullable(orders.get(id));
    }

    public Order save(Order order) {
        if (order.getId() == null) {
            order.setId(idCounter.incrementAndGet());
        }
        orders.put(order.getId(), order);
        return order;
    }

    public boolean deleteById(Long id) {
        return orders.remove(id) != null;
    }

    public boolean existsById(Long id) {
        return orders.containsKey(id);
    }
}
