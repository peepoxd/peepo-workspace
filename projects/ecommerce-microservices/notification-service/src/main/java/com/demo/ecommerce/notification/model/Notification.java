package com.demo.ecommerce.notification.model;

import java.time.LocalDateTime;

/**
 * In-memory notification record (no DB for this service — logs only)
 */
public class Notification {

    private Long id;
    private Long orderId;
    private Long userId;
    private String type;
    private String message;
    private LocalDateTime createdAt;

    public Notification() {}

    public Notification(Long id, Long orderId, Long userId, String type, String message) {
        this.id = id;
        this.orderId = orderId;
        this.userId = userId;
        this.type = type;
        this.message = message;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
