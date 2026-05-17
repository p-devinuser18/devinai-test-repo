package com.healthapi;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class ProductsIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void shouldReturn200WithAllProducts() throws Exception {
        mockMvc.perform(get("/api/products")
                        .header("Authorization", "Bearer test-token"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(6)));
    }

    @Test
    void shouldReturnOnlyElectronicsWhenFilteredByCategory() throws Exception {
        mockMvc.perform(get("/api/products")
                        .param("category", "electronics")
                        .header("Authorization", "Bearer test-token"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].category", is("electronics")))
                .andExpect(jsonPath("$[1].category", is("electronics")));
    }

    @Test
    void shouldFilterCaseInsensitively() throws Exception {
        MvcResult lower = mockMvc.perform(get("/api/products")
                        .param("category", "electronics")
                        .header("Authorization", "Bearer test-token"))
                .andExpect(status().isOk())
                .andReturn();

        MvcResult upper = mockMvc.perform(get("/api/products")
                        .param("category", "ELECTRONICS")
                        .header("Authorization", "Bearer test-token"))
                .andExpect(status().isOk())
                .andReturn();

        String lowerBody = lower.getResponse().getContentAsString();
        String upperBody = upper.getResponse().getContentAsString();
        assert lowerBody.equals(upperBody) : "Case-insensitive filtering failed";
    }

    @Test
    void shouldReturnEmptyArrayForNonexistentCategory() throws Exception {
        mockMvc.perform(get("/api/products")
                        .param("category", "nonexistent")
                        .header("Authorization", "Bearer test-token"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
    }

    @Test
    void shouldReturnProductsWithCorrectShape() throws Exception {
        mockMvc.perform(get("/api/products")
                        .header("Authorization", "Bearer test-token"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").exists())
                .andExpect(jsonPath("$[0].name").exists())
                .andExpect(jsonPath("$[0].price").exists())
                .andExpect(jsonPath("$[0].category").exists())
                .andExpect(jsonPath("$[0].inStock").exists());
    }

    @Test
    void shouldHavePositivePriceForAllProducts() throws Exception {
        mockMvc.perform(get("/api/products")
                        .header("Authorization", "Bearer test-token"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[*].price", everyItem(greaterThan(0.0))));
    }

    @Test
    void shouldReturnApplicationJsonContentType() throws Exception {
        mockMvc.perform(get("/api/products")
                        .header("Authorization", "Bearer test-token"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON));
    }

    @Test
    void shouldReturn401WithoutAuthorization() throws Exception {
        mockMvc.perform(get("/api/products"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error", is("Authorization token required")));
    }
}
