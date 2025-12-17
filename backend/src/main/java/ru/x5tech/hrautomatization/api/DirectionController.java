package ru.x5tech.hrautomatization.api;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
@Tag(name = "Protected Directions", description = "🔒 Защищённые ручки (требуется авторизация)")
public class DirectionController {

    @Operation(summary = "🔒 Подать заявку на направление, пока только ручка без логики")
    @PostMapping("/apply/{directionId}")
    public ResponseEntity<String> applyToDirection(@PathVariable Long directionId) {
        return ResponseEntity.ok("Заявка создана");
    }
}
