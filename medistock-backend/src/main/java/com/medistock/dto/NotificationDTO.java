package com.medistock.dto;

import com.medistock.enums.NotificationType;
import java.time.LocalDateTime;

public class NotificationDTO {
    private Long id;
    private String title;
    private String message;
    private NotificationType notificationType;
    private String status;
    private LocalDateTime createdAt;

    public NotificationDTO() {}

    public NotificationDTO(Long id, String title, String message, NotificationType notificationType, String status, LocalDateTime createdAt) {
        this.id = id;
        this.title = title;
        this.message = message;
        this.notificationType = notificationType;
        this.status = status;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public NotificationType getNotificationType() { return notificationType; }
    public void setNotificationType(NotificationType notificationType) { this.notificationType = notificationType; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static NotificationDTOBuilder builder() { return new NotificationDTOBuilder(); }

    public static class NotificationDTOBuilder {
        private Long id;
        private String title;
        private String message;
        private NotificationType notificationType;
        private String status;
        private LocalDateTime createdAt;

        public NotificationDTOBuilder id(Long id) { this.id = id; return this; }
        public NotificationDTOBuilder title(String title) { this.title = title; return this; }
        public NotificationDTOBuilder message(String message) { this.message = message; return this; }
        public NotificationDTOBuilder notificationType(NotificationType notificationType) { this.notificationType = notificationType; return this; }
        public NotificationDTOBuilder status(String status) { this.status = status; return this; }
        public NotificationDTOBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public NotificationDTO build() {
            return new NotificationDTO(id, title, message, notificationType, status, createdAt);
        }
    }
}
