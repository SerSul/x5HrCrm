package ru.x5tech.hrautomatization.dto.direction;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

/**
 * Author: Дмитрий Николаенков (laplas7)
 * Creation date: 18.12.2025
 *
 * DTO для создания отклика на направление
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Запрос на подачу заявки на направление")
public class ApplyRequest {

    @Schema(description = "Ссылка на резюме",
            example = "resume.pdf",
            requiredMode = Schema.RequiredMode.REQUIRED)
    @NotNull(message = "Ссылка на резюме обязателен")
    @JsonProperty("resume_path")
    private String resumePath;

    @Schema(description = "Дополнительный комментарий к заявке",
            example = "Я заинтересован в этой позиции...")
    @Size(max = 2000, message = "Комментарий не должен превышать 2000 символов")
    private String comment;
}
