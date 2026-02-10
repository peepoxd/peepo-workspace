package com.demo.ecommerce.inventory.entity;

import jakarta.persistence.*;

/**
 * Inventory entity — สต็อกสินค้า (แยก DB จาก Product Service)
 * productId อ้างอิงจาก product-service แต่ไม่ได้ join ข้าม DB
 */
@Entity
@Table(name = "inventory")
public class Inventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private Long productId;

    @Column(nullable = false)
    private int quantity;

    @Column(nullable = false)
    private int reserved; // จำนวนที่จองไว้แต่ยังไม่ตัด

    public Inventory() {}

    public Inventory(Long productId, int quantity) {
        this.productId = productId;
        this.quantity = quantity;
        this.reserved = 0;
    }

    /**
     * สต็อกที่ขายได้จริง = quantity - reserved
     */
    public int getAvailable() {
        return quantity - reserved;
    }

    // Getters and Setters

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }

    public int getReserved() { return reserved; }
    public void setReserved(int reserved) { this.reserved = reserved; }
}
