package ru.x5tech.hrautomatization.dto.direction;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import ru.x5tech.hrautomatization.dto.testing.CommonTestDto;
import ru.x5tech.hrautomatization.entity.application.CloseReason;

import java.util.List;

@Schema(description = "Информация об отклике пользователя на направление")
public record ApplyInfoResponse(

        @Schema(description = "ID направления", example = "1")
        @JsonProperty("direction_id")
        Long directionId,

        @Schema(description = "Текущий статус заявки пользователя (null если не подавал)")
        @JsonProperty("current_status")
        DirectionStatusResponse currentStatus,

        @Schema(description = "История изменения статусов заявки (null если не подавал)")
        @JsonProperty("status_history")
        List<ApplicationStatusHistoryResponse> statusHistory,

        @Schema(description = "Информация о тесте для направления (null если теста нет)")
        @JsonProperty("test")
        CommonTestDto test,

        @Schema(
                description = "Причина закрытия заявки. null = заявка активна",
                allowableValues = {
                        "HIRED",
                        "REJECTED",
                        "CANDIDATE_WITHDREW",
                        "NO_RESPONSE",
                        "DUPLICATE",
                        "POSITION_CLOSED",
                        "TEST_FAILED"
                },
                example = "null"
        )
        @JsonProperty("close_reason")
        CloseReason closeReason
) {}
