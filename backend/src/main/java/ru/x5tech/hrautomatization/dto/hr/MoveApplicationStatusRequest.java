package ru.x5tech.hrautomatization.dto.hr;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

@Schema(description = "Запрос HR на смену статуса заявки")
public record MoveApplicationStatusRequest(

        @Schema(
                description = "ID направления (вакансии), по которому создана заявка",
                example = "1",
                requiredMode = Schema.RequiredMode.REQUIRED
        )
        @JsonProperty("direction_id")
        @NotNull
        Long directionId,

        @Schema(
                description = "ID пользователя-кандидата, чья заявка переводится в другой статус",
                example = "42",
                requiredMode = Schema.RequiredMode.REQUIRED
        )
        @JsonProperty("user_id")
        @NotNull
        Long userId,

        @Schema(
                description = "Порядковый номер статуса (sequence_order) в рамках выбранного направления; вычисляется фронтендом по списку statuses",
                example = "3",
                requiredMode = Schema.RequiredMode.REQUIRED
        )
        @JsonProperty("sequence_order")
        @NotNull
        Integer sequenceOrder,

        @Schema(
                description = "Комментарий HR к изменению статуса (попадёт в историю статусов)",
                example = "Назначили интервью"
        )
        @JsonProperty("comment")
        String comment
) {}
