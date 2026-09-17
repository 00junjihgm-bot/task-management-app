# --- ステップ 1: ビルドステージ ---
FROM maven:3.9-eclipse-temurin-21 AS builder
WORKDIR /app

COPY . .
RUN mvn clean package -DskipTests

# --- ステップ 2: 実行ステージ ---
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

COPY --from=builder /app/target/*.jar app.jar
RUN mkdir -p /data

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]