package ru.x5tech.hrautomatization.dto.auth;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * Author: Дмитрий Николаенков (laplas7)
 * Creation date: 17.12.2025 19:21
 */
@Schema(description = "Информация о пользователе")
public record UserInfo(
        @Schema(description = "Имя пользователя (email)", example = "user@example.com")
        String username,

        @Schema(description = "Права доступа и роли пользователя", example = "[{\"authority\": \"ROLE_USER\"}]")
        Object authorities
) {}
