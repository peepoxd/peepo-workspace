package com.demo.ecommerce.notification.controller;

import com.demo.ecommerce.common.dto.ApiResponse;
import com.demo.ecommerce.notification.model.Notification;
import com.demo.ecommerce.notification.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Notification>>> list(
            @RequestParam(required = false) Long userId) {
        List<Notification> notifications = (userId != null)
                ? notificationService.findByUserId(userId)
                : notificationService.findAll();
        return ResponseEntity.ok(ApiResponse.ok(notifications));
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of(
                "service", "notification-service",
                "status", "UP"
        ));
    }
}
