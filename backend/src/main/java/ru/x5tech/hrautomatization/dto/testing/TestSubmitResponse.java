package ru.x5tech.hrautomatization.dto.testing;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import ru.x5tech.hrautomatization.entity.testing.TestAttemptStatus;
import java.time.LocalDateTime;

@Schema(description = "Результат сдачи теста")
public record TestSubmitResponse(
        @Schema(description = "ID попытки", example = "1")
        @JsonProperty("attempt_id")
        Long attemptId,

        @Schema(description = "Статус попытки", example = "COMPLETED")
        @JsonProperty("status")
        TestAttemptStatus status,

        @Schema(description = "Набранные баллы", example = "30")
        @JsonProperty("score")
        Integer score,

        @Schema(description = "Максимум баллов", example = "40")
        @JsonProperty("max_score")
        Integer maxScore,

        @Schema(description = "Время завершения")
        @JsonProperty("finished_at")
        LocalDateTime finishedAt
) {}
