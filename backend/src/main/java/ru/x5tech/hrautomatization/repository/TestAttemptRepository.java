package ru.x5tech.hrautomatization.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import ru.x5tech.hrautomatization.entity.testing.TestAttempt;
import ru.x5tech.hrautomatization.entity.user.Role;

import java.util.Optional;

/**
 * <br>
 * <strong>
 * Author: Дмитрий Николаенков (laplas7)
 * Creation date: 18.12.2025 20:01
 * </strong>
 */
public interface TestAttemptRepository extends JpaRepository<TestAttempt, Long> {

    Optional<TestAttempt> findLatestByUserIdAndTestId(Long userId, Long testId);

}
