package com.medistock.repository;

import com.medistock.entity.Medicine;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MedicineRepository extends JpaRepository<Medicine, Long> {
    Optional<Medicine> findByMedicineCode(String medicineCode);
    boolean existsByMedicineCode(String medicineCode);
    boolean existsBySupplierId(Long supplierId);
    long countBySupplierId(Long supplierId);

    @Query("SELECT m FROM Medicine m WHERE " +
           "LOWER(m.medicineName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(m.medicineCode) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(m.genericName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(m.category) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(m.manufacturer) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(m.supplier.supplierName) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<Medicine> searchMedicines(@Param("search") String search, Pageable pageable);

    Page<Medicine> findByCategory(String category, Pageable pageable);

    @Query("SELECT DISTINCT m.category FROM Medicine m ORDER BY m.category")
    List<String> findDistinctCategories();
}
