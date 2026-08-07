package com.medistock.controller;

import com.medistock.dto.ApiResponse;
import com.medistock.dto.MedicineDTO;
import com.medistock.dto.PageResponse;
import com.medistock.service.MedicineService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medicines")
@Tag(name = "Medicines", description = "Medicine Inventory Catalogue Management APIs")
public class MedicineController {

    private final MedicineService medicineService;

    public MedicineController(MedicineService medicineService) {
        this.medicineService = medicineService;
    }

    @GetMapping
    @Operation(summary = "Get All Medicines", description = "Paginated medicine search, category filter, and listing")
    public ResponseEntity<ApiResponse<PageResponse<MedicineDTO>>> getAllMedicines(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "medicineName") String sortBy,
            @RequestParam(defaultValue = "ASC") String sortDir
    ) {
        Sort sort = sortDir.equalsIgnoreCase("ASC") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        PageResponse<MedicineDTO> medicines = medicineService.getAllMedicines(search, category, pageable);
        return ResponseEntity.ok(ApiResponse.success(medicines));
    }

    @GetMapping("/search")
    @Operation(summary = "Search Medicines", description = "Search medicines by name, code, generic name, category, supplier, or manufacturer")
    public ResponseEntity<ApiResponse<PageResponse<MedicineDTO>>> searchMedicines(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "medicineName") String sortBy,
            @RequestParam(defaultValue = "ASC") String sortDir
    ) {
        Sort sort = sortDir.equalsIgnoreCase("ASC") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        PageResponse<MedicineDTO> medicines = medicineService.getAllMedicines(search, category, pageable);
        return ResponseEntity.ok(ApiResponse.success(medicines));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get Medicine by ID", description = "Fetch medicine details by ID")
    public ResponseEntity<ApiResponse<MedicineDTO>> getMedicineById(@PathVariable Long id) {
        MedicineDTO medicine = medicineService.getMedicineById(id);
        return ResponseEntity.ok(ApiResponse.success(medicine));
    }

    @GetMapping("/code/{code}")
    @Operation(summary = "Get Medicine by Code", description = "Fetch medicine details by medicine code")
    public ResponseEntity<ApiResponse<MedicineDTO>> getMedicineByCode(@PathVariable String code) {
        MedicineDTO medicine = medicineService.getMedicineByCode(code);
        return ResponseEntity.ok(ApiResponse.success(medicine));
    }

    @PostMapping
    @Operation(summary = "Create Medicine", description = "Add a new medicine to catalogue (auto-initializes inventory)")
    public ResponseEntity<ApiResponse<MedicineDTO>> createMedicine(@Valid @RequestBody MedicineDTO dto) {
        MedicineDTO created = medicineService.createMedicine(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(created, "Medicine created successfully"));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update Medicine", description = "Update medicine details")
    public ResponseEntity<ApiResponse<MedicineDTO>> updateMedicine(
            @PathVariable Long id,
            @Valid @RequestBody MedicineDTO dto
    ) {
        MedicineDTO updated = medicineService.updateMedicine(id, dto);
        return ResponseEntity.ok(ApiResponse.success(updated, "Medicine updated successfully"));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete Medicine", description = "Remove medicine from catalogue")
    public ResponseEntity<ApiResponse<Void>> deleteMedicine(@PathVariable Long id) {
        medicineService.deleteMedicine(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Medicine deleted successfully"));
    }

    @GetMapping("/categories")
    @Operation(summary = "Get All Medicine Categories", description = "List unique categories available")
    public ResponseEntity<ApiResponse<List<String>>> getAllCategories() {
        List<String> categories = medicineService.getAllCategories();
        return ResponseEntity.ok(ApiResponse.success(categories));
    }
}
