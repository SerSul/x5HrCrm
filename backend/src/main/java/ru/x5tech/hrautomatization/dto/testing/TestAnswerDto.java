// TestAnswerDto.java
package ru.x5tech.hrautomatization.dto.testing;

import jakarta.validation.constraints.NotNull;

public record TestAnswerDto(
        @NotNull(message = "ID вопроса обязателен")
        Long questionId,

        @NotNull(message = "ID выбранного варианта ответа обязателен")
        Long selectedOptionId
) {}
