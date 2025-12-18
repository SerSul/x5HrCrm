package ru.x5tech.hrautomatization.api;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.x5tech.hrautomatization.dto.hr.MoveApplicationStatusRequest;
import ru.x5tech.hrautomatization.service.HrApplicationService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/hr/applications")
@Tag(name = "HR Applications", description = "🧑‍💼 Управление статусами заявок")
public class HrApplicationController {

    private final HrApplicationService hrApplicationService;

    @Operation(summary = "🧑‍💼 Сменить статус заявки (всё в JSON body, snake_case). Успех: 204 No Content")
    @PostMapping("/status")
    public ResponseEntity<Void> moveToStatus(@Valid @RequestBody MoveApplicationStatusRequest request) {
        hrApplicationService.moveToStatus(request);
        return ResponseEntity.noContent().build();
    }
}
