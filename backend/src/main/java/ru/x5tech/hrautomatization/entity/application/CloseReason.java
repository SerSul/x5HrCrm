package ru.x5tech.hrautomatization.entity.application;

public enum CloseReason {
    HIRED,                 // Нанят
    REJECTED,              // Отказ (по решению компании)
    CANDIDATE_WITHDREW,    // Кандидат сам отказался
    NO_RESPONSE,           // Нет ответа/пропал
    DUPLICATE,             // Дубликат отклика
    POSITION_CLOSED        // Вакансия/направление закрыто
}
