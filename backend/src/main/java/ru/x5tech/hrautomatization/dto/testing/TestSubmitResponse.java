// TestSubmitResponse.java
package ru.x5tech.hrautomatization.dto.testing;

import ru.x5tech.hrautomatization.entity.testing.TestAttemptStatus;
import java.time.LocalDateTime;

public record TestSubmitResponse(
        Long attemptId,
        TestAttemptStatus status,
        Integer score,
        Integer totalQuestions,
        LocalDateTime finishedAt
) {}
