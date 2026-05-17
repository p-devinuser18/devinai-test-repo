package com.ordermanagement.service;

import com.ordermanagement.exception.InvalidStatusTransitionException;
import com.ordermanagement.exception.OrderNotFoundException;
import com.ordermanagement.model.Order;
import com.ordermanagement.model.OrderStatus;
import com.ordermanagement.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new OrderNotFoundException(id));
    }

    public Order createOrder(Order order) {
        order.setId(null);
        if (order.getStatus() == null) {
            order.setStatus(OrderStatus.PENDING);
        }
        if (order.getQuantity() != null && order.getPrice() != null) {
            order.setTotalAmount(order.getQuantity() * order.getPrice());
        }
        return orderRepository.save(order);
    }

    public Order updateOrder(Long id, Order updatedOrder) {
        Order existingOrder = orderRepository.findById(id)
                .orElseThrow(() -> new OrderNotFoundException(id));

        existingOrder.setCustomerName(updatedOrder.getCustomerName());
        existingOrder.setCustomerEmail(updatedOrder.getCustomerEmail());
        existingOrder.setProduct(updatedOrder.getProduct());
        existingOrder.setQuantity(updatedOrder.getQuantity());
        existingOrder.setPrice(updatedOrder.getPrice());
        existingOrder.setShippingAddress(updatedOrder.getShippingAddress());
        existingOrder.setOrderDate(updatedOrder.getOrderDate());

        if (updatedOrder.getQuantity() != null && updatedOrder.getPrice() != null) {
            existingOrder.setTotalAmount(updatedOrder.getQuantity() * updatedOrder.getPrice());
        }

        return orderRepository.save(existingOrder);
    }

    public void deleteOrder(Long id) {
        if (!orderRepository.existsById(id)) {
            throw new OrderNotFoundException(id);
        }
        orderRepository.deleteById(id);
    }

    public Order updateOrderStatus(Long id, OrderStatus newStatus) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new OrderNotFoundException(id));

        OrderStatus currentStatus = order.getStatus();
        if (!currentStatus.canTransitionTo(newStatus)) {
            throw new InvalidStatusTransitionException(currentStatus, newStatus);
        }

        order.setStatus(newStatus);
        return orderRepository.save(order);
    }
}
