package ru.x5tech.hrautomatization.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.x5tech.hrautomatization.entity.user.PersonalData;

/**
 * Author: Дмитрий Николаенков (laplas7)
 * Creation date: 17.12.2025
 */
@Repository
public interface PersonalDataRepository extends JpaRepository<PersonalData, Long> {
}
