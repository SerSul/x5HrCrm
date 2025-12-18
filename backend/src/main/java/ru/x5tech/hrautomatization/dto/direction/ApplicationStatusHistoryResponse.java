package ru.x5tech.hrautomatization.dto.direction;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;

@Schema(description = "Запись из истории изменения статуса отклика")
public record ApplicationStatusHistoryResponse(
        @Schema(description = "ID записи истории", example = "1")
        @JsonProperty("id")
        Long id,

        @Schema(description = "ID статуса", example = "2")
        @JsonProperty("status_id")
        Long statusId,

        @Schema(description = "Название статуса", example = "Собеседование")
        @JsonProperty("status_title")
        String statusTitle,

        @Schema(description = "ID пользователя, изменившего статус", example = "5")
        @JsonProperty("changed_by_user_id")
        Long changedByUserId,

        @Schema(description = "Дата и время изменения статуса", example = "2025-12-18T15:30:00")
        @JsonProperty("changed_at")
        LocalDateTime changedAt,

        @Schema(description = "Комментарий к смене статуса", example = "Кандидат прошел первый этап")
        @JsonProperty("comment")
        String comment
) {}
