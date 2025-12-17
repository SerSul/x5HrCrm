package ru.x5tech.hrautomatization.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import ru.x5tech.hrautomatization.entity.application.EmploymentType;

import java.time.LocalDateTime;

@Schema(description = "Направление")
public record DirectionResponse(
        @JsonProperty("id")
        Long id,

        @JsonProperty("title")
        String title,

        @JsonProperty("description")
        String description,

        @JsonProperty("employment_type")
        EmploymentType employmentType,

        @JsonProperty("salary_min")
        Integer salaryMin,

        @JsonProperty("salary_max")
        Integer salaryMax,

        @JsonProperty("active")
        boolean active,

        @JsonProperty("created_at")
        LocalDateTime createdAt,

        @JsonProperty("closed_at")
        LocalDateTime closedAt,

        @JsonProperty("test_id")
        Long testId
) {}
