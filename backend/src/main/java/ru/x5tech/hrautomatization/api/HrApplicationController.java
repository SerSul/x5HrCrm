package ru.x5tech.hrautomatization.api;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.x5tech.hrautomatization.dto.hr.MoveApplicationStatusRequest;
import ru.x5tech.hrautomatization.dto.hr.RejectApplicationRequest;
import ru.x5tech.hrautomatization.service.HrApplicationService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/hr/applications")
@Tag(name = "HR Applications", description = "🧑‍💼 Управление статусами заявок")
public class HrApplicationController {

    private final HrApplicationService hrApplicationService;

    @Operation(summary = "Сменить статус заявки.")
    @PostMapping("/status")
    public ResponseEntity<Void> moveToStatus(@Valid @RequestBody MoveApplicationStatusRequest request) {
        hrApplicationService.moveToStatus(request);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "❌ Отказ кандидату (закрыть заявку)")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Кандидат отклонен"),
            @ApiResponse(responseCode = "404", description = "Заявка не найдена"),
            @ApiResponse(responseCode = "409", description = "Заявка уже закрыта")
    })
    @PostMapping("/reject")
    public ResponseEntity<String> rejectCandidate(
            @Valid @RequestBody RejectApplicationRequest request
    ) {
        hrApplicationService.rejectApplication(request);
        return ResponseEntity.ok("Кандидат отклонен");
    }

}
