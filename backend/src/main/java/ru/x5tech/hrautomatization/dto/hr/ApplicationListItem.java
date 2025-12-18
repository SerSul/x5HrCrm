package ru.x5tech.hrautomatization.dto.hr;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;

@Schema(description = "Отклик в списке HR")
public record ApplicationListItem(
        @Schema(description = "ID отклика") @JsonProperty("id") Long id,

        @Schema(description = "ФИО") @JsonProperty("full_name") String fullName,

        @Schema(description = "Направление") @JsonProperty("direction_name") String directionName,

        @Schema(description = "Статус") @JsonProperty("status") String status,

        @Schema(description = "Баллы теста") @JsonProperty("test_score") String testScore,

        @Schema(description = "Активен") @JsonProperty("is_active") Boolean isActive,

        @Schema(description = "Дата подачи") @JsonProperty("created_at") LocalDateTime createdAt,

        @Schema(description = "Резюме") @JsonProperty("resume_path") String resumePath
) {}
