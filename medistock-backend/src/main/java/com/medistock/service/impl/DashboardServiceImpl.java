package com.medistock.service.impl;

import com.medistock.dto.DashboardSummaryDTO;
import com.medistock.dto.PageResponse;
import com.medistock.dto.StockLogDTO;
import com.medistock.enums.ExpiryStatus;
import com.medistock.enums.OrderStatus;
import com.medistock.repository.*;
import com.medistock.service.DashboardService;
import com.medistock.service.ExpiryTrackingService;
import com.medistock.service.StockLogService;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
public class DashboardServiceImpl implements DashboardService {

    private final MedicineRepository medicineRepository;
    private final SupplierRepository supplierRepository;
    private final InventoryRepository inventoryRepository;
    private final PurchaseOrderRepository purchaseOrderRepository;
    private final NotificationRepository notificationRepository;
    private final ExpiryTrackingService expiryTrackingService;
    private final StockLogService stockLogService;

    public DashboardServiceImpl(MedicineRepository medicineRepository, SupplierRepository supplierRepository, InventoryRepository inventoryRepository, PurchaseOrderRepository purchaseOrderRepository, NotificationRepository notificationRepository, ExpiryTrackingService expiryTrackingService, StockLogService stockLogService) {
        this.medicineRepository = medicineRepository;
        this.supplierRepository = supplierRepository;
        this.inventoryRepository = inventoryRepository;
        this.purchaseOrderRepository = purchaseOrderRepository;
        this.notificationRepository = notificationRepository;
        this.expiryTrackingService = expiryTrackingService;
        this.stockLogService = stockLogService;
    }

    @Override
    @Transactional(readOnly = true)
    public DashboardSummaryDTO getDashboardSummary() {
        long totalMedicines = medicineRepository.count();
        long lowStockCount = inventoryRepository.countLowStockItems();
        long expiringSoonCount = expiryTrackingService.countByStatus(ExpiryStatus.EXPIRING_SOON);
        long expiredCount = expiryTrackingService.countByStatus(ExpiryStatus.EXPIRED);
        long totalSuppliers = supplierRepository.count();
        long pendingOrdersCount = purchaseOrderRepository.countByStatus(OrderStatus.PENDING);
        Double invValue = inventoryRepository.getTotalInventoryValue();
        BigDecimal totalInventoryValue = invValue != null ? BigDecimal.valueOf(invValue) : BigDecimal.ZERO;
        long unreadNotificationsCount = notificationRepository.countByStatus("UNREAD");

        PageResponse<StockLogDTO> recentLogsPage = stockLogService.getAllStockLogs(
                PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "createdAt"))
        );

        return DashboardSummaryDTO.builder()
                .totalMedicines(totalMedicines)
                .lowStockCount(lowStockCount)
                .expiringSoonCount(expiringSoonCount)
                .expiredCount(expiredCount)
                .totalSuppliers(totalSuppliers)
                .pendingOrdersCount(pendingOrdersCount)
                .totalInventoryValue(totalInventoryValue)
                .unreadNotificationsCount(unreadNotificationsCount)
                .recentActivities(recentLogsPage.getContent())
                .build();
    }
}
