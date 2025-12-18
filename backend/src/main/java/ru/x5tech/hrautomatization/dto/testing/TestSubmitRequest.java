package ru.x5tech.hrautomatization.dto.testing;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

@Schema(description = "Запрос на сдачу теста")
public record TestSubmitRequest(
        @Schema(description = "ID попытки", example = "1")
        @JsonProperty("attempt_id")
        @NotNull
        Long attemptId,

        @Schema(description = "Ответы на вопросы")
        @JsonProperty("answers")
        @NotEmpty
        List<TestAnswerDto> answers
) {}
