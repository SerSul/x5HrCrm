package ru.x5tech.hrautomatization.entity.testing;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "test_answers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TestAnswer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "attempt_id")
    private TestAttempt attempt;

    // Выбранный вариант (для single choice)
    @ManyToOne
    @JoinColumn(name = "selected_option_id")
    private AnswerOption selectedOption;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;
}
