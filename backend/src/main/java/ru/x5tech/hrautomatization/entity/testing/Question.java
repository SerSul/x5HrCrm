package ru.x5tech.hrautomatization.entity.testing;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "questions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "test_id")
    private Test test;

    @Column(name = "test_difficulty", nullable = false, length = 2000)
    private int testDifficulty;

    @Column(name = "text", nullable = false, length = 2000)
    private String text;

    @Column(name = "order_index")
    private Integer orderIndex;

    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<AnswerOption> options;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;
}
