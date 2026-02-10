package com.demo.ecommerce.product.controller;

import com.demo.ecommerce.common.dto.ApiResponse;
import com.demo.ecommerce.product.dto.CreateProductRequest;
import com.demo.ecommerce.product.dto.UpdateProductRequest;
import com.demo.ecommerce.product.entity.Product;
import com.demo.ecommerce.product.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<Product>>> list(
            @PageableDefault(size = 10) Pageable pageable) {
        Page<Product> products = productService.findAll(pageable);
        return ResponseEntity.ok(ApiResponse.ok(products));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Product>> getById(@PathVariable Long id) {
        Product product = productService.findById(id);
        return ResponseEntity.ok(ApiResponse.ok(product));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Product>> create(@Valid @RequestBody CreateProductRequest request) {
        Product product = productService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Product created", product));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Product>> update(
            @PathVariable Long id, @Valid @RequestBody UpdateProductRequest request) {
        Product product = productService.update(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Product updated", product));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        productService.delete(id);
        return ResponseEntity.ok(ApiResponse.ok("Product deleted", null));
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of(
                "service", "product-service",
                "status", "UP"
        ));
    }
}
