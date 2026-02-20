package com.peepo.ordermanagement.repository;

import com.peepo.ordermanagement.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    
    List<Order> findByStatus(Order.OrderStatus status);
    
    List<Order> findByCustomerName(String customerName);
    
    @Query("SELECT o FROM Order o WHERE o.customerName = :customerName AND o.status = :status")
    List<Order> findByCustomerNameAndStatus(@Param("customerName") String customerName, 
                                          @Param("status") Order.OrderStatus status);
}