package ru.x5tech.hrautomatization.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.x5tech.hrautomatization.entity.application.Application;
import ru.x5tech.hrautomatization.entity.application.Direction;
import ru.x5tech.hrautomatization.entity.user.User;

import java.util.Optional;

/**
 * <br>
 * <strong>
 * Author: Дмитрий Николаенков (laplas7)
 * Creation date: 18.12.2025 00:33
 * </strong>
 */
@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {

    Optional<Application> findByUserIdAndDirectionId(Long userId, Long directionId);

    boolean existsByUserAndDirection(User user, Direction directionId);

    boolean existsByUserIdAndDirectionId(Long userId, Long directionId);
}
