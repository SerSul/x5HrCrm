package ru.x5tech.hrautomatization.dto.auth;


/**
* <br>
* <strong>
* Author: Дмитрий Николаенков (laplas7)
* Creation date: 17.12.2025 19:16
* </strong>
*/
public record RegisterRequest(
        String email,
        String password,
        String phone,
        String firstName,
        String lastName,
        String middleName
) {}