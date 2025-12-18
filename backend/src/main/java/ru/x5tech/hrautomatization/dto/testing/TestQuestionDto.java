package ru.x5tech.hrautomatization.dto.testing;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

@Schema(description = "Вопрос теста")
public record TestQuestionDto(
        @Schema(description = "ID вопроса", example = "50")
        @JsonProperty("question_id")
        Long questionId,

        @Schema(description = "Текст вопроса")
        @JsonProperty("text")
        String text,

        @Schema(description = "Сложность (как в БД)", example = "1")
        @JsonProperty("difficulty")
        int difficulty,

        @Schema(description = "Порядок вопроса", example = "1")
        @JsonProperty("order_index")
        Integer orderIndex,

        @Schema(description = "Варианты ответа")
        @JsonProperty("options")
        List<TestQuestionOptionDto> options
) {}
