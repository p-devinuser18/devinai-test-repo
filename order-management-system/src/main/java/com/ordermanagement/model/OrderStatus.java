package com.ordermanagement.model;

import java.util.List;
import java.util.Map;

public enum OrderStatus {
    PENDING,
    CONFIRMED,
    SHIPPED,
    DELIVERED,
    CANCELLED;

    private static final Map<OrderStatus, List<OrderStatus>> VALID_TRANSITIONS = Map.of(
            PENDING, List.of(CONFIRMED, CANCELLED),
            CONFIRMED, List.of(SHIPPED, CANCELLED),
            SHIPPED, List.of(DELIVERED),
            DELIVERED, List.of(),
            CANCELLED, List.of()
    );

    public boolean canTransitionTo(OrderStatus target) {
        return VALID_TRANSITIONS.getOrDefault(this, List.of()).contains(target);
    }
}
