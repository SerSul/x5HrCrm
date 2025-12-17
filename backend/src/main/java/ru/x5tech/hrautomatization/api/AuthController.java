package ru.x5tech.hrautomatization.api;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.x5tech.hrautomatization.dto.ApiResponse;
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
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserInfo>> register(@RequestBody RegisterRequest registerRequest) {
        UserInfo userInfo = authService.register(registerRequest);
        ApiResponse<UserInfo> response = ApiResponse.success(
                userInfo,
                "Registration successful",
                HttpStatus.CREATED.value()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<UserInfo>> login(@RequestBody LoginRequest loginRequest,
                                                       HttpServletRequest request) {
        UserInfo userInfo = authService.login(loginRequest, request);
        ApiResponse<UserInfo> response = ApiResponse.success(
                userInfo,
                "Login successful",
                HttpStatus.OK.value()
        );
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(HttpServletRequest request) {
        authService.logout(request);
        ApiResponse<Void> response = ApiResponse.success(
                null,
                "Logout successful",
                HttpStatus.OK.value()
        );
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserInfo>> getCurrentUser() {
        UserInfo userInfo = authService.getCurrentUser();
        ApiResponse<UserInfo> response = ApiResponse.success(
                userInfo,
                "User retrieved successfully",
                HttpStatus.OK.value()
        );
        return ResponseEntity.ok(response);
    }
}
