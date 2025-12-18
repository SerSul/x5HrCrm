package ru.x5tech.hrautomatization.dto.testing;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Вариант ответа (без признака правильности)")
public record TestQuestionOptionDto(
        @Schema(description = "ID варианта", example = "100")
        @JsonProperty("option_id")
        Long optionId,

        @Schema(description = "Текст варианта", example = "Spring Boot")
        @JsonProperty("text")
        String text
) {}
