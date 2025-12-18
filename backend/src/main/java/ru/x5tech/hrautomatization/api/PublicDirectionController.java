package ru.x5tech.hrautomatization.api;


import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.x5tech.hrautomatization.dto.direction.ApplyInfoResponse;
import ru.x5tech.hrautomatization.dto.direction.DirectionResponse;
import ru.x5tech.hrautomatization.service.DirectionService;

import java.util.List;

/**
 * <br>
 * <strong>
 * Author: Дмитрий Николаенков (laplas7)
 * Creation date: 18.12.2025 00:51
 * </strong>
 */
@RestController
@RequestMapping("/public/directions")
@RequiredArgsConstructor
@Tag(name = "Public Directions", description = "🔓 Публичные ручки (без авторизации)")
public class PublicDirectionController {

    private final DirectionService directionService;

    @Operation(summary = "🔓 Список всех направлений")
    @ApiResponse(responseCode = "200", description = "Список направлений")
    @GetMapping
    public ResponseEntity<List<DirectionResponse>> getDirections(
            @Parameter(description = "Только направления, куда подался пользователь (нужна авторизация)")
            @RequestParam(name = "only_applied", defaultValue = "false") boolean onlyApplied) {
        return ResponseEntity.ok(directionService.getDirections(onlyApplied));
    }

}
