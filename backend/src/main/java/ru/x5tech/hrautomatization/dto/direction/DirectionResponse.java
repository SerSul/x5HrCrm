package ru.x5tech.hrautomatization.dto.direction;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import ru.x5tech.hrautomatization.entity.application.EmploymentType;

import java.time.LocalDateTime;

@Schema(description = "Направление (вакансия)")
public record DirectionResponse(
        @Schema(description = "ID направления", example = "1")
        @JsonProperty("id")
        Long id,

        @Schema(description = "Название направления", example = "Backend Java Developer")
        @JsonProperty("title")
        String title,

        @Schema(description = "Описание направления", example = "Разработка серверной части приложения")
        @JsonProperty("description")
        String description,

        @Schema(description = "Тип занятости", example = "FULL_TIME")
        @JsonProperty("employment_type")
        EmploymentType employmentType,

        @Schema(description = "Минимальная зарплата", example = "100000")
        @JsonProperty("salary_min")
        Integer salaryMin,

        @Schema(description = "Максимальная зарплата", example = "200000")
        @JsonProperty("salary_max")
        Integer salaryMax,

        @Schema(description = "Активно ли направление", example = "true")
        @JsonProperty("active")
        boolean active,

        @Schema(description = "Дата создания направления", example = "2025-12-18T10:00:00")
        @JsonProperty("created_at")
        LocalDateTime createdAt,

        @Schema(description = "Дата закрытия направления", example = "2025-12-31T23:59:59")
        @JsonProperty("closed_at")
        LocalDateTime closedAt,

        @Schema(description = "ID теста для направления", example = "1")
        @JsonProperty("test_id")
        Long testId,

        @Schema(description = "Подал ли текущий пользователь заявку", example = "true")
        @JsonProperty("applied")
        boolean applied
) {}
