package com.healthapi;

import com.healthapi.service.MetricsService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class MetricsIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private MetricsService metricsService;

    @BeforeEach
    void resetMetrics() {
        metricsService.reset();
    }

    @Test
    void shouldReturn200WithMetricsObject() throws Exception {
        mockMvc.perform(get("/metrics"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.totalRequests").exists())
                .andExpect(jsonPath("$.successCount").exists())
                .andExpect(jsonPath("$.failureCount").exists())
                .andExpect(jsonPath("$.byStatusCode").exists());
    }

    @Test
    void shouldStartWithZeroCountsAfterReset() throws Exception {
        mockMvc.perform(get("/metrics"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalRequests", is(0)))
                .andExpect(jsonPath("$.successCount", is(0)))
                .andExpect(jsonPath("$.failureCount", is(0)));
    }

    @Test
    void shouldCountSuccessfulRequests() throws Exception {
        mockMvc.perform(get("/health"));
        mockMvc.perform(get("/health"));

        mockMvc.perform(get("/metrics"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalRequests", greaterThanOrEqualTo(2)))
                .andExpect(jsonPath("$.successCount", greaterThanOrEqualTo(2)));
    }

    @Test
    void shouldCountFailedRequests() throws Exception {
        mockMvc.perform(get("/api/products"));

        mockMvc.perform(get("/metrics"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.failureCount", greaterThanOrEqualTo(1)))
                .andExpect(jsonPath("$.byStatusCode.401", greaterThanOrEqualTo(1)));
    }

    @Test
    void shouldTrackBothSuccessAndFailureCounts() throws Exception {
        mockMvc.perform(get("/health"));
        mockMvc.perform(get("/api/products"));

        mockMvc.perform(get("/metrics"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.successCount", greaterThanOrEqualTo(1)))
                .andExpect(jsonPath("$.failureCount", greaterThanOrEqualTo(1)));
    }

    @Test
    void shouldNotRequireAuthentication() throws Exception {
        mockMvc.perform(get("/metrics"))
                .andExpect(status().isOk());
    }

    @Test
    void shouldReturnJsonContentType() throws Exception {
        mockMvc.perform(get("/metrics"))
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON));
    }
}
