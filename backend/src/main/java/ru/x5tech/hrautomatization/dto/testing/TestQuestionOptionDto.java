package ru.x5tech.hrautomatization.dto.testing;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Вариант ответа")
public record TestQuestionOptionDto(
        @Schema(description = "ID варианта", example = "4")
        @JsonProperty("option_id")
        Long optionId,

        @Schema(description = "Текст варианта")
        @JsonProperty("text")
        String text
) {}
