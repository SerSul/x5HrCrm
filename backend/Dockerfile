# Stage 1: Build
FROM gradle:8.12.0-jdk21-alpine AS build
WORKDIR /app

# Копируем весь проект сразу
COPY . .

# Всегда чистим и собираем
RUN ./gradlew clean bootJar --no-daemon
# или: RUN gradle clean bootJar --no-daemon

# Stage 2: Runtime
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

COPY --from=build /app/build/libs/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
