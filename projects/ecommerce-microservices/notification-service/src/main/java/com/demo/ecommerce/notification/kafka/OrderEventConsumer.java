package com.demo.ecommerce.notification.kafka;

import com.demo.ecommerce.common.dto.OrderEvent;
import com.demo.ecommerce.notification.service.NotificationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class OrderEventConsumer {

    private static final Logger log = LoggerFactory.getLogger(OrderEventConsumer.class);

    private final NotificationService notificationService;

    public OrderEventConsumer(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @KafkaListener(topics = "order.created", groupId = "notification-group")
    public void handleOrderCreated(OrderEvent event) {
        log.info("Received ORDER_CREATED event: orderId={}, userId={}",
                event.getOrderId(), event.getUserId());

        String message = String.format(
                "Your order #%d has been placed! Product: %d, Qty: %d, Total: %s",
                event.getOrderId(), event.getProductId(),
                event.getQuantity(), event.getTotalPrice());

        notificationService.create(
                event.getOrderId(), event.getUserId(),
                "ORDER_CONFIRMATION", message);
    }
}
