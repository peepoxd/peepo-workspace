# E-Commerce Microservices

Spring Boot Microservices Demo — E-Commerce order flow with Kafka, gRPC, Redis, and API Gateway.

## Architecture

```
Client (Postman)
    |
    v
+──────────────+
|  API Gateway | :8080
+──────┬───────+
       |
   +───┼───────────────+
   |   |               |
   v   v               v
+──────+ +───────+ +──────+
| Auth | |Product| |Order |
|:8081 | | :8082 | |:8083 |
+──────+ +───────+ +──┬───+
   ^                   |
   | gRPC              | Kafka
   | (verify)          v
   |            +─────────────+
   +────────────|    Kafka    | :9092
                +──────┬──────+
                   +───┴───+
                   v       v
             +─────────+ +────────────+
             |Inventory| |Notification|
             |  :8084  | |   :8085    |
             +─────────+ +────────────+
```

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Spring Boot 3.2.5 | Application framework |
| Spring Cloud Gateway | API Gateway |
| Spring Kafka | Event-driven messaging |
| Spring Security + JWT | Authentication |
| Spring Data JPA + H2 | Database (per service) |
| Redis | Distributed caching |
| Docker Compose | Infrastructure |
| Zipkin | Distributed tracing |

## Services

| Service | Port | Description | Status |
|---------|------|-------------|--------|
| api-gateway | 8080 | Routes requests to services | Routes configured |
| auth-service | 8081 | JWT auth, user management | Register + Login + JWT |
| product-service | 8082 | Product catalog, Redis cache | CRUD + caching + seed data |
| order-service | 8083 | Orders, Kafka producer | Create + status + Kafka events |
| inventory-service | 8084 | Stock management, Kafka consumer | Stock check + auto-deduct |
| notification-service | 8085 | Notifications, Kafka consumer | Event logging + history |

## Quick Start

```bash
# 1. Start infrastructure (Kafka, Redis, Zipkin)
docker-compose up -d

# 2. Build all services
mvn clean compile

# 3. Run each service (separate terminals)
cd auth-service && mvn spring-boot:run
cd product-service && mvn spring-boot:run
cd order-service && mvn spring-boot:run
cd inventory-service && mvn spring-boot:run
cd notification-service && mvn spring-boot:run
cd api-gateway && mvn spring-boot:run
```

## API Reference

### Auth Service (:8081)

```bash
# Register
curl -X POST http://localhost:8081/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"john","password":"secret123","email":"john@demo.com"}'

# Login
curl -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"john","password":"secret123"}'
```

### Product Service (:8082)

```bash
# List products (paginated, 10 pre-seeded)
curl http://localhost:8082/api/products

# Get product by ID (cached in Redis)
curl http://localhost:8082/api/products/1

# Create product
curl -X POST http://localhost:8082/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"New Product","price":29.99,"stock":100,"category":"Test"}'

# Update product (cache evicted)
curl -X PUT http://localhost:8082/api/products/1 \
  -H "Content-Type: application/json" \
  -d '{"price":1899.99}'

# Delete product
curl -X DELETE http://localhost:8082/api/products/1
```

### Order Service (:8083)

```bash
# Create order (publishes Kafka event → inventory deducts + notification logs)
curl -X POST http://localhost:8083/api/orders \
  -H "Content-Type: application/json" \
  -d '{"userId":1,"productId":1,"quantity":2,"totalPrice":3999.98}'

# Get order by ID
curl http://localhost:8083/api/orders/1

# List orders by user
curl http://localhost:8083/api/orders?userId=1

# Update order status
curl -X PUT http://localhost:8083/api/orders/1/status \
  -H "Content-Type: application/json" \
  -d '{"status":"CONFIRMED"}'
```

### Inventory Service (:8084)

```bash
# Check stock (10 products pre-seeded)
curl http://localhost:8084/api/inventory/1

# List all inventory
curl http://localhost:8084/api/inventory
```

### Notification Service (:8085)

```bash
# List all notifications
curl http://localhost:8085/api/notifications

# List by user
curl http://localhost:8085/api/notifications?userId=1
```

### Health Checks

```bash
curl http://localhost:8081/api/auth/health
curl http://localhost:8082/api/products/health
curl http://localhost:8083/api/orders/health
curl http://localhost:8084/api/inventory/health
curl http://localhost:8085/api/notifications/health
```

