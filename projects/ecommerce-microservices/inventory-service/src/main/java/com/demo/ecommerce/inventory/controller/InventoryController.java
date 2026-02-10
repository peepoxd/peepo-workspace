package com.demo.ecommerce.inventory.controller;

import com.demo.ecommerce.common.dto.ApiResponse;
import com.demo.ecommerce.inventory.entity.Inventory;
import com.demo.ecommerce.inventory.service.InventoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {

    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @GetMapping("/{productId}")
    public ResponseEntity<ApiResponse<Inventory>> getByProductId(@PathVariable Long productId) {
        Inventory inventory = inventoryService.findByProductId(productId);
        return ResponseEntity.ok(ApiResponse.ok(inventory));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Inventory>>> listAll() {
        List<Inventory> inventoryList = inventoryService.findAll();
        return ResponseEntity.ok(ApiResponse.ok(inventoryList));
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of(
                "service", "inventory-service",
                "status", "UP"
        ));
    }
}
