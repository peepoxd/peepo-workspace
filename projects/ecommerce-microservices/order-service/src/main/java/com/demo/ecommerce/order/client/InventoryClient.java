package com.demo.ecommerce.order.client;

import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

/**
 * REST client to Inventory Service with Circuit Breaker.
 * When Inventory Service is down, the circuit breaker opens and returns fallback.
 */
@Component
public class InventoryClient {

    private static final Logger log = LoggerFactory.getLogger(InventoryClient.class);

    private final RestTemplate restTemplate;
    private final String inventoryServiceUrl;

    public InventoryClient(RestTemplate restTemplate,
                           @Value("${services.inventory.url:http://localhost:8084}") String inventoryServiceUrl) {
        this.restTemplate = restTemplate;
        this.inventoryServiceUrl = inventoryServiceUrl;
    }

    @CircuitBreaker(name = "inventoryService", fallbackMethod = "checkStockFallback")
    public boolean checkStock(Long productId, int quantity) {
        log.info("Checking stock for product {} (qty: {}) via Inventory Service", productId, quantity);

        @SuppressWarnings("unchecked")
        Map<String, Object> response = restTemplate.getForObject(
                inventoryServiceUrl + "/api/inventory/" + productId, Map.class);

        if (response != null && response.get("data") != null) {

            @SuppressWarnings("unchecked")
            Map<String, Object> data = (Map<String, Object>) response.get("data");
            int available = (int) data.get("quantity") - (int) data.get("reserved");
            boolean inStock = available >= quantity;
            
            log.info("Stock check result: product={}, available={}, requested={}, inStock={}",
                    productId, available, quantity, inStock);
            return inStock;
        }

        return false;
    }

    /**
     * Fallback: when Inventory Service is down, allow the order (optimistic).
     * In production, this could reject the order or queue it for retry.
     */
    @SuppressWarnings("unused")
    private boolean checkStockFallback(Long productId, int quantity, Throwable t) {
        log.warn("Circuit breaker OPEN — Inventory Service unavailable. " +
                 "Allowing order optimistically. Error: {}", t.getMessage());
        return true;
    }
}
