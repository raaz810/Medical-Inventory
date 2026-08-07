package com.medistock.dto;

import java.math.BigDecimal;
import java.util.List;

public class DashboardSummaryDTO {
    private long totalMedicines;
    private long lowStockCount;
    private long expiringSoonCount;
    private long expiredCount;
    private long totalSuppliers;
    private long pendingOrdersCount;
    private BigDecimal totalInventoryValue;
    private long unreadNotificationsCount;
    private List<StockLogDTO> recentActivities;

    public DashboardSummaryDTO() {}

    public DashboardSummaryDTO(long totalMedicines, long lowStockCount, long expiringSoonCount, long expiredCount, long totalSuppliers, long pendingOrdersCount, BigDecimal totalInventoryValue, long unreadNotificationsCount, List<StockLogDTO> recentActivities) {
        this.totalMedicines = totalMedicines;
        this.lowStockCount = lowStockCount;
        this.expiringSoonCount = expiringSoonCount;
        this.expiredCount = expiredCount;
        this.totalSuppliers = totalSuppliers;
        this.pendingOrdersCount = pendingOrdersCount;
        this.totalInventoryValue = totalInventoryValue;
        this.unreadNotificationsCount = unreadNotificationsCount;
        this.recentActivities = recentActivities;
    }

    public long getTotalMedicines() { return totalMedicines; }
    public void setTotalMedicines(long totalMedicines) { this.totalMedicines = totalMedicines; }

    public long getLowStockCount() { return lowStockCount; }
    public void setLowStockCount(long lowStockCount) { this.lowStockCount = lowStockCount; }

    public long getExpiringSoonCount() { return expiringSoonCount; }
    public void setExpiringSoonCount(long expiringSoonCount) { this.expiringSoonCount = expiringSoonCount; }

    public long getExpiredCount() { return expiredCount; }
    public void setExpiredCount(long expiredCount) { this.expiredCount = expiredCount; }

    public long getTotalSuppliers() { return totalSuppliers; }
    public void setTotalSuppliers(long totalSuppliers) { this.totalSuppliers = totalSuppliers; }

    public long getPendingOrdersCount() { return pendingOrdersCount; }
    public void setPendingOrdersCount(long pendingOrdersCount) { this.pendingOrdersCount = pendingOrdersCount; }

    public BigDecimal getTotalInventoryValue() { return totalInventoryValue; }
    public void setTotalInventoryValue(BigDecimal totalInventoryValue) { this.totalInventoryValue = totalInventoryValue; }

    public long getUnreadNotificationsCount() { return unreadNotificationsCount; }
    public void setUnreadNotificationsCount(long unreadNotificationsCount) { this.unreadNotificationsCount = unreadNotificationsCount; }

    public List<StockLogDTO> getRecentActivities() { return recentActivities; }
    public void setRecentActivities(List<StockLogDTO> recentActivities) { this.recentActivities = recentActivities; }

    public static DashboardSummaryDTOBuilder builder() { return new DashboardSummaryDTOBuilder(); }

    public static class DashboardSummaryDTOBuilder {
        private long totalMedicines;
        private long lowStockCount;
        private long expiringSoonCount;
        private long expiredCount;
        private long totalSuppliers;
        private long pendingOrdersCount;
        private BigDecimal totalInventoryValue;
        private long unreadNotificationsCount;
        private List<StockLogDTO> recentActivities;

        public DashboardSummaryDTOBuilder totalMedicines(long v) { this.totalMedicines = v; return this; }
        public DashboardSummaryDTOBuilder lowStockCount(long v) { this.lowStockCount = v; return this; }
        public DashboardSummaryDTOBuilder expiringSoonCount(long v) { this.expiringSoonCount = v; return this; }
        public DashboardSummaryDTOBuilder expiredCount(long v) { this.expiredCount = v; return this; }
        public DashboardSummaryDTOBuilder totalSuppliers(long v) { this.totalSuppliers = v; return this; }
        public DashboardSummaryDTOBuilder pendingOrdersCount(long v) { this.pendingOrdersCount = v; return this; }
        public DashboardSummaryDTOBuilder totalInventoryValue(BigDecimal v) { this.totalInventoryValue = v; return this; }
        public DashboardSummaryDTOBuilder unreadNotificationsCount(long v) { this.unreadNotificationsCount = v; return this; }
        public DashboardSummaryDTOBuilder recentActivities(List<StockLogDTO> v) { this.recentActivities = v; return this; }

        public DashboardSummaryDTO build() {
            return new DashboardSummaryDTO(totalMedicines, lowStockCount, expiringSoonCount, expiredCount, totalSuppliers, pendingOrdersCount, totalInventoryValue, unreadNotificationsCount, recentActivities);
        }
    }
}
