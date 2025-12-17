package ru.x5tech.hrautomatization.dto.direction;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Статус направления")
public record DirectionStatusResponse(
        @JsonProperty("id") Long id,
        @JsonProperty("title") String title,
        @JsonProperty("description") String description,
        @JsonProperty("sequence_order") Integer sequenceOrder,
        @JsonProperty("is_mandatory") boolean mandatory
) {}
