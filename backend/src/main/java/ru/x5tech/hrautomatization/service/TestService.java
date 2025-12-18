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

        // Сохранение ответов
        List<TestAnswer> answers = new ArrayList<>();
        for (TestAnswerDto answerDto : req.answers()) {
            Question question = questionMap.get(answerDto.questionId());
            if (question == null) {
                throw new NotFoundException("Вопрос с ID " + answerDto.questionId() + " не найден в данном тесте");
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
        }

        attempt.setAnswers(answers);

        // Подсчет баллов
        int correctAnswers = (int) answers.stream()
                .filter(ans -> ans.getSelectedOption().isCorrect())
                .count();

        attempt.setScore(correctAnswers);
        attempt.setFinishedAt(LocalDateTime.now());
        attempt.setStatus(TestAttemptStatus.FINISHED);

        testAttemptRepository.save(attempt);

        return new TestSubmitResponse(
                attempt.getId(),
                attempt.getStatus(),
                correctAnswers,
                test.getQuestions().size(),
                attempt.getFinishedAt()
        );
    }

}
