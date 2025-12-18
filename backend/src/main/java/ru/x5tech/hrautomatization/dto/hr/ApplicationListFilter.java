package ru.x5tech.hrautomatization.dto.hr;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Schema.RequiredMode;

@Schema(description = "Фильтры списка откликов HR")
public record ApplicationListFilter(
        @Schema(description = "Поиск по ФИО", example = "Иванов")
        @JsonProperty("full_name")
        String fullName,

        @Schema(description = "Название направления", example = "Backend")
        @JsonProperty("direction_name")
        String directionName,

        @Schema(description = "Только активные отклики", example = "true")
        @JsonProperty("only_active")
        Boolean onlyActive,

        @Schema(description = "Сортировка: score_desc, score_asc, created_desc, created_asc")
        @JsonProperty("sort")
        String sort,

        @Schema(description = "Страница", example = "0", requiredMode = RequiredMode.REQUIRED)
        @JsonProperty("page")
        int page,

        @Schema(description = "Размер страницы", example = "20", requiredMode = RequiredMode.REQUIRED)
        @JsonProperty("size")
        int size
) {}
