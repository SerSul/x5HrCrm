package ru.x5tech.hrautomatization.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.x5tech.hrautomatization.entity.application.Direction;
import ru.x5tech.hrautomatization.entity.application.DirectionStatus;
import ru.x5tech.hrautomatization.entity.user.PersonalData;

import java.util.Optional;

/**
 * <br>
 * <strong>
 * Author: Дмитрий Николаенков (laplas7)
 * Creation date: 18.12.2025 18:25
 * </strong>
 */
@Repository
public interface DirectionStatusRepository extends JpaRepository<DirectionStatus, Long> {

    Optional<DirectionStatus> findByDirectionAndSequenceOrder(Direction direction, Integer sequenceOrder);
}
