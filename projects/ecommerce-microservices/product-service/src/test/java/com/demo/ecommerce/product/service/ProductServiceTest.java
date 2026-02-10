package com.demo.ecommerce.product.service;

import com.demo.ecommerce.common.exception.ResourceNotFoundException;
import com.demo.ecommerce.product.dto.CreateProductRequest;
import com.demo.ecommerce.product.dto.UpdateProductRequest;
import com.demo.ecommerce.product.entity.Product;
import com.demo.ecommerce.product.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductService productService;

    private Product testProduct;

    @BeforeEach
    void setUp() {
        testProduct = new Product("MacBook Pro", "Laptop", new BigDecimal("1999.99"), 50, "Electronics");
        testProduct.setId(1L);
    }

    // --- findAll ---

    @Test
    @DisplayName("findAll - returns paginated products")
    void findAll_returnsPaginatedProducts() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Product> page = new PageImpl<>(List.of(testProduct));

        when(productRepository.findAll(pageable)).thenReturn(page);

        Page<Product> result = productService.findAll(pageable);

        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).getName()).isEqualTo("MacBook Pro");
    }

    // --- findById ---

    @Test
    @DisplayName("findById - found")
    void findById_found() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(testProduct));

        Product result = productService.findById(1L);

        assertThat(result.getName()).isEqualTo("MacBook Pro");
        assertThat(result.getPrice()).isEqualByComparingTo(new BigDecimal("1999.99"));
    }

    @Test
    @DisplayName("findById - not found throws exception")
    void findById_notFound() {
        when(productRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> productService.findById(99L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Product");
    }

    // --- create ---

    @Test
    @DisplayName("create - success")
    void create_success() {
        CreateProductRequest request = new CreateProductRequest();
        request.setName("iPhone 16");
        request.setDescription("Smartphone");
        request.setPrice(new BigDecimal("999.99"));
        request.setStock(100);
        request.setCategory("Electronics");

        Product saved = new Product("iPhone 16", "Smartphone", new BigDecimal("999.99"), 100, "Electronics");
        saved.setId(2L);

        when(productRepository.save(any(Product.class))).thenReturn(saved);

        Product result = productService.create(request);

        assertThat(result.getId()).isEqualTo(2L);
        assertThat(result.getName()).isEqualTo("iPhone 16");
        verify(productRepository).save(any(Product.class));
    }

    // --- update ---

    @Test
    @DisplayName("update - partial update success")
    void update_partialUpdate() {
        UpdateProductRequest request = new UpdateProductRequest();
        request.setPrice(new BigDecimal("1799.99"));

        when(productRepository.findById(1L)).thenReturn(Optional.of(testProduct));
        when(productRepository.save(any(Product.class))).thenReturn(testProduct);

        Product result = productService.update(1L, request);

        assertThat(result.getPrice()).isEqualByComparingTo(new BigDecimal("1799.99"));
        assertThat(result.getName()).isEqualTo("MacBook Pro"); // unchanged
    }

    @Test
    @DisplayName("update - not found throws exception")
    void update_notFound() {
        UpdateProductRequest request = new UpdateProductRequest();
        request.setName("Updated");

        when(productRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> productService.update(99L, request))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    // --- delete ---

    @Test
    @DisplayName("delete - success")
    void delete_success() {
        when(productRepository.existsById(1L)).thenReturn(true);

        productService.delete(1L);

        verify(productRepository).deleteById(1L);
    }

    @Test
    @DisplayName("delete - not found throws exception")
    void delete_notFound() {
        when(productRepository.existsById(99L)).thenReturn(false);

        assertThatThrownBy(() -> productService.delete(99L))
                .isInstanceOf(ResourceNotFoundException.class);

        verify(productRepository, never()).deleteById(any());
    }
}
