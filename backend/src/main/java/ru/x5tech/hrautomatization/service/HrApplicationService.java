package ru.x5tech.hrautomatization.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.x5tech.hrautomatization.dto.hr.*;
import ru.x5tech.hrautomatization.entity.application.Application;
import ru.x5tech.hrautomatization.entity.application.ApplicationStatusHistory;
import ru.x5tech.hrautomatization.entity.application.DirectionStatus;
import ru.x5tech.hrautomatization.entity.testing.TestAttemptStatus;
import ru.x5tech.hrautomatization.exception.ConflictException;
import ru.x5tech.hrautomatization.exception.NotFoundException;
import ru.x5tech.hrautomatization.repository.ApplicationRepository;
import ru.x5tech.hrautomatization.repository.DirectionStatusRepository;
import ru.x5tech.hrautomatization.repository.UserRepository;
import ru.x5tech.hrautomatization.security.UserContext;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;

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

    @Transactional(readOnly = true)
    public ApplicationListResponse getApplications(ApplicationFilterDto filter) {
        int page = Math.max(0, filter.page());
        Pageable pageable = PageRequest.of(page, filter.size());

        Page<Object[]> rawPage = applicationRepository.findAllHrApplicationsRaw(
                filter.directionName(),
                filter.active(),
                filter.sortByScore(),
                pageable
        );

        List<ApplicationHrItem> items = rawPage.getContent().stream()
                .map(row -> new ApplicationHrItem(
                        (Long) row[0],
                        (Long) row[1],
                        (String) row[2],
                        (Long) row[3],
                        (String) row[4],
                        (Long) row[5],
                        (String) row[6],
                        (Integer) row[7],
                        (Integer) row[8],
                        (Boolean) row[9],
                        (Timestamp) row[10],
                        (String) row[11]
                ))
                .toList();

        return new ApplicationListResponse(
                items,
                rawPage.getTotalElements(),
                rawPage.getNumber(),
                rawPage.getSize(),
                rawPage.getTotalPages()
        );
    }






}
