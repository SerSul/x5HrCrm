package ru.x5tech.hrautomatization.dto.testing;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

@Schema(description = "Запрос на старт теста по заявке")
public record TestStartRequest(
        @Schema(description = "ID заявки", example = "10")
        @JsonProperty("application_id")
        @NotNull
        Long applicationId
) {}
