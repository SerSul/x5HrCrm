package ru.x5tech.hrautomatization.mapper;


import org.mapstruct.Mapper;
import ru.x5tech.hrautomatization.dto.direction.DirectionResponse;
import ru.x5tech.hrautomatization.entity.application.Direction;

/**
 * <br>
 * <strong>
 * Author: Дмитрий Николаенков (laplas7)
 * Creation date: 17.12.2025 21:18
 * </strong>
 */
@Mapper(componentModel = "spring")
public interface DirectionMapper {
    DirectionResponse toDto(Direction direction);
}
