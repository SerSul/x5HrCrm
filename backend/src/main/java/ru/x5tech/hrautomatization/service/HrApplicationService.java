package ru.x5tech.hrautomatization.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.x5tech.hrautomatization.dto.hr.MoveApplicationStatusRequest;
import ru.x5tech.hrautomatization.entity.application.Application;
import ru.x5tech.hrautomatization.entity.application.ApplicationStatusHistory;
import ru.x5tech.hrautomatization.exception.ConflictException;
import ru.x5tech.hrautomatization.exception.NotFoundException;
import ru.x5tech.hrautomatization.repository.ApplicationRepository;
import ru.x5tech.hrautomatization.repository.DirectionStatusRepository;
import ru.x5tech.hrautomatization.repository.UserRepository;
import ru.x5tech.hrautomatization.security.UserContext;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class HrApplicationService {

    private final ApplicationRepository applicationRepository;
    private final DirectionStatusRepository directionStatusRepository;
    private final UserRepository userRepository;
    private final UserContext userContext;

    @Transactional
    public void moveToStatus(MoveApplicationStatusRequest req) {
        var app = applicationRepository.findByUserIdAndDirectionId(req.userId(), req.directionId())
                .orElseThrow(() -> new NotFoundException("Заявка не найдена")); // репозиторий уже содержит этот метод [file:130]

        if (!app.isActive()) {
            throw new ConflictException("Нельзя менять статус: заявка закрыта");
        }

        var targetStatus = directionStatusRepository
                .findByDirectionAndSequenceOrder(app.getDirection(), req.sequenceOrder())
                .orElseThrow(() -> new NotFoundException("Статус не найден для order=" + req.sequenceOrder()));

        if (app.getCurrentDirectionStatus() != null
                && app.getCurrentDirectionStatus().getSequenceOrder().equals(req.sequenceOrder())) {
            throw new ConflictException("Заявка уже находится в этом статусе");
        }

        Long hrUserId = userContext.requireUserId();
        var hrUser = userRepository.findById(hrUserId)
                .orElseThrow(() -> new NotFoundException("HR пользователь не найден"));

        LocalDateTime now = LocalDateTime.now();
        String comment = (req.comment() == null || req.comment().isBlank())
                ? "Статус изменён HR"
                : req.comment();

        app.setCurrentDirectionStatus(targetStatus);
        app.setUpdatedAt(now);

        app.getStatusHistory().add(ApplicationStatusHistory.builder()
                .application(app)
                .directionStatus(targetStatus)
                .changedBy(hrUser)
                .changedAt(now)
                .comment(comment)
                .build());

        applicationRepository.save(app);
    }
}
