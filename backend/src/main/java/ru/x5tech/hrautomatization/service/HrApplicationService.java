package ru.x5tech.hrautomatization.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.x5tech.hrautomatization.dto.hr.MoveApplicationStatusRequest;
import ru.x5tech.hrautomatization.dto.hr.RejectApplicationRequest;
import ru.x5tech.hrautomatization.entity.application.Application;
import ru.x5tech.hrautomatization.entity.application.ApplicationStatusHistory;
import ru.x5tech.hrautomatization.entity.application.DirectionStatus;
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
                .orElseThrow(() -> new NotFoundException("Заявка не найдена"));

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

        var hrUserId = userContext.requireUserId();
        var hrUser = userRepository.findById(hrUserId)
                .orElseThrow(() -> new NotFoundException("HR пользователь не найден"));

        Integer currentOrder = app.getCurrentDirectionStatus().getSequenceOrder();
        Integer targetOrder = targetStatus.getSequenceOrder();

        if (targetOrder <= currentOrder) {
            throw new ConflictException("Нельзя откатывать статус назад (current=" + currentOrder + ", target=" + targetOrder + ")");
        }

        boolean skippedMandatory = directionStatusRepository.existsMandatoryBetween(
                app.getDirection(),
                currentOrder,
                targetOrder
        );

        if (skippedMandatory) {
            throw new ConflictException("Нельзя пропускать обязательные статусы между " + currentOrder + " и " + targetOrder);
        }

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

    @Transactional
    public void rejectApplication(RejectApplicationRequest req) {
        Application application = applicationRepository.findById(req.applicationId())
                .orElseThrow(() -> new NotFoundException("Заявка не найдена"));

        if (!application.isActive()) {
            throw new ConflictException("Заявка уже закрыта");
        }

        application.setActive(false);
        application.setCloseReason(req.closeReason());
        application.setRecruiterNotes(req.comment());
        var user = userRepository.findById(userContext.requireUserId())
                .orElseThrow(() -> new NotFoundException("HR пользователь не найден"));
        ApplicationStatusHistory history = ApplicationStatusHistory.builder()
                .application(application)
                .directionStatus(application.getCurrentDirectionStatus())
                .changedBy(user)
                .comment(String.format("Отказ: %s. Причина: %s",
                        req.comment() != null ? req.comment() : "",
                        req.closeReason()))
                .build();

        application.getStatusHistory().add(history);
        application.setCurrentDirectionStatus(application.getCurrentDirectionStatus());

        applicationRepository.save(application);
    }

}
