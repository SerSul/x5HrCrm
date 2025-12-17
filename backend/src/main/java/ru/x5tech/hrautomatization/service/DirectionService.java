package ru.x5tech.hrautomatization.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import ru.x5tech.hrautomatization.config.CustomUserDetails;
import ru.x5tech.hrautomatization.dto.DirectionResponse;
import ru.x5tech.hrautomatization.entity.application.Direction;
import ru.x5tech.hrautomatization.exception.UnauthorizedException;
import ru.x5tech.hrautomatization.mapper.DirectionMapper;
import ru.x5tech.hrautomatization.repository.DirectionRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DirectionService {

    private final DirectionRepository directionRepository;
    private final DirectionMapper directionMapper;

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

    private Long extractUserId(Authentication auth) {
        Object principal = auth.getPrincipal();
        if (principal instanceof CustomUserDetails cud) {
            return cud.getId();
        }
        throw new IllegalStateException("Unexpected principal type: " + principal.getClass());
    }
}
