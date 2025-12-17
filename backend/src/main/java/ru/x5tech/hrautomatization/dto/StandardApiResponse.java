package ru.x5tech.hrautomatization.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Стандартный ответ API")
public class StandardApiResponse<T> {

    @Schema(description = "Статус успешности операции", example = "true")
    private boolean success;

    @Schema(description = "Данные ответа")
    private T data;

    @Schema(description = "Сообщение о результате операции", example = "Operation completed successfully")
    private String message;

    @Schema(description = "Контекст сообщения с результаточ ошибки", example = "Operation completed successfully")
    private String context;

    @Schema(description = "HTTP код статуса", example = "200")
    private int statusCode;

    @Schema(description = "Временная метка ответа", example = "2025-12-17T20:05:00Z")
    private String timestamp;

    public static <T> StandardApiResponse<T> success(T data, String message, int statusCode) {
        StandardApiResponse<T> response = new StandardApiResponse<>();
        response.setSuccess(true);
        response.setData(data);
        response.setMessage(message);
        response.setStatusCode(statusCode);
        response.setTimestamp(java.time.Instant.now().toString());
        return response;
    }

    public static <T> StandardApiResponse<T> error(String message, int statusCode) {
        StandardApiResponse<T> response = new StandardApiResponse<>();
        response.setSuccess(false);
        response.setMessage(message);
        response.setStatusCode(statusCode);
        response.setTimestamp(java.time.Instant.now().toString());
        return response;
    }

        public static <T> StandardApiResponse<T> error(String message, int statusCode, String context) {
        StandardApiResponse<T> response = new StandardApiResponse<>();
        response.setSuccess(false);
        response.setMessage(message);
        response.setStatusCode(statusCode);
        response.setContext(context);
        response.setTimestamp(java.time.Instant.now().toString());
        return response;
    }


}
