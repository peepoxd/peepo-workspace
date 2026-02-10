package com.demo.ecommerce.order.service;

import com.demo.ecommerce.common.dto.OrderEvent;
import com.demo.ecommerce.common.exception.ResourceNotFoundException;
import com.demo.ecommerce.order.client.InventoryClient;
import com.demo.ecommerce.order.dto.CreateOrderRequest;
import com.demo.ecommerce.order.entity.Order;
import com.demo.ecommerce.order.repository.OrderRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class OrderService {

    private static final Logger log = LoggerFactory.getLogger(OrderService.class);
    private static final String ORDER_TOPIC = "order.created";

    private final OrderRepository orderRepository;
    private final KafkaTemplate<String, OrderEvent> kafkaTemplate;
    private final InventoryClient inventoryClient;

    public OrderService(OrderRepository orderRepository,
                        KafkaTemplate<String, OrderEvent> kafkaTemplate,
                        InventoryClient inventoryClient) {
        this.orderRepository = orderRepository;
        this.kafkaTemplate = kafkaTemplate;
        this.inventoryClient = inventoryClient;
    }

    @Transactional
    public Order createOrder(CreateOrderRequest request) {
        // Check stock via Inventory Service (with circuit breaker)
        boolean inStock = inventoryClient.checkStock(request.getProductId(), request.getQuantity());
        if (!inStock) {
            throw new IllegalArgumentException(
                    "Insufficient stock for product " + request.getProductId());
        }

        Order order = new Order(
                request.getUserId(),
                request.getProductId(),
                request.getQuantity(),
                request.getTotalPrice()
        );
        order = orderRepository.save(order);

        // Publish event to Kafka
        OrderEvent event = new OrderEvent(
                "ORDER_CREATED",
                order.getId(),
                order.getUserId(),
                order.getProductId(),
                order.getQuantity(),
                order.getTotalPrice(),
                order.getStatus()
        );

        kafkaTemplate.send(ORDER_TOPIC, String.valueOf(order.getId()), event);
        log.info("Published ORDER_CREATED event for order {}", order.getId());

        return order;
    }

    public Order findById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", id));
    }

    public List<Order> findByUserId(Long userId) {
        return orderRepository.findByUserId(userId);
    }

    @Transactional
    public Order updateStatus(Long id, String status) {
        Order order = findById(id);
        order.setStatus(status);
        return orderRepository.save(order);
    }
}
