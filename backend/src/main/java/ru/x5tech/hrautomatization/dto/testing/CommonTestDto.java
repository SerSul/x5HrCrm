package ru.x5tech.hrautomatization.dto.testing;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import ru.x5tech.hrautomatization.entity.testing.TestAttemptStatus;

@Schema(description = "Информация о попытке прохождения теста пользователем")
public record CommonTestDto(
        @Schema(description = "ID теста", example = "1")
        @JsonProperty("test_id")
        Long testId,

        @Schema(description = "ID попытки прохождения (null если не начинал)", example = "5")
        @JsonProperty("attempt_id")
        Long attemptId,

        @Schema(description = "Статус попытки", example = "IN_PROGRESS")
        @JsonProperty("status")
        TestAttemptStatus status,

        @Schema(description = "Набранные баллы", example = "85")
        @JsonProperty("score")
        Integer score
) {}
