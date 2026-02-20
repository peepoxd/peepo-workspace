FROM ghcr.io/graalvm/graalvm-community:21 AS builder

WORKDIR /app
COPY pom.xml .
COPY mvnw .
COPY .mvn .mvn
RUN chmod +x mvnw

COPY src ./src

RUN ./mvnw clean package -Pnative -DskipTests

FROM ubuntu:22.04

RUN apt-get update && \
    apt-get install -y ca-certificates && \
    rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/target/order-management-api /app/order-management-api

EXPOSE 8080

ENTRYPOINT ["/app/order-management-api"]