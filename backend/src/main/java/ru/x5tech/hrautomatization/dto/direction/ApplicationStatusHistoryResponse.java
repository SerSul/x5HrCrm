package ru.x5tech.hrautomatization.dto.direction;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

@Schema(description = "История изменения статуса отклика")
public record ApplicationStatusHistoryResponse(
        @JsonProperty("id") Long id,

        @JsonProperty("status_id") Long statusId,
        @JsonProperty("status_title") String statusTitle,
        @JsonProperty("changed_by_user_id") Long changedByUserId,
        @JsonProperty("changed_at") LocalDateTime changedAt,
        @JsonProperty("comment") String comment
) {}
