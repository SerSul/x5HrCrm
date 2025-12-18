package ru.x5tech.hrautomatization.dto.testing;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

@Schema(description = "Запрос на старт теста по заявке")
public record TestStartRequest(

        @Schema(description = "ID заявки, по которой стартует тест", example = "10", requiredMode = Schema.RequiredMode.REQUIRED)
        @JsonProperty("application_id")
        @NotNull
        Long applicationId
) {}
