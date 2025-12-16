package ru.x5tech.hrautomatization.entity.application;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import ru.x5tech.hrautomatization.entity.user.User;

import java.time.LocalDateTime;

/**
 * Author: Дмитрий Николаенков (laplas7)
 *
 * История изменений статусов отклика
 */
@Entity
@Table(name = "application_status_history")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationStatusHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "application_id", nullable = false)
    private Application application;

    @ManyToOne(optional = false)
    @JoinColumn(name = "direction_status_id", nullable = false)
    private DirectionStatus directionStatus;

    @ManyToOne
    @JoinColumn(name = "changed_by_user_id")
    private User changedBy;

    @CreatedDate
    @Column(name = "changed_at", nullable = false)
    private LocalDateTime changedAt = LocalDateTime.now();

    @Column(name = "comment", columnDefinition = "TEXT")
    private String comment;
}
