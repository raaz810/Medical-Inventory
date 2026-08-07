package com.medistock.service.impl;

import com.medistock.dto.MedicineDTO;
import com.medistock.dto.PageResponse;
import com.medistock.entity.Inventory;
import com.medistock.entity.Medicine;
import com.medistock.entity.Supplier;
import com.medistock.exception.BadRequestException;
import com.medistock.exception.ResourceNotFoundException;
import com.medistock.repository.InventoryRepository;
import com.medistock.repository.MedicineRepository;
import com.medistock.repository.SupplierRepository;
import com.medistock.service.MedicineService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;

@Service
public class MedicineServiceImpl implements MedicineService {

    private final MedicineRepository medicineRepository;
    private final InventoryRepository inventoryRepository;
    private final SupplierRepository supplierRepository;

    public MedicineServiceImpl(MedicineRepository medicineRepository, InventoryRepository inventoryRepository, SupplierRepository supplierRepository) {
        this.medicineRepository = medicineRepository;
        this.inventoryRepository = inventoryRepository;
        this.supplierRepository = supplierRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<MedicineDTO> getAllMedicines(String search, String category, Pageable pageable) {
        Page<Medicine> medicinePage;
        if (StringUtils.hasText(search)) {
            medicinePage = medicineRepository.searchMedicines(search, pageable);
        } else if (StringUtils.hasText(category)) {
            medicinePage = medicineRepository.findByCategory(category, pageable);
        } else {
            medicinePage = medicineRepository.findAll(pageable);
        }

        List<MedicineDTO> dtos = medicinePage.getContent().stream()
                .map(this::mapToDTO)
                .toList();

        return PageResponse.<MedicineDTO>builder()
                .content(dtos)
                .pageNumber(medicinePage.getNumber())
                .pageSize(medicinePage.getSize())
                .totalElements(medicinePage.getTotalElements())
                .totalPages(medicinePage.getTotalPages())
                .first(medicinePage.isFirst())
                .last(medicinePage.isLast())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public MedicineDTO getMedicineById(Long id) {
        Medicine medicine = medicineRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Medicine", "id", id));
        return mapToDTO(medicine);
    }

    @Override
    @Transactional(readOnly = true)
    public MedicineDTO getMedicineByCode(String code) {
        Medicine medicine = medicineRepository.findByMedicineCode(code)
                .orElseThrow(() -> new ResourceNotFoundException("Medicine", "medicineCode", code));
        return mapToDTO(medicine);
    }

    @Override
    @Transactional
    public MedicineDTO createMedicine(MedicineDTO dto) {
        if (medicineRepository.existsByMedicineCode(dto.getMedicineCode())) {
            throw new BadRequestException("Medicine with code '" + dto.getMedicineCode() + "' already exists");
        }

        Supplier supplier = null;
        if (dto.getSupplierId() != null) {
            supplier = supplierRepository.findById(dto.getSupplierId())
                    .orElseThrow(() -> new ResourceNotFoundException("Supplier", "id", dto.getSupplierId()));
        }

        Medicine medicine = Medicine.builder()
                .medicineCode(dto.getMedicineCode())
                .medicineName(dto.getMedicineName())
                .genericName(dto.getGenericName())
                .category(dto.getCategory())
                .manufacturer(dto.getManufacturer())
                .unitPrice(dto.getUnitPrice())
                .sellingPrice(dto.getSellingPrice())
                .batchNumber(dto.getBatchNumber())
                .description(dto.getDescription())
                .supplier(supplier)
                .build();

        Medicine savedMedicine = medicineRepository.save(medicine);

        // Auto-initialize inventory record for this medicine
        if (inventoryRepository.findByMedicineId(savedMedicine.getId()).isEmpty()) {
            Inventory inventory = Inventory.builder()
                    .medicine(savedMedicine)
                    .quantity(0)
                    .minimumStock(10)
                    .maximumStock(500)
                    .location("Main Pharmacy")
                    .build();
            inventoryRepository.save(inventory);
        }

        return mapToDTO(savedMedicine);
    }

    @Override
    @Transactional
    public MedicineDTO updateMedicine(Long id, MedicineDTO dto) {
        Medicine medicine = medicineRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Medicine", "id", id));

        if (!medicine.getMedicineCode().equalsIgnoreCase(dto.getMedicineCode()) &&
                medicineRepository.existsByMedicineCode(dto.getMedicineCode())) {
            throw new BadRequestException("Medicine with code '" + dto.getMedicineCode() + "' already exists");
        }

        Supplier supplier = null;
        if (dto.getSupplierId() != null) {
            supplier = supplierRepository.findById(dto.getSupplierId())
                    .orElseThrow(() -> new ResourceNotFoundException("Supplier", "id", dto.getSupplierId()));
        }

        medicine.setMedicineCode(dto.getMedicineCode());
        medicine.setMedicineName(dto.getMedicineName());
        medicine.setGenericName(dto.getGenericName());
        medicine.setCategory(dto.getCategory());
        medicine.setManufacturer(dto.getManufacturer());
        medicine.setUnitPrice(dto.getUnitPrice());
        medicine.setSellingPrice(dto.getSellingPrice());
        medicine.setBatchNumber(dto.getBatchNumber());
        medicine.setDescription(dto.getDescription());
        medicine.setSupplier(supplier);

        Medicine updatedMedicine = medicineRepository.save(medicine);
        return mapToDTO(updatedMedicine);
    }

    @Override
    @Transactional
    public void deleteMedicine(Long id) {
        Medicine medicine = medicineRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Medicine", "id", id));
        inventoryRepository.findByMedicineId(id).ifPresent(inventoryRepository::delete);
        medicineRepository.delete(medicine);
    }

    @Override
    @Transactional(readOnly = true)
    public List<String> getAllCategories() {
        return medicineRepository.findDistinctCategories();
    }

    private MedicineDTO mapToDTO(Medicine medicine) {
        return MedicineDTO.builder()
                .id(medicine.getId())
                .medicineCode(medicine.getMedicineCode())
                .medicineName(medicine.getMedicineName())
                .genericName(medicine.getGenericName())
                .category(medicine.getCategory())
                .manufacturer(medicine.getManufacturer())
                .unitPrice(medicine.getUnitPrice())
                .sellingPrice(medicine.getSellingPrice())
                .batchNumber(medicine.getBatchNumber())
                .description(medicine.getDescription())
                .supplierId(medicine.getSupplier() != null ? medicine.getSupplier().getId() : null)
                .supplierName(medicine.getSupplier() != null ? medicine.getSupplier().getSupplierName() : null)
                .createdAt(medicine.getCreatedAt())
                .build();
    }
}
