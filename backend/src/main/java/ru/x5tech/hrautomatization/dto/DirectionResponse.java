package ru.x5tech.hrautomatization.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

@Schema(description = "Направление")
public record DirectionResponse(
        @JsonProperty("id")
        Long id,

        @JsonProperty("title")
        String title,

        @JsonProperty("description")
        String description,

        @JsonProperty("active")
        boolean active,

        @JsonProperty("created_at")
        LocalDateTime createdAt,

        @JsonProperty("closed_at")
        LocalDateTime closedAt
) {}