## End-to-End Flow

```
1. POST /api/auth/register     → Create account, get JWT token
2. POST /api/auth/login        → Login, get fresh JWT
3. GET  /api/products          → Browse 10 pre-seeded products
4. POST /api/orders            → Place order
   ├→ Order saved (status: PENDING)
   ├→ Kafka event "order.created" published
   ├→ Inventory Service consumes → deducts stock
   └→ Notification Service consumes → logs confirmation
5. GET  /api/inventory/1       → Verify stock was deducted
6. GET  /api/notifications     → See notification history
7. GET  /api/orders/1          → Check order status
```

## Project Structure

```
ecommerce-microservices/
├── pom.xml                    # Parent POM (multi-module)
├── docker-compose.yml         # Kafka + Redis + Zipkin
├── common/                    # Shared DTOs, exceptions
│   ├── dto/ApiResponse, OrderEvent
│   └── exception/GlobalExceptionHandler, ResourceNotFoundException
├── api-gateway/               # Spring Cloud Gateway
│   └── routes → auth, product, order, inventory
├── auth-service/              # JWT + user management
│   ├── entity/User
│   ├── dto/RegisterRequest, LoginRequest, AuthResponse
│   ├── service/AuthService
│   ├── security/JwtTokenProvider, JwtAuthFilter, UserDetailsServiceImpl
│   └── config/SecurityConfig, JwtProperties
├── product-service/           # Catalog + Redis cache
│   ├── entity/Product
│   ├── dto/CreateProductRequest, UpdateProductRequest
│   ├── service/ProductService (@Cacheable, @CacheEvict)
│   └── data.sql (10 seed products)
├── order-service/             # Orders + Kafka producer + Circuit Breaker
│   ├── entity/Order (PENDING→CONFIRMED→SHIPPED→DELIVERED)
│   ├── dto/CreateOrderRequest
│   ├── client/InventoryClient (@CircuitBreaker + fallback)
│   └── service/OrderService (KafkaTemplate + stock check)
├── inventory-service/         # Stock + Kafka consumer
│   ├── entity/Inventory (quantity, reserved, getAvailable())
│   ├── service/InventoryService
│   ├── kafka/OrderEventConsumer
│   └── data.sql (10 seed items)
└── notification-service/      # Notifications + Kafka consumer
    ├── model/Notification (in-memory)
    ├── service/NotificationService
    └── kafka/OrderEventConsumer
```

## Concepts Demonstrated

| # | Concept | Where | Interview Question |
|---|---------|-------|--------------------|
| 1 | API Gateway | api-gateway | "Why use an API Gateway?" |
| 2 | JWT Authentication | auth-service | "How does JWT work in microservices?" |
| 3 | Event-Driven (Kafka) | order → inventory, notification | "Kafka vs RabbitMQ?" |
| 4 | Async Processing | Kafka consumers | "When sync vs async?" |
| 5 | Database-per-Service | Each service has own H2 DB | "Data consistency across services?" |
| 6 | Redis Caching | product-service | "Cache invalidation strategy?" |
| 7 | Docker Compose | Infrastructure orchestration | "How to deploy microservices?" |
| 8 | gRPC (inter-service) | Planned: auth ↔ order | "Why gRPC over REST?" |
| 9 | Circuit Breaker | order-service → inventory (Resilience4j) | "What if a service goes down?" |
| 10 | Distributed Tracing | Zipkin + Micrometer across all services | "How to debug across services?" |

## Implementation Status

- [x] Phase 1: Project scaffold (multi-module Maven)
- [x] Phase 2: Auth Service (JWT + register/login)
- [x] Phase 3: Product Service (CRUD + Redis cache + seed data)
- [x] Phase 4: Order Service (Kafka producer + status tracking)
- [x] Phase 5: Inventory Service (Kafka consumer + stock deduction)
- [x] Phase 6: Notification Service (Kafka consumer + event logging)
- [x] Phase 7: API Gateway routing (partial — no JWT validation yet)
- [x] Phase 8: Resilience + Observability (Resilience4j Circuit Breaker, Zipkin tracing)
- [ ] Phase 9: Docker Compose full setup (Dockerfiles for services)
- [x] Phase 10: Unit tests (20 tests — AuthService 5, ProductService 8, OrderService 7)
