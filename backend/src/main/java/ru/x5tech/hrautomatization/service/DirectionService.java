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
import ru.x5tech.hrautomatization.entity.application.Application;
import ru.x5tech.hrautomatization.entity.application.Direction;
import ru.x5tech.hrautomatization.exception.UnauthorizedException;
import ru.x5tech.hrautomatization.mapper.ApplicationStatusHistoryMapper;
import ru.x5tech.hrautomatization.mapper.DirectionMapper;
import ru.x5tech.hrautomatization.mapper.DirectionStatusMapper;
import ru.x5tech.hrautomatization.repository.ApplicationRepository;
import ru.x5tech.hrautomatization.repository.DirectionRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DirectionService {

    private final DirectionRepository directionRepository;
    private final DirectionMapper directionMapper;
    private final DirectionStatusMapper directionStatusMapper;
    private final ApplicationRepository applicationRepository;
    private final ApplicationStatusHistoryMapper applicationStatusHistoryMapper;

    public List<DirectionResponse> getDirections(boolean onlyApplied) {
        // пользователь аутентифицирован?
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        boolean authenticated = auth != null && auth.isAuthenticated()
                && !(auth instanceof AnonymousAuthenticationToken);

        if (onlyApplied) {
            if (!authenticated) {
                throw new UnauthorizedException("Authentication required to filter by applications");
            }

            Long userId = extractUserId(auth);
            List<Direction> directions = directionRepository.findAllByApplicantId(userId);
            return directions.stream().map(directionMapper::toDto).toList();
        }

        return directionRepository.findAll()
                .stream()
                .map(directionMapper::toDto)
                .toList();
    }

    public DirectionInfoResponse getDirection(Long directionId) {
        Direction direction = directionRepository.findById(directionId)
                .orElseThrow(() -> new RuntimeException("Direction not found"));

        List<DirectionStatusResponse> statuses = direction.getDirectionStatuses().stream()
                .map(directionStatusMapper::toDto)
                .toList();

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        boolean authenticated = isAuthenticated(auth);

        DirectionStatusResponse currentStatus = null;
        List<ApplicationStatusHistoryResponse> statusHistory = null;

        if (authenticated) {
            Long userId = extractUserId(auth);
            var application = applicationRepository.findByUserIdAndDirectionId(userId, directionId).orElse(null);

            if (application != null) {
                currentStatus = directionStatusMapper.toDto(application.getCurrentDirectionStatus());
                statusHistory = application.getStatusHistory().stream()
                        .map(applicationStatusHistoryMapper::toDto)
                        .toList();
            }
        }

        return new DirectionInfoResponse(
                directionId,
                statuses,
                currentStatus,
                statusHistory
        );
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
