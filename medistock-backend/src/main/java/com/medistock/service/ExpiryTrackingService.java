package com.medistock.service;

import com.medistock.dto.ExpiryTrackingDTO;
import com.medistock.dto.PageResponse;
import com.medistock.enums.ExpiryStatus;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ExpiryTrackingService {
    ExpiryTrackingDTO addExpiryRecord(ExpiryTrackingDTO dto);
    PageResponse<ExpiryTrackingDTO> getAllExpiryRecords(ExpiryStatus status, Pageable pageable);
    PageResponse<ExpiryTrackingDTO> getExpiryRecordsByMedicineId(Long medicineId, Pageable pageable);
    List<ExpiryTrackingDTO> getExpiringSoon();
    List<ExpiryTrackingDTO> getExpired();
    void updateExpiryStatuses();
    long countByStatus(ExpiryStatus status);
}
