package ru.x5tech.hrautomatization.api;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.x5tech.hrautomatization.dto.testing.TestStartRequest;
import ru.x5tech.hrautomatization.dto.testing.TestStartResponse;
import ru.x5tech.hrautomatization.service.TestService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/test")
@Tag(name = "Test", description = "Прохождение теста кандидатом")
public class TestController {

    private final TestService testService;

    @Operation(summary = "Старт теста по заявке (возвращает вопросы)")
    @PostMapping("/start")
    public ResponseEntity<TestStartResponse> start(@Valid @RequestBody TestStartRequest request) {
        return ResponseEntity.ok(testService.start(request));
    }
}
