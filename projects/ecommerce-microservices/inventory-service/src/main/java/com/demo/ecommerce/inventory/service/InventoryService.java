package com.demo.ecommerce.inventory.service;

import com.demo.ecommerce.common.exception.ResourceNotFoundException;
import com.demo.ecommerce.inventory.entity.Inventory;
import com.demo.ecommerce.inventory.repository.InventoryRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class InventoryService {

    private static final Logger log = LoggerFactory.getLogger(InventoryService.class);

    private final InventoryRepository inventoryRepository;

    public InventoryService(InventoryRepository inventoryRepository) {
        this.inventoryRepository = inventoryRepository;
    }

    public Inventory findByProductId(Long productId) {
        return inventoryRepository.findByProductId(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory for product", productId));
    }

    public List<Inventory> findAll() {
        return inventoryRepository.findAll();
    }

    @Transactional
    public void deductStock(Long productId, int quantity) {
        Inventory inventory = findByProductId(productId);

        if (inventory.getAvailable() < quantity) {
            log.warn("Insufficient stock for product {}: available={}, requested={}",
                    productId, inventory.getAvailable(), quantity);
            throw new IllegalArgumentException(
                    "Insufficient stock for product " + productId +
                    ": available=" + inventory.getAvailable() + ", requested=" + quantity);
        }

        inventory.setQuantity(inventory.getQuantity() - quantity);
        inventoryRepository.save(inventory);
        log.info("Deducted {} units from product {} stock. Remaining: {}",
                quantity, productId, inventory.getQuantity());
    }
}
