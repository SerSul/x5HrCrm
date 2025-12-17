package ru.x5tech.hrautomatization.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.http.HttpStatusCode;

/**
 * Author: Дмитрий Николаенков (laplas7)
 * Creation date: 17.12.2025
 */
@Getter
@Setter
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {
    private boolean success;
    private String message;
    private T data;
    @JsonProperty("status_code")
    private int statusCode;

    public static <T> ApiResponse<T> success(T data, String message, int httpCode) {
        return new ApiResponse<>(true, message, data, httpCode);
    }

    public static <T> ApiResponse<T> error(String message, int httpCode) {
        return new ApiResponse<>(false, message, null, httpCode);
    }
}
