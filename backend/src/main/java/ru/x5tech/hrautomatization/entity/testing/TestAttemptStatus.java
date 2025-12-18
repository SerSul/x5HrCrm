package ru.x5tech.hrautomatization.entity.testing;

import lombok.Getter;
import lombok.Setter;

@Getter
public enum TestAttemptStatus {
    NOT_STARTED("Не начат"),
    STARTED("Начат"),
    IN_PROGRESS("В процессе"),
    FINISHED("Завершен"),
    EXPIRED("Истек"),
    FAILED("Провален");

    private final String description;

    TestAttemptStatus(String description) {
        this.description = description;
    }

}
