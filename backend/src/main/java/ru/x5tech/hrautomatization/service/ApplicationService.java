package ru.x5tech.hrautomatization.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.x5tech.hrautomatization.dto.direction.ApplyRequest;
import ru.x5tech.hrautomatization.entity.application.Application;
import ru.x5tech.hrautomatization.entity.application.Direction;
import ru.x5tech.hrautomatization.entity.application.DirectionStatus;
import ru.x5tech.hrautomatization.entity.user.User;
import ru.x5tech.hrautomatization.repository.ApplicationRepository;
import ru.x5tech.hrautomatization.repository.DirectionRepository;
import ru.x5tech.hrautomatization.repository.DirectionStatusRepository;
import ru.x5tech.hrautomatization.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.ArrayList;

/**
 * Author: Дмитрий Николаенков (laplas7)
 * Creation date: 18.12.2025
 */
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
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));

        Direction direction = directionRepository.findById(directionId)
                .orElseThrow(() -> new RuntimeException("Направление не найдено"));

        if (applicationRepository.existsByUserAndDirection(user, direction)) {
            throw new RuntimeException("Вы уже подали заявку на это направление");
        }

        // Получение первого статуса для направления
        DirectionStatus initialStatus = directionStatusRepository
                .findByDirectionAndSequenceOrder(direction, 1)
                .orElseThrow(() -> new RuntimeException("Начальный статус не настроен"));


        // Создание заявки
        Application application = Application.builder()
                .user(user)
                .direction(direction)
                .currentDirectionStatus(initialStatus)
                .resumePath(request.getResumePath())
                .appliedAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .statusHistory(new ArrayList<>())
                .active(true)
                .recruiterNotes(request.getComment())
                .build();

        return applicationRepository.save(application);
    }
}
