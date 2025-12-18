package ru.x5tech.hrautomatization.dto.direction;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Статус направления")
public record DirectionStatusResponse(
        @Schema(description = "ID статуса", example = "1")
        @JsonProperty("id")
        Long id,

        @Schema(description = "Название статуса", example = "Новая заявка")
        @JsonProperty("title")
        String title,

        @Schema(description = "Описание статуса", example = "Заявка получена и ожидает рассмотрения")
        @JsonProperty("description")
        String description,

        @Schema(description = "Порядковый номер статуса в цепочке", example = "1")
        @JsonProperty("sequence_order")
        Integer sequenceOrder,

        @Schema(description = "Является ли статус обязательным", example = "true")
        @JsonProperty("is_mandatory")
        boolean mandatory
) {}
