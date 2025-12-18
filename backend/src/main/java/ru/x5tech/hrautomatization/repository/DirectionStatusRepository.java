package ru.x5tech.hrautomatization.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.x5tech.hrautomatization.entity.application.Direction;
import ru.x5tech.hrautomatization.entity.application.DirectionStatus;
import ru.x5tech.hrautomatization.entity.user.PersonalData;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

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

    @Query("""
        select (count(ds) > 0)
        from DirectionStatus ds
        where ds.direction = :direction
          and ds.mandatory = true
          and ds.sequenceOrder > :fromOrder
          and ds.sequenceOrder < :toOrder
    """)
    boolean existsMandatoryBetween(
            @Param("direction") Direction direction,
            @Param("fromOrder") Integer fromOrder,
            @Param("toOrder") Integer toOrder
    );

    Optional<DirectionStatus> findByDirectionAndSequenceOrder(Direction direction, Integer sequenceOrder);
}
