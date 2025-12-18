package ru.x5tech.hrautomatization.api;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.x5tech.hrautomatization.dto.direction.ApplyInfoResponse;
import ru.x5tech.hrautomatization.service.DirectionService;

@RestController
@RequestMapping("/public/apply-info")
@RequiredArgsConstructor
@Tag(name = "Public Apply Info", description = "🔓 Информация по отклику (apply) на направление")
public class PublicApplyInfoController {

    private final DirectionService directionService;

    @Operation(summary = "🔓 Информация по отклику на направление (текущий статус, история, тест)")
    @ApiResponse(responseCode = "200", description = "Информация по отклику")
    @GetMapping("/directions/{directionId}")
    public ResponseEntity<ApplyInfoResponse> getApplyInfo(
            @PathVariable Long directionId,
            @Parameter(description = "Явный userId (только для HR/ADMIN)")
            @RequestParam(name = "user_id", required = false) Long userId
    ) {
        return ResponseEntity.ok(directionService.getApplyInfoRoleAware(directionId, userId));
    }
}
