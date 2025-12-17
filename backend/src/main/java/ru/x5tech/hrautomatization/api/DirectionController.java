package ru.x5tech.hrautomatization.api;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.x5tech.hrautomatization.dto.DirectionResponse;
import ru.x5tech.hrautomatization.service.DirectionService;

import java.util.List;

/**
 * <br>
 * <strong>
 * Author: Дмитрий Николаенков (laplas7)
 * Creation date: 17.12.2025 20:51
 * </strong>
 */
@RestController
@RequestMapping("/directions")
@RequiredArgsConstructor
@Tag(name = "Directions", description = "Работа с направлениями")
public class DirectionController {

    private final DirectionService directionService;

    @Operation(
            summary = "Список направлений",
            description = """
                    Возвращает список всех направлений.
                    Если передан параметр userId, возвращает только направления,
                    куда этот пользователь уже подался.
                    """
    )
    @ApiResponse(
            responseCode = "200",
            description = "Список направлений",
            content = @Content(
                    mediaType = "application/json",
                    array = @ArraySchema(schema = @Schema(implementation = DirectionResponse.class))
            )
    )

    @GetMapping
    public ResponseEntity<List<DirectionResponse>> getDirections(
            @Parameter(description = "Фильтровать только направления, куда подался текущий пользователь",
                    required = false)
            @RequestParam(name = "onlyApplied", required = false, defaultValue = "false")
            boolean onlyApplied
    ) {
        return ResponseEntity.ok(directionService.getDirections(onlyApplied));
    }

}
