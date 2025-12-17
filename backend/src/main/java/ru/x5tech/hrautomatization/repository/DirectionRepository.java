package ru.x5tech.hrautomatization.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ru.x5tech.hrautomatization.entity.application.Direction;

import java.util.List;

public interface DirectionRepository extends JpaRepository<Direction, Long> {

    @Query("""
           select distinct d
           from Direction d
           join d.applications a
           where a.applicant.id = :userId
           """)
    List<Direction> findAllByApplicantId(@Param("userId") Long userId);
}
