package com.ordermanagement.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ordermanagement.model.Order;
import com.ordermanagement.model.OrderStatus;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class OrderControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void getAllOrders_shouldReturnListOfOrders() throws Exception {
        mockMvc.perform(get("/api/orders"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(10))))
                .andExpect(jsonPath("$[0].id").exists())
                .andExpect(jsonPath("$[0].customerName").exists());
    }

    @Test
    void getOrderById_shouldReturnOrder_whenExists() throws Exception {
        mockMvc.perform(get("/api/orders/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.customerName").value("Alice Johnson"))
                .andExpect(jsonPath("$.product").value("Wireless Bluetooth Headphones"));
    }

    @Test
    void getOrderById_shouldReturn404_whenNotExists() throws Exception {
        mockMvc.perform(get("/api/orders/999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Order not found with id: 999"));
    }

    @Test
    void createOrder_shouldReturn201AndCreatedOrder() throws Exception {
        Order newOrder = new Order();
        newOrder.setCustomerName("Test Customer");
        newOrder.setCustomerEmail("test@example.com");
        newOrder.setProduct("Test Product");
        newOrder.setQuantity(2);
        newOrder.setPrice(50.00);
        newOrder.setOrderDate("2026-05-15");
        newOrder.setShippingAddress("Test Address");

        mockMvc.perform(post("/api/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newOrder)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.customerName").value("Test Customer"))
                .andExpect(jsonPath("$.status").value("PENDING"))
                .andExpect(jsonPath("$.totalAmount").value(100.00));
    }

    @Test
    void updateOrder_shouldReturn200_whenExists() throws Exception {
        Order updatedOrder = new Order();
        updatedOrder.setCustomerName("Alice Updated");
        updatedOrder.setCustomerEmail("alice.updated@example.com");
        updatedOrder.setProduct("Updated Product");
        updatedOrder.setQuantity(3);
        updatedOrder.setPrice(45.00);
        updatedOrder.setOrderDate("2026-05-16");
        updatedOrder.setShippingAddress("Updated Address");

        mockMvc.perform(put("/api/orders/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updatedOrder)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.customerName").value("Alice Updated"))
                .andExpect(jsonPath("$.totalAmount").value(135.00));
    }

    @Test
    void updateOrder_shouldReturn404_whenNotExists() throws Exception {
        Order updatedOrder = new Order();
        updatedOrder.setCustomerName("Nobody");
        updatedOrder.setCustomerEmail("nobody@example.com");
        updatedOrder.setProduct("Nothing");
        updatedOrder.setQuantity(1);
        updatedOrder.setPrice(10.00);
        updatedOrder.setOrderDate("2026-05-16");
        updatedOrder.setShippingAddress("Nowhere");

        mockMvc.perform(put("/api/orders/999")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updatedOrder)))
                .andExpect(status().isNotFound());
    }

    @Test
    void deleteOrder_shouldReturn204_whenExists() throws Exception {
        // First create an order to delete
        Order newOrder = new Order();
        newOrder.setCustomerName("To Delete");
        newOrder.setCustomerEmail("delete@example.com");
        newOrder.setProduct("Temp Product");
        newOrder.setQuantity(1);
        newOrder.setPrice(10.00);
        newOrder.setOrderDate("2026-05-15");
        newOrder.setShippingAddress("Temp Address");

        String response = mockMvc.perform(post("/api/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newOrder)))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();

        Long createdId = objectMapper.readValue(response, Order.class).getId();

        mockMvc.perform(delete("/api/orders/" + createdId))
                .andExpect(status().isNoContent());
    }

    @Test
    void deleteOrder_shouldReturn404_whenNotExists() throws Exception {
        mockMvc.perform(delete("/api/orders/999"))
                .andExpect(status().isNotFound());
    }

    @Test
    void updateOrderStatus_validTransition_shouldReturn200() throws Exception {
        // Create a fresh PENDING order for status transition test
        Order newOrder = new Order();
        newOrder.setCustomerName("Status Test");
        newOrder.setCustomerEmail("status@example.com");
        newOrder.setProduct("Status Product");
        newOrder.setQuantity(1);
        newOrder.setPrice(20.00);
        newOrder.setOrderDate("2026-05-15");
        newOrder.setShippingAddress("Status Address");

        String response = mockMvc.perform(post("/api/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newOrder)))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();

        Long createdId = objectMapper.readValue(response, Order.class).getId();

        // PENDING -> CONFIRMED
        mockMvc.perform(patch("/api/orders/" + createdId + "/status")
                        .param("status", "CONFIRMED"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("CONFIRMED"));
    }

    @Test
    void updateOrderStatus_invalidTransition_shouldReturn400() throws Exception {
        // Create a PENDING order
        Order newOrder = new Order();
        newOrder.setCustomerName("Invalid Status Test");
        newOrder.setCustomerEmail("invalid@example.com");
        newOrder.setProduct("Invalid Product");
        newOrder.setQuantity(1);
        newOrder.setPrice(15.00);
        newOrder.setOrderDate("2026-05-15");
        newOrder.setShippingAddress("Invalid Address");

        String response = mockMvc.perform(post("/api/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newOrder)))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();

        Long createdId = objectMapper.readValue(response, Order.class).getId();

        // PENDING -> DELIVERED (invalid)
        mockMvc.perform(patch("/api/orders/" + createdId + "/status")
                        .param("status", "DELIVERED"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value(
                        containsString("Invalid status transition")));
    }

    @Test
    void updateOrderStatus_shouldReturn404_whenOrderNotExists() throws Exception {
        mockMvc.perform(patch("/api/orders/999/status")
                        .param("status", "CONFIRMED"))
                .andExpect(status().isNotFound());
    }

    @Test
    void updateOrderStatus_fullTransitionChain_shouldSucceed() throws Exception {
        // Create a new order
        Order newOrder = new Order();
        newOrder.setCustomerName("Full Chain Test");
        newOrder.setCustomerEmail("chain@example.com");
        newOrder.setProduct("Chain Product");
        newOrder.setQuantity(1);
        newOrder.setPrice(30.00);
        newOrder.setOrderDate("2026-05-15");
        newOrder.setShippingAddress("Chain Address");

        String response = mockMvc.perform(post("/api/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newOrder)))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();

        Long createdId = objectMapper.readValue(response, Order.class).getId();

        // PENDING -> CONFIRMED
        mockMvc.perform(patch("/api/orders/" + createdId + "/status")
                        .param("status", "CONFIRMED"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("CONFIRMED"));

        // CONFIRMED -> SHIPPED
        mockMvc.perform(patch("/api/orders/" + createdId + "/status")
                        .param("status", "SHIPPED"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("SHIPPED"));

        // SHIPPED -> DELIVERED
        mockMvc.perform(patch("/api/orders/" + createdId + "/status")
                        .param("status", "DELIVERED"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("DELIVERED"));
    }
}
