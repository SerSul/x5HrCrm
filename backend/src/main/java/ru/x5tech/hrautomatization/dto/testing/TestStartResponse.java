package ru.x5tech.hrautomatization.dto.testing;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;

@Schema(description = "Ответ при старте теста")
public record TestStartResponse(
        @Schema(description = "ID попытки", example = "1")
        @JsonProperty("attempt_id")
        Long attemptId,

        @Schema(description = "ID теста", example = "1")
        @JsonProperty("test_id")
        Long testId,

        @Schema(description = "Вопросы теста")
        @JsonProperty("questions")
        List<TestQuestionDto> questions
) {}
