package ru.x5tech.hrautomatization.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.x5tech.hrautomatization.dto.direction.*;
import ru.x5tech.hrautomatization.dto.testing.CommonTestDto;
import ru.x5tech.hrautomatization.entity.application.Application;
import ru.x5tech.hrautomatization.entity.application.Direction;
import ru.x5tech.hrautomatization.entity.testing.Test;
import ru.x5tech.hrautomatization.entity.testing.TestAttemptStatus;
import ru.x5tech.hrautomatization.mapper.ApplicationStatusHistoryMapper;
import ru.x5tech.hrautomatization.mapper.DirectionStatusMapper;
import ru.x5tech.hrautomatization.repository.ApplicationRepository;
import ru.x5tech.hrautomatization.repository.DirectionRepository;
import ru.x5tech.hrautomatization.repository.TestAttemptRepository;
import ru.x5tech.hrautomatization.security.UserContext;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DirectionService {

    private final DirectionRepository directionRepository;
    private final DirectionStatusMapper directionStatusMapper;
    private final ApplicationRepository applicationRepository;
    private final ApplicationStatusHistoryMapper applicationStatusHistoryMapper;
    private final TestAttemptRepository testAttemptRepository;

    private final UserContext userContext;

    public List<DirectionResponse> getDirections(boolean onlyApplied) {
        return userContext.currentUserId()
                .map(userId -> onlyApplied ? getAppliedDirections(userId) : getAllDirections(userId))
                .orElseGet(() -> onlyApplied ? List.of() : getAllDirections(null));
    }

    private List<DirectionResponse> getAppliedDirections(Long userId) {
        return directionRepository.findAllByApplicantId(userId)
                .stream()
                .map(direction -> mapToResponse(direction, true))
                .toList();
    }

    private List<DirectionResponse> getAllDirections(Long userId) {
        return directionRepository.findAll()
                .stream()
                .map(direction -> mapToResponse(
                        direction,
                        userId != null && applicationRepository.existsByUserIdAndDirectionId(userId, direction.getId())
                ))
                .toList();
    }

    private DirectionResponse mapToResponse(Direction direction, boolean applied) {
        return new DirectionResponse(
                direction.getId(),
                direction.getTitle(),
                direction.getDescription(),
                direction.getEmploymentType(),
                direction.getSalaryMin(),
                direction.getSalaryMax(),
                direction.isActive(),
                direction.getCreatedAt(),
                direction.getClosedAt(),
                Optional.ofNullable(direction.getTest()).map(Test::getId).orElse(null),
                applied
        );
    }

    public DirectionInfoResponse getDirectionInfoRoleAware(Long directionId, Long userId) {
        if (userId != null) {
            userContext.requireAnyRole("HR", "ADMIN");
            return getDirectionInfo(directionId, userId);
        }
        return getDirectionInfo(directionId, null);
    }

    public DirectionInfoResponse getDirectionInfo(Long directionId, Long userId) {
        Direction direction = directionRepository.findById(directionId)
                .orElseThrow(() -> new RuntimeException("Direction not found"));

        List<DirectionStatusResponse> statuses = direction.getDirectionStatuses()
                .stream()
                .map(directionStatusMapper::toDto)
                .toList();

        // 1) если userId явно передали — используем его
        if (userId != null) {
            return applicationRepository.findByUserIdAndDirectionId(userId, directionId)
                    .map(app -> buildDirectionInfoWithApplication(direction, app, statuses, userId))
                    .orElseGet(() -> new DirectionInfoResponse(directionId, statuses, null, null, null));
        }

        // 2) иначе пробуем достать из UserContext
        return userContext.currentUserId()
                .flatMap(uid -> applicationRepository.findByUserIdAndDirectionId(uid, directionId)
                        .map(app -> buildDirectionInfoWithApplication(direction, app, statuses, uid)))
                .orElseGet(() -> new DirectionInfoResponse(directionId, statuses, null, null, null));
    }

    private DirectionInfoResponse buildDirectionInfoWithApplication(
            Direction direction,
            Application application,
            List<DirectionStatusResponse> statuses,
            Long userId
    ) {
        DirectionStatusResponse currentStatus = directionStatusMapper.toDto(application.getCurrentDirectionStatus());

        List<ApplicationStatusHistoryResponse> statusHistory = application.getStatusHistory()
                .stream()
                .map(applicationStatusHistoryMapper::toDto)
                .toList();

        CommonTestDto testInfo = Optional.ofNullable(direction.getTest())
                .map(test -> getTestInfo(userId, test.getId()))
                .orElse(null);

        return new DirectionInfoResponse(direction.getId(), statuses, currentStatus, statusHistory, testInfo);
    }

    private CommonTestDto getTestInfo(Long userId, Long testId) {
        return testAttemptRepository.findLatestByUserIdAndTestId(userId, testId)
                .map(attempt -> new CommonTestDto(
                        testId,
                        attempt.getId(),
                        attempt.getStatus(),
                        attempt.getScore()
                ))
                .orElse(new CommonTestDto(testId, null, TestAttemptStatus.NOT_STARTED, null));
    }
}
