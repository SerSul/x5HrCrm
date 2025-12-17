package ru.x5tech.hrautomatization.entity.application;

/**
 * Author: Дмитрий Николаенков (laplas7)
 * Creation date: 17.12.2025
 * TODO можно перенести в отдельную сущность и связать один ко множеству с направлением
 */
public enum EmploymentType {
    FULL_TIME,      // Полная занятость
    PART_TIME,      // Частичная занятость
    CONTRACT,       // Контракт
    INTERNSHIP,     // Стажировка
    REMOTE,         // Удалённая работа
    FREELANCE       // Фриланс
}
