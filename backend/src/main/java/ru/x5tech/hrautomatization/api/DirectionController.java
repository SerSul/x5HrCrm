package ru.x5tech.hrautomatization.api;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import ru.x5tech.hrautomatization.dto.direction.ApplyRequest;
import ru.x5tech.hrautomatization.service.ApplicationService;

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

    private final ApplicationService applicationService;

    @Operation(summary = "🔒 Подать заявку на направление с резюме")
    @PostMapping(value = "/apply/{directionId}")
    public ResponseEntity<String> applyToDirection(
            @Parameter(description = "ID направления", required = true)
            @PathVariable Long directionId,

            @Valid @RequestBody ApplyRequest request,

            @AuthenticationPrincipal UserDetails userDetails) {

        applicationService.createApplication(
                directionId,
                userDetails,
                request
        );

        return ResponseEntity.ok("Заявка успешно создана");
    }

    @Operation(summary = "🔒 Отозвать заявку на направление")
    @DeleteMapping("/apply/{directionId}")
    public ResponseEntity<String> withdrawApplication(
            @Parameter(description = "ID направления", required = true)
            @PathVariable Long directionId,

            @AuthenticationPrincipal UserDetails userDetails) {

        applicationService.withdrawApplication(directionId, userDetails);

        return ResponseEntity.ok("Заявка успешно отозвана");
    }
}
