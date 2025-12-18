package ru.x5tech.hrautomatization.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import ru.x5tech.hrautomatization.config.CustomUserDetails;
import ru.x5tech.hrautomatization.dto.direction.*;
import ru.x5tech.hrautomatization.dto.testing.CommonTestDto;
import ru.x5tech.hrautomatization.entity.application.Application;
import ru.x5tech.hrautomatization.entity.application.Direction;
import ru.x5tech.hrautomatization.entity.testing.Test;
import ru.x5tech.hrautomatization.entity.testing.TestAttemptStatus;
import ru.x5tech.hrautomatization.exception.UnauthorizedException;
import ru.x5tech.hrautomatization.mapper.ApplicationStatusHistoryMapper;
import ru.x5tech.hrautomatization.mapper.DirectionStatusMapper;
import ru.x5tech.hrautomatization.repository.ApplicationRepository;
import ru.x5tech.hrautomatization.repository.DirectionRepository;
import ru.x5tech.hrautomatization.repository.TestAttemptRepository;

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

    public List<DirectionResponse> getDirections(boolean onlyApplied) {
        return Optional.ofNullable(SecurityContextHolder.getContext().getAuthentication())
                .filter(this::isAuthenticated)
                .map(auth -> extractUserId(auth))
                .map(userId -> onlyApplied
                        ? getAppliedDirections(userId)
                        : getAllDirections(userId))
                .orElseGet(() -> onlyApplied
                        ? List.of()
                        : getAllDirections(null));
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
                .map(direction -> mapToResponse(direction,
                        userId != null && applicationRepository.existsByUserIdAndDirectionId(userId, direction.getId())))
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
                Optional.ofNullable(direction.getTest())
                        .map(Test::getId)
                        .orElse(null),
                applied
        );
    }

    public DirectionInfoResponse getDirection(Long directionId) {
        Direction direction = directionRepository.findById(directionId)
                .orElseThrow(() -> new RuntimeException("Direction not found"));

        List<DirectionStatusResponse> statuses = direction.getDirectionStatuses()
                .stream()
                .map(directionStatusMapper::toDto)
                .toList();

        return Optional.ofNullable(SecurityContextHolder.getContext().getAuthentication())
                .filter(this::isAuthenticated)
                .map(auth -> extractUserId(auth))
                .flatMap(userId -> applicationRepository.findByUserIdAndDirectionId(userId, directionId))
                .map(application -> buildDirectionInfoWithApplication(direction, application, statuses))
                .orElseGet(() -> new DirectionInfoResponse(directionId, statuses, null, null, null));
    }

    private DirectionInfoResponse buildDirectionInfoWithApplication(
            Direction direction,
            Application application,
            List<DirectionStatusResponse> statuses) {

        DirectionStatusResponse currentStatus = directionStatusMapper.toDto(application.getCurrentDirectionStatus());
        List<ApplicationStatusHistoryResponse> statusHistory = application.getStatusHistory()
                .stream()
                .map(applicationStatusHistoryMapper::toDto)
                .toList();

        CommonTestDto testInfo = Optional.ofNullable(direction.getTest())
                .map(test -> getTestInfo(extractUserId(SecurityContextHolder.getContext().getAuthentication()), test.getId()))
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

    private boolean isAuthenticated(Authentication auth) {
        return auth != null && auth.isAuthenticated() && !(auth instanceof AnonymousAuthenticationToken);
    }

    private Long extractUserId(Authentication auth) {
        return Optional.ofNullable(auth.getPrincipal())
                .filter(principal -> principal instanceof CustomUserDetails)
                .map(principal -> (CustomUserDetails) principal)
                .map(CustomUserDetails::getId)
                .orElseThrow(() -> new IllegalStateException(
                        "Unexpected principal type: " + Optional.ofNullable(auth.getPrincipal()).map(Object::getClass).orElse(null)));
    }
}
