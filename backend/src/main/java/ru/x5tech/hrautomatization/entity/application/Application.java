package ru.x5tech.hrautomatization.entity.application;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import ru.x5tech.hrautomatization.entity.user.User;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Author: Дмитрий Николаенков (laplas7)
 *
 * Отклик кандидата на направление.
 * Хранит текущий статус кандидата и историю его прохождения
 */
@Entity
@Table(name = "applications",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "direction_id"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(optional = false)
    @JoinColumn(name = "direction_id", nullable = false)
    private Direction direction;

    // Текущий статус кандидата в этом направлении
    @ManyToOne(optional = false)
    @JoinColumn(name = "current_direction_status_id", nullable = false)
    private DirectionStatus currentDirectionStatus;

    @CreatedDate
    @Column(name = "applied_at", nullable = false)
    private LocalDateTime appliedAt = LocalDateTime.now();

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @Column(name = "closed_at")
    private LocalDateTime closedAt;

    // История прохождения статусов
    @OneToMany(mappedBy = "application", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ApplicationStatusHistory> statusHistory = new ArrayList<>();

    @Column(name = "is_active", nullable = false)
    private boolean active = true;

    // Комментарий рекрутера
    @Column(name = "recruiter_notes", columnDefinition = "TEXT")
    private String recruiterNotes;
}
