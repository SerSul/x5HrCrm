package ru.x5tech.hrautomatization.dto.direction;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import ru.x5tech.hrautomatization.dto.testing.CommonTestDto;

import java.util.List;

@Schema(description = "Подробная информация о направлении с историей статусов")
public record DirectionInfoResponse(
        @Schema(description = "ID направления", example = "1")
        @JsonProperty("direction_id")
        Long directionId,

        @Schema(description = "Список доступных статусов для направления")
        @JsonProperty("statuses")
        List<DirectionStatusResponse> statuses,

        @Schema(description = "Текущий статус заявки пользователя (null если не подавал)")
        @JsonProperty("current_status")
        DirectionStatusResponse currentStatus,

        @Schema(description = "История изменения статусов заявки (null если не подавал)")
        @JsonProperty("status_history")
        List<ApplicationStatusHistoryResponse> statusHistory,

        @Schema(description = "Информация о тесте для направления (null если теста нет)")
        @JsonProperty("test")
        CommonTestDto test
) {}
