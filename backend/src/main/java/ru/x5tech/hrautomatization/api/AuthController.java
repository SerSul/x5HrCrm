package ru.x5tech.hrautomatization.api;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.x5tech.hrautomatization.dto.auth.LoginRequest;
import ru.x5tech.hrautomatization.dto.auth.RegisterRequest;
import ru.x5tech.hrautomatization.dto.auth.UserInfo;
import ru.x5tech.hrautomatization.service.AuthService;

/**
 * Author: Дмитрий Николаенков (laplas7)
 * Creation date: 17.12.2025
 */
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "API для аутентификации и управления пользователями")
public class AuthController {

    private final AuthService authService;

    @Operation(
            summary = "Регистрация нового пользователя",
            description = "Создает нового пользователя в системе с указанными данными. Email должен быть уникальным."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "201",
                    description = "Пользователь успешно зарегистрирован",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = UserInfo.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Некорректные данные запроса",
                    content = @Content(mediaType = "application/json")
            ),
            @ApiResponse(
                    responseCode = "409",
                    description = "Пользователь с таким email уже существует",
                    content = @Content(mediaType = "application/json")
            ),
            @ApiResponse(
                    responseCode = "500",
                    description = "Внутренняя ошибка сервера",
                    content = @Content(mediaType = "application/json")
            )
    })
    @PostMapping("/register")
    public ResponseEntity<UserInfo> register(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Данные для регистрации нового пользователя",
                    required = true,
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = RegisterRequest.class)
                    )
            )
            @RequestBody RegisterRequest registerRequest) {

        UserInfo userInfo = authService.register(registerRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(userInfo);
    }

    @Operation(
            summary = "Вход в систему",
            description = "Аутентифицирует пользователя по email и паролю. Создает сессию с бесконечным временем жизни."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Успешный вход в систему",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = UserInfo.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Неверные учетные данные",
                    content = @Content(mediaType = "application/json")
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Некорректные данные запроса",
                    content = @Content(mediaType = "application/json")
            ),
            @ApiResponse(
                    responseCode = "500",
                    description = "Внутренняя ошибка сервера",
                    content = @Content(mediaType = "application/json")
            )
    })
    @PostMapping("/login")
    public ResponseEntity<UserInfo> login(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Учетные данные пользователя для входа",
                    required = true,
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = LoginRequest.class)
                    )
            )
            @RequestBody LoginRequest loginRequest,
            @Parameter(hidden = true) HttpServletRequest request) {

        UserInfo userInfo = authService.login(loginRequest, request);
        return ResponseEntity.ok(userInfo);
    }

    @Operation(
            summary = "Выход из системы",
            description = "Завершает текущую сессию пользователя и очищает контекст безопасности."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Успешный выход из системы",
                    content = @Content(mediaType = "application/json")
            ),
            @ApiResponse(
                    responseCode = "500",
                    description = "Внутренняя ошибка сервера",
                    content = @Content(mediaType = "application/json")
            )
    })
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(
            @Parameter(hidden = true) HttpServletRequest request) {

        authService.logout(request);
        return ResponseEntity.ok().build();
    }

    @Operation(
            summary = "Получить информацию о текущем пользователе",
            description = "Возвращает информацию об аутентифицированном пользователе из текущей сессии."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Информация о пользователе успешно получена",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = UserInfo.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Пользователь не аутентифицирован",
                    content = @Content(mediaType = "application/json")
            ),
            @ApiResponse(
                    responseCode = "500",
                    description = "Внутренняя ошибка сервера",
                    content = @Content(mediaType = "application/json")
            )
    })
    @GetMapping("/me")
    public ResponseEntity<UserInfo> getCurrentUser() {
        UserInfo userInfo = authService.getCurrentUser();
        return ResponseEntity.ok(userInfo);
    }
}
