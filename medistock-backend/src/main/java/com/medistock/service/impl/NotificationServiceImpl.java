package com.medistock.service.impl;

import com.medistock.dto.NotificationDTO;
import com.medistock.dto.PageResponse;
import com.medistock.entity.Notification;
import com.medistock.enums.NotificationType;
import com.medistock.exception.ResourceNotFoundException;
import com.medistock.repository.NotificationRepository;
import com.medistock.service.NotificationService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationServiceImpl(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @Override
    @Transactional
    public NotificationDTO createNotification(String title, String message, NotificationType type) {
        Notification notification = Notification.builder()
                .title(title)
                .message(message)
                .notificationType(type)
                .status("UNREAD")
                .build();

        Notification saved = notificationRepository.save(notification);
        return mapToDTO(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<NotificationDTO> getAllNotifications(Pageable pageable) {
        Page<Notification> page = notificationRepository.findAllByOrderByCreatedAtDesc(pageable);
        return mapPageToResponse(page);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<NotificationDTO> getUnreadNotifications(Pageable pageable) {
        Page<Notification> page = notificationRepository.findByStatus("UNREAD", pageable);
        return mapPageToResponse(page);
    }

    @Override
    @Transactional
    public NotificationDTO markAsRead(Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification", "id", id));

        notification.setStatus("READ");
        Notification updated = notificationRepository.save(notification);
        return mapToDTO(updated);
    }

    @Override
    @Transactional
    public void markAllAsRead() {
        List<Notification> unreadList = notificationRepository.findAll().stream()
                .filter(n -> "UNREAD".equalsIgnoreCase(n.getStatus()))
                .toList();

        unreadList.forEach(n -> n.setStatus("READ"));
        notificationRepository.saveAll(unreadList);
    }

    @Override
    @Transactional(readOnly = true)
    public long getUnreadCount() {
        return notificationRepository.countByStatus("UNREAD");
    }

    private PageResponse<NotificationDTO> mapPageToResponse(Page<Notification> page) {
        List<NotificationDTO> dtos = page.getContent().stream()
                .map(this::mapToDTO)
                .toList();

        return PageResponse.<NotificationDTO>builder()
                .content(dtos)
                .pageNumber(page.getNumber())
                .pageSize(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .first(page.isFirst())
                .last(page.isLast())
                .build();
    }

    private NotificationDTO mapToDTO(Notification notification) {
        return NotificationDTO.builder()
                .id(notification.getId())
                .title(notification.getTitle())
                .message(notification.getMessage())
                .notificationType(notification.getNotificationType())
                .status(notification.getStatus())
                .createdAt(notification.getCreatedAt())
                .build();
    }
}
