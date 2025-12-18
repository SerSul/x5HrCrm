package ru.x5tech.hrautomatization.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.crossstore.ChangeSetPersister.*;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import ru.x5tech.hrautomatization.config.CustomUserDetails;
import ru.x5tech.hrautomatization.dto.direction.ApplicationStatusHistoryResponse;
import ru.x5tech.hrautomatization.dto.direction.DirectionInfoResponse;
import ru.x5tech.hrautomatization.dto.direction.DirectionResponse;
import ru.x5tech.hrautomatization.dto.direction.DirectionStatusResponse;
import ru.x5tech.hrautomatization.dto.testing.CommonTestDto;
import ru.x5tech.hrautomatization.entity.application.Application;
import ru.x5tech.hrautomatization.entity.application.Direction;
import ru.x5tech.hrautomatization.entity.testing.Test;
import ru.x5tech.hrautomatization.exception.UnauthorizedException;
import ru.x5tech.hrautomatization.mapper.ApplicationStatusHistoryMapper;
import ru.x5tech.hrautomatization.mapper.DirectionMapper;
import ru.x5tech.hrautomatization.mapper.DirectionStatusMapper;
import ru.x5tech.hrautomatization.repository.ApplicationRepository;
import ru.x5tech.hrautomatization.repository.DirectionRepository;
import ru.x5tech.hrautomatization.repository.TestAttemptRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DirectionService {

    private final DirectionRepository directionRepository;
    private final DirectionStatusMapper directionStatusMapper;
    private final ApplicationRepository applicationRepository;
    private final ApplicationStatusHistoryMapper applicationStatusHistoryMapper;
    private final TestAttemptRepository testAttemptRepository;
    public List<DirectionResponse> getDirections(boolean onlyApplied) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        boolean authenticated = auth != null && auth.isAuthenticated()
                && !(auth instanceof AnonymousAuthenticationToken);

        Long userId = authenticated ? extractUserId(auth) : null;

        if (onlyApplied) {
            if (!authenticated) {
                throw new UnauthorizedException("Authentication required to filter by applications");
            }

            List<Direction> directions = directionRepository.findAllByApplicantId(userId);
            return directions.stream()
                    .map(direction -> mapToResponse(direction, true))
                    .toList();
        }

        return directionRepository.findAll()
                .stream()
                .map(direction -> mapToResponse(direction, authenticated && isApplied(direction, userId)))
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
                direction.getTest() != null ? direction.getTest().getId() : null,
                applied
        );
    }

    private boolean isApplied(Direction direction, Long userId) {
        if (userId == null) {
            return false;
        }
        return applicationRepository.existsByUserIdAndDirectionId(userId, direction.getId());
    }


    public DirectionInfoResponse getDirection(Long directionId) {
        var direction = directionRepository.findById(directionId)
                .orElseThrow(() -> new RuntimeException("Direction not found"));

        var statuses = direction.getDirectionStatuses().stream()
                .map(directionStatusMapper::toDto)
                .toList();

        var auth = SecurityContextHolder.getContext().getAuthentication();
        var authenticated = isAuthenticated(auth);

        DirectionStatusResponse currentStatus = null;
        List<ApplicationStatusHistoryResponse> statusHistory = null;
        CommonTestDto testInfo = null;

        if (authenticated) {
            Long userId = extractUserId(auth);
            var application = applicationRepository.findByUserIdAndDirectionId(userId, directionId).orElse(null);

            if (application != null) {
                currentStatus = directionStatusMapper.toDto(application.getCurrentDirectionStatus());
                statusHistory = application.getStatusHistory().stream()
                        .map(applicationStatusHistoryMapper::toDto)
                        .toList();
            }

            var test = direction.getTest();
            if (test != null) {
                testInfo = getTestInfo(userId, test.getId());
            }
        }

        return new DirectionInfoResponse(
                directionId,
                statuses,
                currentStatus,
                statusHistory,
                testInfo
        );
    }

    private CommonTestDto getTestInfo(Long userId, Long testId) {
        // Получаем последнюю попытку прохождения теста
        return testAttemptRepository.findLatestByUserIdAndTestId(userId, testId)
                .map(attempt -> new CommonTestDto(
                        testId,
                        attempt.getId(),
                        attempt.getStartedAt() != null,
                        attempt.getFinishedAt() != null,
                        attempt.getScore()
                ))
                .orElse(new CommonTestDto(testId, null, false, false, null));
    }


    private boolean isAuthenticated(Authentication auth) {
        return auth != null
                && auth.isAuthenticated()
                && !(auth instanceof AnonymousAuthenticationToken);
    }


    private Long extractUserId(Authentication auth) {
        Object principal = auth.getPrincipal();
        if (principal instanceof CustomUserDetails cud) {
            return cud.getId();
        }
        throw new IllegalStateException("Unexpected principal type: " + principal.getClass());
    }
}
