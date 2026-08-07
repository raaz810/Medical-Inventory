package com.medistock.repository;

import com.medistock.entity.PurchaseOrder;
import com.medistock.enums.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;

@Repository
public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, Long> {
    Page<PurchaseOrder> findByStatus(OrderStatus status, Pageable pageable);
    Page<PurchaseOrder> findBySupplierId(Long supplierId, Pageable pageable);
    boolean existsByOrderNumber(String orderNumber);
    long countByStatus(OrderStatus status);

    @Query("SELECT SUM(po.totalAmount) FROM PurchaseOrder po WHERE po.status <> 'CANCELLED'")
    BigDecimal getTotalPurchaseAmount();
}
