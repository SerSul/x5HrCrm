package ru.x5tech.hrautomatization.dto.hr;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Фильтры откликов HR")
public record ApplicationFilterDto(

        @Schema(description = "Название направления", example = "Backend")
        @JsonProperty("direction_name")
        String directionName,

        @Schema(description = "Только активные отклики", example = "true")
        @JsonProperty(value = "active", defaultValue = "true")
        Boolean active,

        @Schema(description = "Сортировка по баллам: desc|asc", example = "desc")
        @JsonProperty("sort_by_score")
        String sortByScore,

        @Schema(description = "Страница", example = "1", minimum = "1")
        @JsonProperty(value = "page", defaultValue = "1")
        int page,

        @Schema(description = "Размер страницы", example = "20")
        @JsonProperty(value = "size", defaultValue = "15")
        int size
) {}
