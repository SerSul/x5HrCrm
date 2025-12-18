package ru.x5tech.hrautomatization.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.x5tech.hrautomatization.dto.testing.*;
import ru.x5tech.hrautomatization.entity.application.Application;
import ru.x5tech.hrautomatization.entity.testing.Test;
import ru.x5tech.hrautomatization.entity.testing.TestAttempt;
import ru.x5tech.hrautomatization.entity.testing.TestAttemptStatus;
import ru.x5tech.hrautomatization.exception.ConflictException;
import ru.x5tech.hrautomatization.exception.NotFoundException;
import ru.x5tech.hrautomatization.repository.ApplicationRepository;
import ru.x5tech.hrautomatization.repository.TestAttemptRepository;
import ru.x5tech.hrautomatization.security.UserContext;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TestService {

    private final ApplicationRepository applicationRepository;
    private final TestAttemptRepository testAttemptRepository;
    private final UserContext userContext;

    @Transactional
    public TestStartResponse start(TestStartRequest req) {
        Long currentUserId = userContext.requireUserId();

        Application app = applicationRepository.findById(req.applicationId())
                .orElseThrow(() -> new NotFoundException("Заявка не найдена"));

        if (!app.isActive()) {
            throw new ConflictException("Заявка закрыта, тест запускать нельзя");
        }

        if (!app.getUser().getId().equals(currentUserId)) {
            throw new ConflictException("Нельзя запускать тест по чужой заявке");
        }

        Test test = Optional.ofNullable(app.getDirection().getTest())
                .orElseThrow(() -> new NotFoundException("Для направления не задан тест"));

        TestAttempt attempt = TestAttempt.builder()
                .user(app.getUser())
                .test(test)
                .status(TestAttemptStatus.IN_PROGRESS)
                .startedAt(LocalDateTime.now())
                .build();

        attempt = testAttemptRepository.save(attempt);

        List<TestQuestionDto> questions = test.getQuestions().stream()
                .sorted(Comparator.comparing(q -> q.getOrderIndex() == null ? Integer.MAX_VALUE : q.getOrderIndex()))
                .map(q -> new TestQuestionDto(
                        q.getId(),
                        q.getText(),
                        q.getTestDifficulty(),
                        q.getOrderIndex(),
                        q.getOptions().stream()
                                .map(o -> new TestQuestionOptionDto(o.getId(), o.getText()))
                                .toList()
                ))
                .toList();

        return new TestStartResponse(attempt.getId(), test.getId(), questions);
    }
}
