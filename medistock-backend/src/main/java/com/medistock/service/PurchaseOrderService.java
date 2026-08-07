package com.medistock.service;

import com.medistock.dto.PageResponse;
import com.medistock.dto.PurchaseOrderCreateRequest;
import com.medistock.dto.PurchaseOrderDTO;
import com.medistock.enums.OrderStatus;
import org.springframework.data.domain.Pageable;

public interface PurchaseOrderService {
    PurchaseOrderDTO createPurchaseOrder(PurchaseOrderCreateRequest request);
    PageResponse<PurchaseOrderDTO> getAllPurchaseOrders(OrderStatus status, Long supplierId, Pageable pageable);
    PurchaseOrderDTO getPurchaseOrderById(Long id);
    PurchaseOrderDTO updateOrderStatus(Long id, OrderStatus newStatus, String updatedBy);
    void cancelPurchaseOrder(Long id);
}
