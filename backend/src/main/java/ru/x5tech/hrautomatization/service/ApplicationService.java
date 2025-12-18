package ru.x5tech.hrautomatization.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.x5tech.hrautomatization.dto.direction.ApplyRequest;
import ru.x5tech.hrautomatization.entity.application.Application;
import ru.x5tech.hrautomatization.entity.application.ApplicationStatusHistory;
import ru.x5tech.hrautomatization.entity.application.CloseReason;
import ru.x5tech.hrautomatization.entity.application.Direction;
import ru.x5tech.hrautomatization.entity.user.User;
import ru.x5tech.hrautomatization.exception.ConflictException;
import ru.x5tech.hrautomatization.exception.NotFoundException;
import ru.x5tech.hrautomatization.repository.ApplicationRepository;
import ru.x5tech.hrautomatization.repository.DirectionRepository;
import ru.x5tech.hrautomatization.repository.DirectionStatusRepository;
import ru.x5tech.hrautomatization.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final DirectionRepository directionRepository;
    private final DirectionStatusRepository directionStatusRepository;
    private final UserRepository userRepository;

    @Transactional
    public Application createApplication(Long directionId, UserDetails userDetails, ApplyRequest request) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new NotFoundException("Пользователь не найден"));

        Direction direction = directionRepository.findById(directionId)
                .orElseThrow(() -> new NotFoundException("Направление не найдено"));

        if (applicationRepository.existsByUserAndDirection(user, direction)) {
            throw new ConflictException("Вы уже подали заявку на это направление");
        }

        var initialStatus = directionStatusRepository
                .findByDirectionAndSequenceOrder(direction, 1)
                .orElseThrow(() -> new ConflictException("Начальный статус не настроен"));

        var application = Application.builder()
                .user(user)
                .direction(direction)
                .currentDirectionStatus(initialStatus)
                .resumePath(request.getResumePath())
                .appliedAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .active(true)
                .recruiterNotes(request.getComment())
                .statusHistory(new ArrayList<>())
                .build();

        var history = ApplicationStatusHistory.builder()
                .application(application)
                .directionStatus(initialStatus)
                .changedBy(user)
                .changedAt(LocalDateTime.now())
                .comment("Заявка создана")
                .build();

        application.getStatusHistory().add(history);
        return applicationRepository.save(application);
    }

    @Transactional
    public void withdrawApplication(Long directionId, UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new NotFoundException("Пользователь не найден"));

        Direction direction = directionRepository.findById(directionId)
                .orElseThrow(() -> new NotFoundException("Направление не найдено"));

        Application application = applicationRepository.findByUserAndDirection(user, direction)
                .orElseThrow(() -> new NotFoundException("Заявка не найдена"));

        if (!application.isActive()) {
            throw new ConflictException("Заявка уже закрыта");
        }

        application.setActive(false);
        application.setClosedAt(LocalDateTime.now());

        ApplicationStatusHistory history = ApplicationStatusHistory.builder()
                .application(application)
                .directionStatus(application.getCurrentDirectionStatus())
                .changedBy(user)
                .changedAt(LocalDateTime.now())
                .comment("Заявка отозвана пользователем")
                .build();

        application.getStatusHistory().add(history);
        applicationRepository.save(application);
    }

    @Transactional
    public void failApplication(Application application, String reason) {
        if (!application.isActive()) {
            throw new ConflictException("Заявка уже закрыта");
        }

        application.setActive(false);
        application.setClosedAt(LocalDateTime.now());
        application.setCloseReason(CloseReason.REJECTED);

        // Добавляем запись в историю статусов
        ApplicationStatusHistory history = ApplicationStatusHistory.builder()
                .application(application)
                .directionStatus(application.getCurrentDirectionStatus())
                .changedBy(null)
                .changedAt(LocalDateTime.now())
                .comment("Автозакрытие: " + reason)
                .build();

        application.getStatusHistory().add(history);
        applicationRepository.save(application);
    }

}
