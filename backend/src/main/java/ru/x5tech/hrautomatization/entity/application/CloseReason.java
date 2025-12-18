package ru.x5tech.hrautomatization.entity.application;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Причины закрытия заявки", enumAsRef = true)
public enum CloseReason {

    @Schema(description = "✅ Нанят")
    HIRED,

    @Schema(description = "❌ Отказ (решение компании)")
    REJECTED,

    @Schema(description = "🚶 Кандидат отказался")
    CANDIDATE_WITHDREW,

    @Schema(description = "👻 Нет ответа/пропал")
    NO_RESPONSE,

    @Schema(description = "📋 Дубликат отклика")
    DUPLICATE,

    @Schema(description = "🔒 Вакансия закрыта")
    POSITION_CLOSED,

    @Schema(description = "🧪 Тест провален (автокик)")
    TEST_FAILED
}
