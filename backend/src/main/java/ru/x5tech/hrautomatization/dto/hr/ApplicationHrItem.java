package ru.x5tech.hrautomatization.dto.hr;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import ru.x5tech.hrautomatization.entity.testing.TestAttemptStatus;

import java.sql.Timestamp;
import java.time.LocalDateTime;

@Schema(description = "Отклик для HR списка")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ApplicationHrItem {

    @JsonProperty("user_id")
    private Long userId;

    @JsonProperty("application_id")
    private Long applicationId;

    @JsonProperty("full_name")
    private String fullName;

    @JsonProperty("direction_id")
    private Long directionId;

    @JsonProperty("direction_name")
    private String directionName;

    @JsonProperty("test_attempt_id")
    private Long testAttemptId;

    @JsonProperty("test_status")
    private TestAttemptStatus testStatus;

    @JsonProperty("test_score")
    private Integer testScore;

    @JsonProperty("max_score")
    private Integer maxScore;

    @JsonProperty("is_active")
    private boolean isActive;

    @JsonProperty("applied_at")
    private LocalDateTime appliedAt;

    @JsonProperty("resume_path")
    private String resumePath;

    public ApplicationHrItem(Long userId,
                             Long applicationId,
                             String fullName,
                             Long directionId,
                             String directionName,
                             Long testAttemptId,
                             String testStatus,
                             Integer testScore,
                             Integer maxScore,
                             Boolean isActive,
                             Timestamp appliedAt,
                             String resumePath) {

        this.userId = userId;
        this.applicationId = applicationId;
        this.fullName = fullName;
        this.directionId = directionId;
        this.directionName = directionName;
        this.testAttemptId = testAttemptId;
        this.testStatus = testStatus != null
                ? TestAttemptStatus.valueOf(testStatus)
                : null;
        this.testScore = testScore;
        this.maxScore = maxScore;
        this.isActive = Boolean.TRUE.equals(isActive);
        this.appliedAt = appliedAt != null
                ? appliedAt.toLocalDateTime()
                : null;
        this.resumePath = resumePath;
    }
}
