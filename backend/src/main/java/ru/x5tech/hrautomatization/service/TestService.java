package ru.x5tech.hrautomatization.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.x5tech.hrautomatization.dto.testing.*;
import ru.x5tech.hrautomatization.entity.application.Application;
import ru.x5tech.hrautomatization.entity.testing.*;
import ru.x5tech.hrautomatization.exception.ConflictException;
import ru.x5tech.hrautomatization.exception.NotFoundException;
import ru.x5tech.hrautomatization.repository.ApplicationRepository;
import ru.x5tech.hrautomatization.repository.TestAttemptRepository;
import ru.x5tech.hrautomatization.security.UserContext;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TestService {

    private final ApplicationRepository applicationRepository;
    private final TestAttemptRepository testAttemptRepository;
    private final UserContext userContext;
    private final ApplicationService applicationService;

    @Transactional
    public TestStartResponse start(TestStartRequest req) {
        Long currentUserId = userContext.requireUserId();

        Application app = applicationRepository.findById(req.applicationId())
                .orElseThrow(() -> new NotFoundException("Заявка не найдена"));

        if (!app.isActive()) {
            throw new ConflictException("Заявка закрыта, тест запускать нельзя");
        }

        if (app.getTestAttempt() != null) {
            throw new ConflictException("Тест уже запущен для этой заявки");
        }

        if (!app.getUser().getId().equals(currentUserId)) {
            throw new ConflictException("Нельзя запускать тест по чужой заявке");
        }

        Test test = Optional.ofNullable(app.getDirection().getTest())
                .orElseThrow(() -> new NotFoundException("Для направления не задан тест"));

        TestAttempt attempt = TestAttempt.builder()
                .user(app.getUser())
                .test(test)
                .application(app)
                .status(TestAttemptStatus.IN_PROGRESS)
                .startedAt(LocalDateTime.now())
                .build();

        app.setTestAttempt(attempt);
        applicationRepository.save(app);

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

    @Transactional
    public TestSubmitResponse submit(TestSubmitRequest req) {
        Long currentUserId = userContext.requireUserId();

        TestAttempt attempt = testAttemptRepository.findById(req.attemptId())
                .orElseThrow(() -> new NotFoundException("Попытка прохождения теста не найдена"));

        if (!attempt.getUser().getId().equals(currentUserId)) {
            throw new ConflictException("Нельзя отправить ответы по чужой попытке");
        }

        if (attempt.getStatus() != TestAttemptStatus.IN_PROGRESS) {
            throw new ConflictException("Тест уже завершен или не был начат");
        }

        Test test = attempt.getTest();
        Map<Long, Question> questionMap = test.getQuestions().stream()
                .collect(Collectors.toMap(Question::getId, q -> q));

        // Сохранение ответов и подсчет баллов
        List<TestAnswer> answers = new ArrayList<>();
        int totalScore = 0;

        for (TestAnswerDto answerDto : req.answers()) {
            Question question = questionMap.get(answerDto.questionId());
            if (question == null) {
                throw new NotFoundException("Вопрос с ID " + answerDto.questionId() + " не найден");
            }

            AnswerOption selectedOption = question.getOptions().stream()
                    .filter(opt -> opt.getId().equals(answerDto.selectedOptionId()))
                    .findFirst()
                    .orElseThrow(() -> new NotFoundException(
                            "Вариант ответа с ID " + answerDto.selectedOptionId() + " не найден"));

            TestAnswer testAnswer = TestAnswer.builder()
                    .attempt(attempt)
                    .selectedOption(selectedOption)
                    .build();
            answers.add(testAnswer);

            if (selectedOption.isCorrect()) {
                totalScore += question.getTestDifficulty();
            }
        }

        attempt.setAnswers(answers);
        attempt.setScore(totalScore);
        attempt.setFinishedAt(LocalDateTime.now());
        attempt.setStatus(TestAttemptStatus.FINISHED);

        testAttemptRepository.save(attempt);

        if (test.getMinScore() != null && totalScore < test.getMinScore()) {
            applicationService.failApplication(
                    attempt.getApplication(),
                    String.format("Тест провален: %d/%d (минимум %d)",
                            totalScore, test.getMaxScore(), test.getMinScore())
            );
        }

        return new TestSubmitResponse(
                attempt.getId(),
                attempt.getStatus(),
                totalScore,
                test.getMaxScore(),
                attempt.getFinishedAt()
        );
    }

    @Transactional(readOnly = true)
    public TestStartResponse getQuestions(Long attemptId) {
        Long currentUserId = userContext.requireUserId();

        TestAttempt attempt = testAttemptRepository.findById(attemptId)
                .orElseThrow(() -> new NotFoundException("Попытка теста не найдена"));

        // ✅ Проверки доступа и статуса
        if (!attempt.getUser().getId().equals(currentUserId)) {
            throw new ConflictException("Нельзя смотреть чужой тест");
        }

        if (attempt.getStatus() == TestAttemptStatus.FINISHED) {
            throw new ConflictException("Тест уже завершен");
        }

        if (attempt.getStatus() == TestAttemptStatus.NOT_STARTED) {
            throw new ConflictException("Тест не запущен");
        }

        Test test = attempt.getTest();

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
