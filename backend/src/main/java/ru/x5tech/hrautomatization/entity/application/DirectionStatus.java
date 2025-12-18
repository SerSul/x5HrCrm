package ru.x5tech.hrautomatization.entity.application;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Author: Дмитрий Николаенков (laplas7)
 * Creation date: 16.12.2025 20:39
 *
 * Связь направления со статусами - определяет какие статусы
 * доступны для конкретного направления и в каком порядке
 */
@Entity
@Table(name = "direction_statuses",
        uniqueConstraints = @UniqueConstraint(columnNames = {"direction_id", "sequence_order"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DirectionStatus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "direction_id", nullable = false)
    private Direction direction;

    @Column(name = "title", nullable = false, length = 255)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "sequence_order", nullable = false)
    private Integer sequenceOrder;

    @Column(name = "is_mandatory", nullable = false)
    private boolean mandatory = true;
}
