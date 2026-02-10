package com.demo.ecommerce.inventory.kafka;

import com.demo.ecommerce.common.dto.OrderEvent;
import com.demo.ecommerce.inventory.service.InventoryService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class OrderEventConsumer {

    private static final Logger log = LoggerFactory.getLogger(OrderEventConsumer.class);

    private final InventoryService inventoryService;

    public OrderEventConsumer(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    /**
     * Deducts stock on order creation.
     * If deduction fails, the DefaultErrorHandler retries 3x then routes to order.created.DLT
     */
    @KafkaListener(topics = "order.created", groupId = "inventory-group")
    public void handleOrderCreated(OrderEvent event) {
        log.info("Received ORDER_CREATED event: orderId={}, productId={}, quantity={}",
                event.getOrderId(), event.getProductId(), event.getQuantity());

        inventoryService.deductStock(event.getProductId(), event.getQuantity());
        log.info("Stock deducted successfully for order {}", event.getOrderId());
    }
}
