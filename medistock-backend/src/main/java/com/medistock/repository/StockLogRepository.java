package com.medistock.repository;

import com.medistock.entity.StockLog;
import com.medistock.enums.ActionType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StockLogRepository extends JpaRepository<StockLog, Long> {
    Page<StockLog> findByMedicineId(Long medicineId, Pageable pageable);
    Page<StockLog> findByActionType(ActionType actionType, Pageable pageable);
    List<StockLog> findByMedicineIdOrderByCreatedAtDesc(Long medicineId);
}
