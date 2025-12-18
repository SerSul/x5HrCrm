// TestSubmitRequest.java
package ru.x5tech.hrautomatization.dto.testing;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record TestSubmitRequest(
        @NotNull(message = "ID попытки обязателен")
        Long attemptId,

        @NotEmpty(message = "Список ответов не может быть пустым")
        List<TestAnswerDto> answers
) {}
