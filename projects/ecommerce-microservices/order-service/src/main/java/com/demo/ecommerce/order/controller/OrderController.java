package com.demo.ecommerce.order.controller;

import com.demo.ecommerce.common.dto.ApiResponse;
import com.demo.ecommerce.order.dto.CreateOrderRequest;
import com.demo.ecommerce.order.entity.Order;
import com.demo.ecommerce.order.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Order>> createOrder(@Valid @RequestBody CreateOrderRequest request) {
        Order order = orderService.createOrder(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Order created", order));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Order>> getById(@PathVariable Long id) {
        Order order = orderService.findById(id);
        return ResponseEntity.ok(ApiResponse.ok(order));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Order>>> getByUserId(@RequestParam Long userId) {
        List<Order> orders = orderService.findByUserId(userId);
        return ResponseEntity.ok(ApiResponse.ok(orders));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<Order>> updateStatus(
            @PathVariable Long id, @RequestBody Map<String, String> body) {
        String status = body.get("status");
        Order order = orderService.updateStatus(id, status);
        return ResponseEntity.ok(ApiResponse.ok("Status updated", order));
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of(
                "service", "order-service",
                "status", "UP"
        ));
    }
}
