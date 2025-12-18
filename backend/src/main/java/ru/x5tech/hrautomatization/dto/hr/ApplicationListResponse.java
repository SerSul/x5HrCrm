package ru.x5tech.hrautomatization.dto.hr;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;

@Schema(description = "Список откликов HR с пагинацией")
public record ApplicationListResponse(

        @Schema(description = "Список откликов", example = "[]")
        @JsonProperty("items")
        List<ApplicationHrItem> items,

        @Schema(description = "Общее количество откликов", example = "127")
        @JsonProperty("total")
        long total,

        @Schema(description = "Номер текущей страницы (0-based)", example = "0")
        @JsonProperty("page")
        int page,

        @Schema(description = "Количество элементов на странице", example = "20")
        @JsonProperty("size")
        int size,

        @Schema(description = "Общее количество страниц", example = "7")
        @JsonProperty("total_pages")
        int totalPages
) {}
