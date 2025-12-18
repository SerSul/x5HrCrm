package ru.x5tech.hrautomatization.repository;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ru.x5tech.hrautomatization.dto.hr.ApplicationHrItem;
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

    Optional<Application> findByUserAndDirection(User user, Direction directionId);


    @Query(value = """
    SELECT 
        a.user_id,
        a.id,
        COALESCE(pd.last_name || ' ' || pd.first_name, u.email),
        a.direction_id,
        d.title,
        ta.id,
        ta.status,
        ta.score,
        t.max_score,
        a.is_active,
        a.applied_at,
        a.resume_path
    FROM applications a
    JOIN users u ON u.id = a.user_id
    LEFT JOIN personal_data pd ON pd.id = u.personal_data_id
    JOIN directions d ON d.id = a.direction_id
    LEFT JOIN test_attempts ta ON ta.application_id = a.id
    LEFT JOIN tests t ON t.id = ta.test_id
    WHERE 1 = 1
      AND (:directionName IS NULL OR d.title ILIKE CONCAT('%', :directionName, '%'))
      AND (:active IS NULL OR a.is_active = :active)
    ORDER BY 
      CASE WHEN :sortByScore = 'desc' THEN ta.score END DESC NULLS LAST,
      CASE WHEN :sortByScore = 'asc' THEN ta.score END ASC NULLS LAST,
      a.applied_at DESC
    LIMIT :#{#pageable.pageSize} OFFSET :#{#pageable.offset}
""",
            countQuery = """
    SELECT COUNT(*)
    FROM applications a
    JOIN directions d ON d.id = a.direction_id
    WHERE 1 = 1
      AND (:directionName IS NULL OR d.title ILIKE CONCAT('%', :directionName, '%'))
      AND (:active IS NULL OR a.is_active = :active)
""",
            nativeQuery = true)
    Page<Object[]> findAllHrApplicationsRaw(
            @Param("directionName") String directionName,
            @Param("active") Boolean active,
            @Param("sortByScore") String sortByScore,
            Pageable pageable
    );



}
