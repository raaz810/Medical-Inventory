package com.medistock.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class InventoryDTO {
    private Long id;

    @NotNull(message = "Medicine ID is required")
    private Long medicineId;

    private String medicineCode;
    private String medicineName;
    private String category;

    @NotNull(message = "Quantity is required")
    @Min(value = 0, message = "Quantity cannot be negative")
    private Integer quantity;

    @NotNull(message = "Minimum stock is required")
    @Min(value = 0, message = "Minimum stock cannot be negative")
    private Integer minimumStock;

    @NotNull(message = "Maximum stock is required")
    @Min(value = 0, message = "Maximum stock cannot be negative")
    private Integer maximumStock;

    private String location;
    private LocalDateTime lastUpdated;
    private Boolean isLowStock;

    public InventoryDTO() {}

    public InventoryDTO(Long id, Long medicineId, String medicineCode, String medicineName, String category, Integer quantity, Integer minimumStock, Integer maximumStock, String location, LocalDateTime lastUpdated, Boolean isLowStock) {
        this.id = id;
        this.medicineId = medicineId;
        this.medicineCode = medicineCode;
        this.medicineName = medicineName;
        this.category = category;
        this.quantity = quantity;
        this.minimumStock = minimumStock;
        this.maximumStock = maximumStock;
        this.location = location;
        this.lastUpdated = lastUpdated;
        this.isLowStock = isLowStock;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getMedicineId() { return medicineId; }
    public void setMedicineId(Long medicineId) { this.medicineId = medicineId; }

    public String getMedicineCode() { return medicineCode; }
    public void setMedicineCode(String medicineCode) { this.medicineCode = medicineCode; }

    public String getMedicineName() { return medicineName; }
    public void setMedicineName(String medicineName) { this.medicineName = medicineName; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public Integer getMinimumStock() { return minimumStock; }
    public void setMinimumStock(Integer minimumStock) { this.minimumStock = minimumStock; }

    public Integer getMaximumStock() { return maximumStock; }
    public void setMaximumStock(Integer maximumStock) { this.maximumStock = maximumStock; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public LocalDateTime getLastUpdated() { return lastUpdated; }
    public void setLastUpdated(LocalDateTime lastUpdated) { this.lastUpdated = lastUpdated; }

    public Boolean getIsLowStock() { return isLowStock; }
    public void setIsLowStock(Boolean isLowStock) { this.isLowStock = isLowStock; }

    public static InventoryDTOBuilder builder() { return new InventoryDTOBuilder(); }

    public static class InventoryDTOBuilder {
        private Long id;
        private Long medicineId;
        private String medicineCode;
        private String medicineName;
        private String category;
        private Integer quantity;
        private Integer minimumStock;
        private Integer maximumStock;
        private String location;
        private LocalDateTime lastUpdated;
        private Boolean isLowStock;

        public InventoryDTOBuilder id(Long id) { this.id = id; return this; }
        public InventoryDTOBuilder medicineId(Long medicineId) { this.medicineId = medicineId; return this; }
        public InventoryDTOBuilder medicineCode(String medicineCode) { this.medicineCode = medicineCode; return this; }
        public InventoryDTOBuilder medicineName(String medicineName) { this.medicineName = medicineName; return this; }
        public InventoryDTOBuilder category(String category) { this.category = category; return this; }
        public InventoryDTOBuilder quantity(Integer quantity) { this.quantity = quantity; return this; }
        public InventoryDTOBuilder minimumStock(Integer minimumStock) { this.minimumStock = minimumStock; return this; }
        public InventoryDTOBuilder maximumStock(Integer maximumStock) { this.maximumStock = maximumStock; return this; }
        public InventoryDTOBuilder location(String location) { this.location = location; return this; }
        public InventoryDTOBuilder lastUpdated(LocalDateTime lastUpdated) { this.lastUpdated = lastUpdated; return this; }
        public InventoryDTOBuilder isLowStock(Boolean isLowStock) { this.isLowStock = isLowStock; return this; }

        public InventoryDTO build() {
            return new InventoryDTO(id, medicineId, medicineCode, medicineName, category, quantity, minimumStock, maximumStock, location, lastUpdated, isLowStock);
        }
    }
}
