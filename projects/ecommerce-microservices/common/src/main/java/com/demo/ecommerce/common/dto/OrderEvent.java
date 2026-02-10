package com.demo.ecommerce.common.dto;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Event ที่ส่งผ่าน Kafka เมื่อมี order เกิดขึ้น
 * ใช้ร่วมกันระหว่าง order-service (producer) กับ inventory-service, notification-service (consumers)
 */
public class OrderEvent implements Serializable {

    private static final long serialVersionUID = 1L;

    private String eventType;       // ORDER_CREATED, ORDER_CONFIRMED, ORDER_CANCELLED
    private Long orderId;
    private Long userId;
    private Long productId;
    private int quantity;
    private BigDecimal totalPrice;
    private String status;
    private LocalDateTime timestamp;

    public OrderEvent() {}

    public OrderEvent(String eventType, Long orderId, Long userId, Long productId,
                      int quantity, BigDecimal totalPrice, String status) {
        this.eventType = eventType;
        this.orderId = orderId;
        this.userId = userId;
        this.productId = productId;
        this.quantity = quantity;
        this.totalPrice = totalPrice;
        this.status = status;
        this.timestamp = LocalDateTime.now();
    }

    // Getters and Setters

    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }

    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }

    public BigDecimal getTotalPrice() { return totalPrice; }
    public void setTotalPrice(BigDecimal totalPrice) { this.totalPrice = totalPrice; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    @Override
    public String toString() {
        return "OrderEvent{" +
                "eventType='" + eventType + '\'' +
                ", orderId=" + orderId +
                ", productId=" + productId +
                ", quantity=" + quantity +
                ", status='" + status + '\'' +
                '}';
    }
}
