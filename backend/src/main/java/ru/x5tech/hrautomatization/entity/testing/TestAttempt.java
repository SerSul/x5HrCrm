package ru.x5tech.hrautomatization.entity.testing;

import jakarta.persistence.*;
import lombok.*;
import ru.x5tech.hrautomatization.entity.user.User;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "test_attempts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TestAttempt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(optional = false)
    @JoinColumn(name = "test_id")
    private Test test;

    @Column(name = "started_at", nullable = false)
    private LocalDateTime startedAt = LocalDateTime.now();

    @Column(name = "finished_at")
    private LocalDateTime finishedAt;

    @Column(name = "score")
    private Integer score;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private TestAttemptStatus status = TestAttemptStatus.NOT_STARTED;

    @OneToMany(mappedBy = "attempt", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TestAnswer> answers;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;
}
