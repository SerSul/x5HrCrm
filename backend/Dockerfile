# Stage 1: Build
FROM gradle:8.12.0-jdk21-alpine AS build
WORKDIR /app

# Копируем gradle wrapper и dependencies
COPY gradle gradle
COPY gradlew .
COPY build.gradle settings.gradle ./

# Кэшируем зависимости
RUN gradle dependencies --no-daemon || true

# Копируем исходный код
COPY src ./src

# Собираем приложение
RUN gradle bootJar --no-daemon

# Stage 2: Runtime
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Создаём непривилегированного пользователя
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# Копируем JAR из build stage
COPY --from=build /app/build/libs/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
