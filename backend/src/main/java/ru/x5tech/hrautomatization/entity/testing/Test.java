package ru.x5tech.hrautomatization.entity.testing;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "tests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Test {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "description")
    private String description;

    @OneToMany(mappedBy = "test", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Question> questions;

    @CreatedDate
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "time_limit_minutes", nullable = false)
    private Integer timeLimitMinutes = 60;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @Column(name = "max_score")
    private Integer maxScore;

    @Column(name = "min_score")
    private Integer minScore;
}
