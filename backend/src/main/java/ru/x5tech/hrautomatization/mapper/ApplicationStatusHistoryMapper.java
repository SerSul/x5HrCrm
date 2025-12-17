package ru.x5tech.hrautomatization.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import ru.x5tech.hrautomatization.dto.direction.ApplicationStatusHistoryResponse;
import ru.x5tech.hrautomatization.entity.application.ApplicationStatusHistory;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ApplicationStatusHistoryMapper {

    @Mapping(target = "statusId", source = "directionStatus.id")
    @Mapping(target = "statusTitle", source = "directionStatus.title")
    @Mapping(target = "changedByUserId", source = "changedBy.id")
    @Mapping(target = "changedAt", source = "changedAt")
    @Mapping(target = "comment", source = "comment")
    ApplicationStatusHistoryResponse toDto(ApplicationStatusHistory history);

    List<ApplicationStatusHistoryResponse> toDtoList(List<ApplicationStatusHistory> histories);
}
