package ru.x5tech.hrautomatization.dto.technical;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@Schema(description = "Унифицированный ответ с информацией об ошибке")
public class ErrorResponse {

    @Schema(description = "HTTP статус код ошибки", example = "400")
    private int status;

    @Schema(description = "Текстовое описание типа ошибки", example = "Bad Request")
    private String error;

    @Schema(description = "Детальное сообщение об ошибке", example = "Email не может быть пустым")
    private String message;

    @Schema(description = "Путь к эндпоинту, где произошла ошибка", example = "/api/auth/login")
    private String path;

    @Schema(description = "Временная метка возникновения ошибки", example = "2025-12-16T21:31:00")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime timestamp;

    @Schema(
            description = "Список ошибок валидации (если применимо)",
            example = "[\"Email не может быть пустым\", \"Пароль должен содержать минимум 6 символов\"]"
    )
    @JsonProperty("validation_errors")
    private List<String> validationErrors;
}
