package ru.x5tech.hrautomatization.dto.testing;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

@Schema(description = "Ответ кандидата на вопрос")
public record TestAnswerDto(
        @Schema(description = "ID вопроса", example = "1")
        @JsonProperty("question_id")
        @NotNull
        Long questionId,

        @Schema(description = "ID выбранного варианта", example = "4")
        @JsonProperty("selected_option_id")
        @NotNull
        Long selectedOptionId
) {}
