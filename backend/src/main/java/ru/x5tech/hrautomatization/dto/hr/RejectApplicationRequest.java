package ru.x5tech.hrautomatization.dto.hr;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import ru.x5tech.hrautomatization.entity.application.CloseReason;

@Schema(description = "Запрос на отказ кандидату")
public record RejectApplicationRequest(
        @Schema(description = "ID заявки", example = "15", required = true)
        @JsonProperty("application_id")
        Long applicationId,

        @Schema(
                description = "Причина отказа",
                example = "REJECTED",
                allowableValues = {"REJECTED", "NO_RESPONSE", "DUPLICATE"}
        )
        @JsonProperty("close_reason")
        CloseReason closeReason,

        @Schema(description = "Комментарий HR (опционально)", example = "Не подошел по опыту")
        @JsonProperty("comment")
        String comment
) {}
