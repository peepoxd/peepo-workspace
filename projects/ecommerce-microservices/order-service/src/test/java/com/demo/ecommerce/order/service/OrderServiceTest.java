package com.demo.ecommerce.order.service;

import com.demo.ecommerce.common.dto.OrderEvent;
import com.demo.ecommerce.common.exception.ResourceNotFoundException;
import com.demo.ecommerce.order.client.InventoryClient;
import com.demo.ecommerce.order.dto.CreateOrderRequest;
import com.demo.ecommerce.order.entity.Order;
import com.demo.ecommerce.order.repository.OrderRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.kafka.core.KafkaTemplate;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private KafkaTemplate<String, OrderEvent> kafkaTemplate;

    @Mock
    private InventoryClient inventoryClient;

    @InjectMocks
    private OrderService orderService;

    private Order testOrder;
    private CreateOrderRequest createRequest;

    @BeforeEach
    void setUp() {
        testOrder = new Order(1L, 1L, 2, new BigDecimal("3999.98"));
        testOrder.setId(1L);

        createRequest = new CreateOrderRequest();
        createRequest.setUserId(1L);
        createRequest.setProductId(1L);
        createRequest.setQuantity(2);
        createRequest.setTotalPrice(new BigDecimal("3999.98"));
    }

    // --- createOrder ---

    @Test
    @DisplayName("createOrder - success with stock available")
    void createOrder_success() {
        when(inventoryClient.checkStock(1L, 2)).thenReturn(true);
        when(orderRepository.save(any(Order.class))).thenReturn(testOrder);

        Order result = orderService.createOrder(createRequest);

        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getStatus()).isEqualTo("PENDING");
        assertThat(result.getQuantity()).isEqualTo(2);

        // Verify Kafka event was published
        ArgumentCaptor<OrderEvent> eventCaptor = ArgumentCaptor.forClass(OrderEvent.class);
        verify(kafkaTemplate).send(eq("order.created"), eq("1"), eventCaptor.capture());

        OrderEvent event = eventCaptor.getValue();
        assertThat(event.getEventType()).isEqualTo("ORDER_CREATED");
        assertThat(event.getOrderId()).isEqualTo(1L);
        assertThat(event.getProductId()).isEqualTo(1L);
        assertThat(event.getQuantity()).isEqualTo(2);
    }

    @Test
    @DisplayName("createOrder - insufficient stock throws exception")
    void createOrder_insufficientStock() {
        when(inventoryClient.checkStock(1L, 2)).thenReturn(false);

        assertThatThrownBy(() -> orderService.createOrder(createRequest))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Insufficient stock");

        verify(orderRepository, never()).save(any());
        verify(kafkaTemplate, never()).send(anyString(), anyString(), any());
    }

    // --- findById ---

    @Test
    @DisplayName("findById - found")
    void findById_found() {
        when(orderRepository.findById(1L)).thenReturn(Optional.of(testOrder));

        Order result = orderService.findById(1L);

        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getUserId()).isEqualTo(1L);
    }

    @Test
    @DisplayName("findById - not found throws exception")
    void findById_notFound() {
        when(orderRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> orderService.findById(99L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Order");
    }

    // --- findByUserId ---

    @Test
    @DisplayName("findByUserId - returns orders for user")
    void findByUserId_returnsOrders() {
        when(orderRepository.findByUserId(1L)).thenReturn(List.of(testOrder));

        List<Order> result = orderService.findByUserId(1L);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getUserId()).isEqualTo(1L);
    }

    // --- updateStatus ---

    @Test
    @DisplayName("updateStatus - success")
    void updateStatus_success() {
        when(orderRepository.findById(1L)).thenReturn(Optional.of(testOrder));
        when(orderRepository.save(any(Order.class))).thenReturn(testOrder);

        Order result = orderService.updateStatus(1L, "CONFIRMED");

        assertThat(result.getStatus()).isEqualTo("CONFIRMED");
        verify(orderRepository).save(testOrder);
    }

    @Test
    @DisplayName("updateStatus - order not found throws exception")
    void updateStatus_notFound() {
        when(orderRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> orderService.updateStatus(99L, "CONFIRMED"))
                .isInstanceOf(ResourceNotFoundException.class);
    }
}
