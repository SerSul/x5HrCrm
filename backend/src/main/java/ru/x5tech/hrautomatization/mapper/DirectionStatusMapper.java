package ru.x5tech.hrautomatization.mapper;


import org.mapstruct.Mapper;
import ru.x5tech.hrautomatization.dto.direction.DirectionStatusResponse;
import ru.x5tech.hrautomatization.entity.application.DirectionStatus;

import java.util.List;

/**
 * <br>
 * <strong>
 * Author: Дмитрий Николаенков (laplas7)
 * Creation date: 18.12.2025 00:26
 * </strong>
 */
@Mapper(componentModel = "spring")
public interface DirectionStatusMapper {

    DirectionStatusResponse toDto(DirectionStatus status);

    List<DirectionStatusResponse> toDtoList(List<DirectionStatus> statuses);
}
