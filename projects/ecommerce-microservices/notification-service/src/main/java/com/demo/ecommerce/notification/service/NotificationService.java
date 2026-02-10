package com.demo.ecommerce.notification.service;

import com.demo.ecommerce.notification.model.Notification;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

/**
 * In-memory notification store (no DB — this service just logs and tracks)
 */
@Service
public class NotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);

    private final List<Notification> notifications = new ArrayList<>();
    private final AtomicLong idGenerator = new AtomicLong(1);

    public Notification create(Long orderId, Long userId, String type, String message) {
        Notification notification = new Notification(
                idGenerator.getAndIncrement(), orderId, userId, type, message);
        notifications.add(notification);
        log.info("[NOTIFICATION] {} — orderId={}, userId={}: {}",
                type, orderId, userId, message);
        return notification;
    }

    public List<Notification> findAll() {
        return new ArrayList<>(notifications);
    }

    public List<Notification> findByUserId(Long userId) {
        return notifications.stream()
                .filter(n -> n.getUserId().equals(userId))
                .collect(Collectors.toList());
    }
}
