package ru.x5tech.hrautomatization.dto.direction;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

@Schema(description = "Информация о направлении")
public record DirectionInfoResponse(
        @JsonProperty("direction_id") Long directionId,
        @JsonProperty("statuses") List<DirectionStatusResponse> statuses,

        @JsonProperty("current_status") DirectionStatusResponse currentStatus,
        @JsonProperty("status_history") List<ApplicationStatusHistoryResponse> statusHistory
) {}
