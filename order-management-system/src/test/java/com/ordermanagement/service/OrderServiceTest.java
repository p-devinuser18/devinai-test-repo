package com.ordermanagement.service;

import com.ordermanagement.exception.InvalidStatusTransitionException;
import com.ordermanagement.exception.OrderNotFoundException;
import com.ordermanagement.model.Order;
import com.ordermanagement.model.OrderStatus;
import com.ordermanagement.repository.OrderRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @InjectMocks
    private OrderService orderService;

    private Order sampleOrder;

    @BeforeEach
    void setUp() {
        sampleOrder = new Order(1L, "Alice Johnson", "alice@example.com",
                "Wireless Headphones", 2, 49.99, 99.98,
                OrderStatus.PENDING, "2026-05-01", "123 Elm Street, Springfield, IL 62701");
    }

    @Test
    void getAllOrders_shouldReturnAllOrders() {
        Order order2 = new Order(2L, "Bob Smith", "bob@example.com",
                "Keyboard", 1, 129.99, 129.99,
                OrderStatus.CONFIRMED, "2026-04-28", "456 Oak Ave, Denver, CO 80202");

        when(orderRepository.findAll()).thenReturn(Arrays.asList(sampleOrder, order2));

        List<Order> result = orderService.getAllOrders();

        assertEquals(2, result.size());
        verify(orderRepository, times(1)).findAll();
    }

    @Test
    void getOrderById_shouldReturnOrder_whenExists() {
        when(orderRepository.findById(1L)).thenReturn(Optional.of(sampleOrder));

        Order result = orderService.getOrderById(1L);

        assertNotNull(result);
        assertEquals("Alice Johnson", result.getCustomerName());
        verify(orderRepository, times(1)).findById(1L);
    }

    @Test
    void getOrderById_shouldThrowException_whenNotExists() {
        when(orderRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(OrderNotFoundException.class, () -> orderService.getOrderById(99L));
        verify(orderRepository, times(1)).findById(99L);
    }

    @Test
    void createOrder_shouldSetDefaultStatusAndCalculateTotal() {
        Order newOrder = new Order();
        newOrder.setCustomerName("New Customer");
        newOrder.setCustomerEmail("new@example.com");
        newOrder.setProduct("Mouse");
        newOrder.setQuantity(3);
        newOrder.setPrice(25.00);

        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> {
            Order saved = invocation.getArgument(0);
            saved.setId(11L);
            return saved;
        });

        Order result = orderService.createOrder(newOrder);

        assertEquals(OrderStatus.PENDING, result.getStatus());
        assertEquals(75.00, result.getTotalAmount());
        assertEquals(11L, result.getId());
        verify(orderRepository, times(1)).save(any(Order.class));
    }

    @Test
    void createOrder_shouldKeepProvidedStatus() {
        Order newOrder = new Order();
        newOrder.setCustomerName("Customer");
        newOrder.setCustomerEmail("customer@example.com");
        newOrder.setProduct("Laptop");
        newOrder.setQuantity(1);
        newOrder.setPrice(999.99);
        newOrder.setStatus(OrderStatus.CONFIRMED);

        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> {
            Order saved = invocation.getArgument(0);
            saved.setId(12L);
            return saved;
        });

        Order result = orderService.createOrder(newOrder);

        assertEquals(OrderStatus.CONFIRMED, result.getStatus());
    }

    @Test
    void updateOrder_shouldUpdateFields_whenExists() {
        Order updatedData = new Order();
        updatedData.setCustomerName("Alice Updated");
        updatedData.setCustomerEmail("alice.updated@example.com");
        updatedData.setProduct("Updated Headphones");
        updatedData.setQuantity(5);
        updatedData.setPrice(39.99);
        updatedData.setShippingAddress("New Address");
        updatedData.setOrderDate("2026-05-15");

        when(orderRepository.findById(1L)).thenReturn(Optional.of(sampleOrder));
        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Order result = orderService.updateOrder(1L, updatedData);

        assertEquals("Alice Updated", result.getCustomerName());
        assertEquals("alice.updated@example.com", result.getCustomerEmail());
        assertEquals(5 * 39.99, result.getTotalAmount(), 0.01);
    }

    @Test
    void updateOrder_shouldThrowException_whenNotExists() {
        when(orderRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(OrderNotFoundException.class,
                () -> orderService.updateOrder(99L, new Order()));
    }

    @Test
    void deleteOrder_shouldDelete_whenExists() {
        when(orderRepository.existsById(1L)).thenReturn(true);
        when(orderRepository.deleteById(1L)).thenReturn(true);

        assertDoesNotThrow(() -> orderService.deleteOrder(1L));
        verify(orderRepository, times(1)).deleteById(1L);
    }

    @Test
    void deleteOrder_shouldThrowException_whenNotExists() {
        when(orderRepository.existsById(99L)).thenReturn(false);

        assertThrows(OrderNotFoundException.class, () -> orderService.deleteOrder(99L));
        verify(orderRepository, never()).deleteById(99L);
    }

    @Test
    void updateOrderStatus_pendingToConfirmed_shouldSucceed() {
        sampleOrder.setStatus(OrderStatus.PENDING);
        when(orderRepository.findById(1L)).thenReturn(Optional.of(sampleOrder));
        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Order result = orderService.updateOrderStatus(1L, OrderStatus.CONFIRMED);

        assertEquals(OrderStatus.CONFIRMED, result.getStatus());
    }

    @Test
    void updateOrderStatus_pendingToCancelled_shouldSucceed() {
        sampleOrder.setStatus(OrderStatus.PENDING);
        when(orderRepository.findById(1L)).thenReturn(Optional.of(sampleOrder));
        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Order result = orderService.updateOrderStatus(1L, OrderStatus.CANCELLED);

        assertEquals(OrderStatus.CANCELLED, result.getStatus());
    }

    @Test
    void updateOrderStatus_confirmedToShipped_shouldSucceed() {
        sampleOrder.setStatus(OrderStatus.CONFIRMED);
        when(orderRepository.findById(1L)).thenReturn(Optional.of(sampleOrder));
        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Order result = orderService.updateOrderStatus(1L, OrderStatus.SHIPPED);

        assertEquals(OrderStatus.SHIPPED, result.getStatus());
    }

    @Test
    void updateOrderStatus_confirmedToCancelled_shouldSucceed() {
        sampleOrder.setStatus(OrderStatus.CONFIRMED);
        when(orderRepository.findById(1L)).thenReturn(Optional.of(sampleOrder));
        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Order result = orderService.updateOrderStatus(1L, OrderStatus.CANCELLED);

        assertEquals(OrderStatus.CANCELLED, result.getStatus());
    }

    @Test
    void updateOrderStatus_shippedToDelivered_shouldSucceed() {
        sampleOrder.setStatus(OrderStatus.SHIPPED);
        when(orderRepository.findById(1L)).thenReturn(Optional.of(sampleOrder));
        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Order result = orderService.updateOrderStatus(1L, OrderStatus.DELIVERED);

        assertEquals(OrderStatus.DELIVERED, result.getStatus());
    }

    @Test
    void updateOrderStatus_deliveredToPending_shouldThrowException() {
        sampleOrder.setStatus(OrderStatus.DELIVERED);
        when(orderRepository.findById(1L)).thenReturn(Optional.of(sampleOrder));

        assertThrows(InvalidStatusTransitionException.class,
                () -> orderService.updateOrderStatus(1L, OrderStatus.PENDING));
    }

    @Test
    void updateOrderStatus_cancelledToConfirmed_shouldThrowException() {
        sampleOrder.setStatus(OrderStatus.CANCELLED);
        when(orderRepository.findById(1L)).thenReturn(Optional.of(sampleOrder));

        assertThrows(InvalidStatusTransitionException.class,
                () -> orderService.updateOrderStatus(1L, OrderStatus.CONFIRMED));
    }

    @Test
    void updateOrderStatus_shippedToCancelled_shouldThrowException() {
        sampleOrder.setStatus(OrderStatus.SHIPPED);
        when(orderRepository.findById(1L)).thenReturn(Optional.of(sampleOrder));

        assertThrows(InvalidStatusTransitionException.class,
                () -> orderService.updateOrderStatus(1L, OrderStatus.CANCELLED));
    }

    @Test
    void updateOrderStatus_shouldThrowException_whenOrderNotFound() {
        when(orderRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(OrderNotFoundException.class,
                () -> orderService.updateOrderStatus(99L, OrderStatus.CONFIRMED));
    }
}
