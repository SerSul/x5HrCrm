package ru.x5tech.hrautomatization.dto.auth;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * Author: Дмитрий Николаенков (laplas7)
 * Creation date: 17.12.2025 19:16
 */
@Schema(description = "Запрос на регистрацию нового пользователя")
public record RegisterRequest(
        @Schema(description = "Email пользователя", example = "newuser@example.com", requiredMode = Schema.RequiredMode.REQUIRED)
        String email,

        @Schema(description = "Пароль пользователя", example = "securePassword123", requiredMode = Schema.RequiredMode.REQUIRED)
        String password,

        @Schema(description = "Номер телефона", example = "+79991234567")
        String phone,

        @Schema(description = "Имя", example = "Иван", requiredMode = Schema.RequiredMode.REQUIRED)
        String firstName,

        @Schema(description = "Фамилия", example = "Иванов", requiredMode = Schema.RequiredMode.REQUIRED)
        String lastName,

        @Schema(description = "Отчество", example = "Иванович")
        String middleName
) {}
