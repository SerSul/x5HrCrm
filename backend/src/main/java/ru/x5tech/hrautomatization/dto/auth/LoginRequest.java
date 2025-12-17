package ru.x5tech.hrautomatization.dto.auth;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * Author: Дмитрий Николаенков (laplas7)
 * Creation date: 17.12.2025 19:11
 */
@Schema(description = "Запрос на вход в систему")
public record LoginRequest(
        @Schema(description = "Email пользователя", example = "user@example.com", requiredMode = Schema.RequiredMode.REQUIRED)
        String email,

        @Schema(description = "Пароль пользователя", example = "password123", requiredMode = Schema.RequiredMode.REQUIRED)
        String password
) {}
