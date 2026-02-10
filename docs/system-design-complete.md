# System Design Complete Guide

> สรุปจากการคุยกับ Gemini + Peepo Oracle (2026-02-10)
> เตรียมสัมภาษณ์ TTIB — Junior Software Developer

---

## 1. Container Repo (Multi-Repo Strategy)

แยก repo ตาม service แล้วรวมกันด้วย `git submodule` หรือ `docker-compose`

```
main-orchestrator/          <- repo หลัก (docker-compose + config)
├── java-app-service/       <- submodule (Spring Boot)
├── python-rag-service/     <- submodule (AI/RAG)
├── custom-cache-server/    <- submodule (Rust/Go)
├── angular-web-app/        <- submodule (Frontend)
└── docker-compose.yml      <- เชื่อมทุกอย่าง
```

**จุดเด่น**: แต่ละ repo deploy แยกกัน, ใช้ภาษาต่างกันได้, scale เฉพาะจุด

---

## 2. สามระดับ Architecture

| ระดับ | Pattern | คุมอะไร | เปรียบเหมือน |
|-------|---------|---------|-------------|
| **Global** | **Microservices** | แยก Server/Container | ผังเมือง |
| **Conceptual** | **DDD** | แยกขอบเขตธุรกิจ | กฎหมายผังเมือง |
| **Local** | **Clean Architecture** | แยกชั้นโค้ดภายใน | แบบแปลนอาคาร |

### ความเข้ากัน

- **DDD + Microservices**: Bounded Context -> 1 Microservice
- **DDD + Clean Architecture**: Domain Layer (Clean) = Domain Model (DDD)
- **Clean + Microservices**: โค้ดภายในสะอาด + Deploy แยกกันได้

### ถ้าขาดตัวใดตัวหนึ่ง

- ไม่มี DDD -> "Distributed Monolith" (แยกเครื่องแต่ DB พันกัน)
- ไม่มี Clean -> Logic ผูกติด Framework (เปลี่ยน DB ต้องรื้อหมด)
- ไม่มี Microservices -> "Modular Monolith" (โค้ดสวยแต่ scale ไม่ได้)

---

## 3. Clean Architecture (ภายใน 1 Service)

```
src/
├── core/               <- Domain Layer (Business Logic, ห้ามพึ่ง Library)
│   ├── entity/         <- Model ข้อมูล
│   ├── usecase/        <- Logic หลัก
│   └── port/           <- Interface (สัญญา)
├── infrastructure/     <- Data Layer (คุยโลกภายนอก)
│   ├── grpc/           <- เชื่อม Python
│   ├── cache/          <- เชื่อม Cache Server
│   ├── persistence/    <- เชื่อม DB
│   └── resilience/     <- Circuit Breaker, Fallback
└── presentation/       <- UI Layer (รับ Request)
    ├── controller/     <- REST API
    └── dto/            <- Request/Response Objects
```

### ใช้กับ Frontend ได้เหมือนกัน

**Angular:**
```
src/app/
├── core/               <- Domain Layer
│   ├── models/         <- Interfaces
│   ├── services/       <- Business Logic / Use Cases
│   └── guards/         <- Auth & Security
├── data/               <- Infrastructure Layer
│   ├── api/            <- HttpClient calls
│   ├── repositories/   <- Data mapping
│   └── store/          <- State (RxJS / NgRx)
├── features/           <- Presentation Layer
│   ├── chat/
│   └── history/
└── shared/             <- Reusable UI Components
```

**Flutter:**
```
lib/
├── features/
│   └── chat_rag/
│       ├── domain/
│       │   ├── entities/
│       │   ├── usecases/
│       │   └── repositories/
│       ├── data/
│       │   ├── models/
│       │   ├── repositories/
│       │   └── datasources/
│       └── presentation/
│           ├── bloc/
│           └── pages/
└── core/
```

---

## 4. การสื่อสารระหว่าง Service

| วิธี | ลักษณะ | เหมาะกับ |
|------|--------|---------|
| **gRPC** | Sync (รอคำตอบ), HTTP/2, Binary | Java <-> Python RAG, ต้องเร็ว |
| **Message Broker** | Async (ไม่รอ) | ส่ง Email, Log, งานเบื้องหลัง |
| **REST API** | Sync (HTTP/JSON) | Frontend <-> Backend |
| **GraphQL** | Sync, query language | Frontend ดึงเฉพาะ field ที่ต้องการ |
| **WebSocket** | Real-time 2-way | Chat, Live updates |
| **SSE** | Real-time 1-way | AI streaming response |

### gRPC Concept
- คุยระหว่าง service แบบ Request-Response
- ใช้ `.proto` file เป็น "สัญญา" (Contract)
- Type-safe ทั้ง Java และ Python
- ต้อง handle error + rollback เอง (Compensating Transaction)

### Message Broker Concept
- ไม่รอ — ส่งแล้วไปทำงานต่อ
- ถ้า error ใช้ **Saga Pattern** ส่ง message ย้อนกลับ
- A -> B -> C: ถ้า C fail -> ส่ง "undo" กลับ B -> A

---

## 5. ท่อ (Message Broker) ประเภทต่างๆ

| ท่อ | หน้าที่ | ตัวอย่าง |
|-----|--------|---------|
| **Task Queue** | ส่งงานให้ Service อื่นทำ | `rag-request` |
| **Event Bus** (Pub/Sub) | กระจายข่าว | `data-updated` |
| **Notification Queue** | แจ้ง User | `user-notification` |
| **Dead Letter Queue** | เก็บงานที่ fail | `failed-tasks-dlq` |
| **Retry Queue** | ลองใหม่เมื่อ error | `retry-5min` |
| **Audit Log Queue** | เก็บประวัติ | `system-logs` |
| **Cache Invalidation** | สั่งลบ cache เก่า | `cache-invalidation` |

### Message vs Notification
- **Message**: "คำสั่งงาน" Machine-to-Machine
- **Notification**: "รายงานผล" Machine-to-Human

---

## 6. Cache Server

### ภาษาที่นิยมเขียน Cache Server
- **C/C++**: Redis, Memcached (จัดการ Memory ละเอียด)
- **Rust**: Pelikan (Twitter), Pingora (Cloudflare) — เร็ว+ปลอดภัย
- **Go**: Groupcache (Google) — เขียนง่าย, Goroutines

### รูปแบบการเก็บข้อมูล
1. **Key-Value (String)**: Session, API response cache
2. **Structured (Hash/Map)**: Auth token, user settings
3. **Vector Embeddings**: Semantic cache สำหรับ RAG

### Cache Strategies
| กลยุทธ์ | การทำงาน | เหมาะกับ |
|---------|---------|---------|
| **TTL** | หมดอายุตามเวลา | ข้อมูลเปลี่ยนบ่อย |
| **LRU** | ลบตัวที่ไม่ได้ใช้นานสุด | คุมขนาด RAM |
| **Write-Through** | เขียน Cache + DB พร้อมกัน | ต้องการ consistency สูง |
| **Cache-Aside** | เช็ค cache ก่อน ไม่มีค่อยไป DB | ใช้ทั่วไป |

### Use Cases
- Session / Auth Token
- RAG result (Semantic Caching)
- Rate Limiting counter
- Configuration / Feature Flags
- Aggregated data (Dashboard)

### Spring Boot Integration
```java
@Cacheable("ragResults")  // เช็ค cache ก่อน
@CachePut("ragResults")   // อัพเดท cache
@CacheEvict("ragResults") // ลบ cache
```

---

## 7. Cache Level Architecture

```
L1: In-app cache (@Cacheable, in-memory)
    -> เร็วสุด แต่ไม่ share ข้าม instance

L2: Distributed cache (Redis / Custom Server)
    -> ช้ากว่า L1 นิดหน่อย แต่ทุก service เห็นเหมือนกัน

L3: CDN cache (CloudFlare, CloudFront)
    -> สำหรับ static files (JS, CSS, images)
```

---

## 8. Database per Service

แต่ละ service มี DB ของตัวเอง — ห้ามข้าม DB โดยตรง

```
Java App Service  -> PostgreSQL (Relational)
Python RAG        -> ChromaDB (Vector DB)
Cache Server      -> In-memory (RAM)
Auth Service      -> PostgreSQL (separate)
```

### ถ้าต้องการข้อมูลจาก service อื่น
1. **API/gRPC Call**: ถามตรงๆ (sync)
2. **Event-Driven**: ส่ง message ผ่าน broker (async)
3. **API Gateway Aggregation**: Gateway รวมข้อมูลจากหลาย service

---

## 9. CQRS (Command Query Responsibility Segregation)

แยก **เขียน** กับ **อ่าน** ออกจากกัน

| ฟีเจอร์ | Command (เขียน) | Query (อ่าน) |
|---------|----------------|-------------|
| เป้าหมาย | Change State | View State |
| Logic | ซับซ้อน (Business Rules) | ง่าย (แค่จัดรูป) |
| Database | PostgreSQL (SQL) | Redis/Elasticsearch |
| ตัวอย่าง | `postAnswer()` | `getChatHistory()` |

### เหมาะกับ RAG เพราะ
- **Command**: User ส่งคำถาม -> หนัก, ช้า (AI processing)
- **Query**: User ดูประวัติ -> เร็วมาก (อ่านจาก cache)
- การที่ AI ทำงานหนัก (Command) จะไม่ทำให้ Query ช้า

### ข้อควรระวัง
- **Eventual Consistency**: ข้อมูลฝั่งอ่านอาจ delay เสี้ยววินาที

---

## 10. Advanced Design Patterns

| Pattern | ระดับที่คุม | เข้ากันกับ |
|---------|-----------|-----------|
| **CQRS** | Data Flow | Clean Architecture |
| **Event Sourcing** | Persistence | DDD + Message Broker |
| **Hexagonal** (Ports & Adapters) | Code Structure | Microservices |
| **Saga Pattern** | Transaction | Microservices + Message Broker |
| **Outbox Pattern** | Data Integrity | เขียน DB + event ใน transaction เดียว |
| **CDC** (Change Data Capture) | Data Sync | ดักจับ DB changes -> stream |

### วิวัฒนาการ (Evolution Path)
1. **Start**: Clean Architecture ใน Monolith
2. **Grow**: เพิ่ม DDD แบ่งขอบเขต
3. **Scale**: ตัดเป็น Microservices
4. **Advance**: เพิ่ม CQRS / Event Sourcing

---

## 11. Resilience Patterns (ถอดปลั๊กได้)

| Pattern | ทำอะไร |
|---------|--------|
| **Circuit Breaker** | ตัดไฟเมื่อ Service ล่ม (Resilience4j) |
| **Graceful Degradation** | ลด feature แต่ยังรันได้ (Netflix style) |
| **Feature Toggle** | เปิด/ปิด Service ผ่าน `.env` |
| **Fallback** | ใช้ค่า default เมื่อ AI ล่ม |
| **Health Check** | `/health` endpoint บอกสถานะ service |
| **Retry with Backoff** | ลองใหม่แบบเว้นระยะ |
| **Bulkhead** | แยก thread pool ไม่ให้ service หนึ่งดึง resource ทั้งหมด |

---

## 12. Over-Engineering vs Portfolio

### Production (ของจริง)
- เริ่มง่าย ค่อยเพิ่ม (YAGNI / KISS)
- แก้ปัญหาที่เจอ "ตอนนี้"
- Modular Monolith -> แยก Microservices ทีหลัง

### Portfolio (โชว์ของ)
- ใส่เต็มได้ เพราะ **โชว์ว่ารู้**
- ต้องอธิบาย **ทำไม** ถึงเลือกใช้
- ทำให้ **รันได้จริง** (`docker-compose up`)
- มี **Test** พิสูจน์

---

## 13. FULL SYSTEM DESIGN TREE

```
SYSTEM DESIGN -- FULL PICTURE
|
+-- EDGE (ชั้นนอกสุด)
|   +-- DNS (CloudFlare, Route53)
|   +-- CDN (Static files, caching)
|   +-- SSL/TLS (HTTPS)
|   +-- WAF (Web Application Firewall)
|   +-- DDoS Protection
|
+-- GATEWAY (หน้าด่าน)
|   +-- API Gateway (Kong, Spring Cloud Gateway)
|   +-- Load Balancer (Nginx, HAProxy)
|   +-- Rate Limiting
|   +-- Auth (OAuth2/JWT verification)
|   +-- CORS Policy
|   +-- Request Routing
|
+-- APPLICATION LAYER (Microservices)
|   +-- Java App Service (Spring Boot)
|   |   +-- Clean Architecture (core/infra/presentation)
|   +-- Python RAG Service (FastAPI/gRPC)
|   |   +-- Vector DB + LLM + Guardrails
|   +-- Auth Service (OAuth2/OIDC)
|   +-- Notification Service (Email/Push/SMS)
|   +-- File Service (Upload/Download)
|
+-- COMMUNICATION (ท่อ)
|   +-- Sync: gRPC, REST, GraphQL
|   +-- Async: RabbitMQ, Kafka
|   +-- Real-time: WebSocket, SSE
|   +-- Patterns: Saga, Outbox, CDC
|   +-- Service Mesh (Istio) -- mTLS, retry
|
+-- CACHE LAYER
|   +-- L1: In-app cache (@Cacheable)
|   +-- L2: Distributed cache (Redis/Custom)
|   +-- L3: CDN cache (static assets)
|   +-- Strategies: TTL, LRU, Write-through
|
+-- DATA LAYER
|   +-- SQL: PostgreSQL (ACID, transactions)
|   +-- NoSQL: MongoDB (flexible schema)
|   +-- Vector DB: ChromaDB (AI embeddings)
|   +-- Search: Elasticsearch
|   +-- Object Storage: S3/MinIO (files)
|   +-- Patterns: Sharding, Replica, Migration
|   +-- CQRS: Write DB != Read DB
|
+-- OBSERVABILITY (3 Pillars)
|   +-- Logs: ELK Stack / Loki
|   +-- Metrics: Prometheus + Grafana
|   +-- Traces: OpenTelemetry + Jaeger
|   +-- Alerts: PagerDuty / Slack
|
+-- SECURITY
|   +-- OAuth2 / OIDC / JWT
|   +-- RBAC (Role-Based Access)
|   +-- Secrets: HashiCorp Vault
|   +-- API Key Management
|   +-- Zero Trust Network
|
+-- CI/CD & DEVOPS
|   +-- CI: GitHub Actions (build+test)
|   +-- CD: ArgoCD (auto deploy)
|   +-- IaC: Terraform (infra as code)
|   +-- Container: Docker + Kubernetes
|   +-- Deploy: Blue/Green, Canary, Rolling
|   +-- GitOps: Git = source of truth
|
+-- TESTING
|   +-- Unit (JUnit, pytest, Jest)
|   +-- Integration (TestContainers)
|   +-- E2E (Playwright, Cypress)
|   +-- Contract (Pact)
|   +-- Load (k6, JMeter)
|   +-- Chaos (Chaos Monkey)
|
+-- AI/ML OPS
    +-- Model Serving (Triton, TorchServe)
    +-- Vector DB + Embeddings
    +-- Prompt Management
    +-- Feature Store (Feast)
    +-- Guardrails (Safety)
```

---

## 14. Server Type -> Best Language

| Server | ภาษาที่แนะนำ | เหตุผล |
|--------|-------------|--------|
| DNS / Web Server | C, Rust, Go | High throughput, concurrency |
| App Server | Java, Kotlin, C# | Business logic, ecosystem |
| Load Balancer / Proxy | Go, Rust | Network handling |
| Cache Server | Rust, Go, C++ | Memory management |
| Database Server | C++, Rust | Low-level storage |
| File Server | Go, C++ | I/O streaming |
| RAG / AI Server | Python | ML library ecosystem |
| API Gateway | Go, Java | Routing + middleware |

---

## 15. DDD + Clean Architecture ตำแหน่งในโค้ด

```
[ PROJECT ] <<--- DDD คุมระดับนี้ (แบ่ง Bounded Context)
|
+-- JAVA-SERVICE <<--- Clean Architecture คุมระดับนี้
|   +-- Core (Domain)      <-- DDD Entities อยู่ที่นี่
|   +-- Infrastructure      <-- Adapters อยู่ที่นี่
|   +-- Presentation        <-- Entry points อยู่ที่นี่
|
+-- ANGULAR-WEB  <<--- Clean Architecture คุมระดับนี้
|   +-- Core (Domain)      <-- Frontend Business Logic
|   +-- Data (Infra)       <-- API Clients
|   +-- Features (UI)      <-- Components
|
+-- MESSAGE BROKER / gRPC <<--- Context Mapping ใน DDD
```

---

## 16. Networking & Edge (ขาดจาก Gemini)

| Concept | คืออะไร | ทำไมต้องมี |
|---------|---------|------------|
| **CDN** | Cache static files ใกล้ User | ลด latency |
| **SSL/TLS** | HTTPS encryption | ความปลอดภัย |
| **WebSocket / SSE** | Real-time communication | Chat, AI streaming |
| **GraphQL** | Query language for API | ดึงเฉพาะ field ที่ต้องการ |

---

## 17. Security (ขาดจาก Gemini)

| Concept | คืออะไร |
|---------|---------|
| **OAuth2 / OIDC** | มาตรฐาน Login (Google, GitHub) |
| **JWT** | Stateless Auth Token |
| **RBAC** | Admin/User/Viewer แยกสิทธิ์ |
| **API Key + Rate Limiting** | ป้องกัน abuse |
| **CORS** | ควบคุม domain ที่เรียก API ได้ |
| **Secrets Management** | Vault, .env, GitHub Secrets |
| **Zero Trust** | ไม่เชื่อใจ traffic ใดๆ default |

---

## 18. Observability — 3 Pillars (ขาดจาก Gemini)

```
+------+----------+-------------------+
| Logs | Metrics  | Traces            |
| ELK  | Prometheus| OpenTelemetry    |
| Loki | Grafana  | Jaeger/Zipkin     |
+------+----------+-------------------+
```

- **Logs**: บันทึกเหตุการณ์
- **Metrics**: ตัวเลขสุขภาพระบบ (CPU, RAM, latency)
- **Traces**: ตาม request ข้าม service
- **Alerting**: แจ้งเตือนเมื่อผิดปกติ

---

## 19. CI/CD & DevOps (ขาดจาก Gemini)

| Concept | คืออะไร |
|---------|---------|
| **CI** (GitHub Actions) | Build + Test อัตโนมัติทุก push |
| **CD** (ArgoCD) | Deploy อัตโนมัติ |
| **GitOps** | Infra ถูกควบคุมผ่าน Git |
| **Blue/Green** | เปิด version ใหม่คู่กับเก่า สลับทีเดียว |
| **Canary** | ปล่อย version ใหม่ให้ 5% user ก่อน |
| **Rolling Update** | อัพทีละ pod ไม่ downtime |
| **IaC** (Terraform) | สร้าง infra จาก code |

---

## 20. Container Orchestration (ขาดจาก Gemini)

```
docker-compose (dev)
       | production
       v
Kubernetes (K8s)
+-- Pod (1+ containers)
+-- Service (networking)
+-- Ingress (load balancer)
+-- ConfigMap / Secret
+-- HPA (auto-scaling)
+-- Helm Charts (package manager)

Service Mesh (Istio/Linkerd)
+-- mTLS (encryption ระหว่าง service)
+-- Traffic management
+-- Retry / Timeout policies
+-- Observability built-in
```

---

## 21. Testing Strategy (ขาดจาก Gemini)

```
Testing Pyramid:

        /\
       /  \   E2E Tests (Playwright, Cypress)
      /    \   น้อยแต่สำคัญ
     /------\
    / Integra \   Integration Tests
   /  tion     \   (TestContainers)
  /--------------\
 /   Unit Tests    \  มากที่สุด
/____________________\ (JUnit, pytest, Jest)
```

- **Contract Testing** (Pact): ตรวจ API spec ตรงกัน
- **Load Testing** (k6): รับโหลดได้แค่ไหน
- **Chaos Testing** (Chaos Monkey): จงใจพัง service ดูว่ารอดไหม

---

## 22. Data Patterns เพิ่มเติม (ขาดจาก Gemini)

| Pattern | คืออะไร | เมื่อไหร่ใช้ |
|---------|---------|-------------|
| **Outbox Pattern** | เขียน DB + event ใน transaction เดียว | ป้องกัน message หาย |
| **CDC** | ดักจับ DB changes -> stream | Sync data ข้าม service |
| **Idempotency** | ทำซ้ำกี่ครั้งก็ผลเท่าเดิม | Payment, API retry |
| **Distributed Lock** | ล็อคข้าม service (Redis) | ป้องกัน race condition |
| **DB Migration** | Flyway/Liquibase | Version control schema |
| **Connection Pooling** | HikariCP | Reuse DB connections |
| **Sharding** | แบ่ง DB ตาม key | Data มหาศาล |
| **Read Replica** | DB สำรองสำหรับอ่าน | ลดโหลด master |

---

## 23. Cloud Native (ขาดจาก Gemini)

| Concept | คืออะไร |
|---------|---------|
| **12-Factor App** | 12 หลักการ cloud-native app |
| **Serverless** (Lambda) | รันเฉพาะตอนมี request |
| **Object Storage** (S3/MinIO) | เก็บไฟล์/รูปภาพ |
| **Config Service** (Consul) | Config กลางสำหรับทุก service |
| **Feature Flags** (Unleash) | เปิด/ปิด feature โดยไม่ deploy |

---

## 24. AI/ML Infrastructure (ขาดจาก Gemini)

| Concept | คืออะไร |
|---------|---------|
| **MLOps** | CI/CD สำหรับ ML model |
| **Model Serving** (Triton) | Deploy model เป็น API |
| **Feature Store** (Feast) | เก็บ features สำหรับ ML |
| **Vector DB** (Chroma, Pinecone) | เก็บ embeddings สำหรับ RAG |
| **Prompt Management** | Version control prompts |
| **Guardrails** | ป้องกัน AI ตอบผิด/อันตราย |

---

## 25. Portfolio Showcase Checklist

| ส่วนประกอบ | สกิลที่โชว์ | ความสำคัญ |
|-----------|-----------|----------|
| Separated Repos + Submodules | Microservices & DevOps | สูงมาก |
| Clean Architecture | Clean Code & Maintainability | สูงมาก |
| gRPC / Protocol Buffers | High Performance Communication | สูง |
| Custom Cache Server (Rust/Go) | Low-level System Programming | จุดขายพิเศษ |
| Resilience (Fallback/Circuit Breaker) | Senior Architect Mindset | สูงมาก |
| docker-compose up (รันได้จริง) | Full-Stack DevOps | จุดที่ทำให้ได้งาน |
| Unit + Integration Tests | Quality Assurance | สูง |
| CI/CD Pipeline | Automation | ปานกลาง |
| Observability (Logs/Metrics) | Production Readiness | ปานกลาง |
| README + Architecture Diagram | Communication Skills | สูงมาก |

---

## 26. TTIB Interview Quick Reference

### บริษัท TTIB
- **TT Insurance Broker (Thailand)** — เครือ Toyota Tsusho (ญี่ปุ่น)
- นายหน้าประกันภัย, 20 ปี, ได้รางวัล Best Insurance Broker 2024
- Tech stack เว็บ: WordPress + PHP
- ISO 9001 / ISO 14001

### คำถามที่เก็งไว้
1. แนะนำตัว + โปรเจค
2. OOP 4 หลัก, SOLID Principles
3. REST API, HTTP Methods
4. SQL JOIN, INDEX, Normalization
5. Git workflow, branching strategy
6. Docker basics
7. Design patterns (Singleton, Factory, Observer)
8. Spring Boot annotations
9. ทำไมถึงสนใจ TTIB?
10. จุดแข็ง/จุดอ่อน?

### คำถามที่ควรถามกลับ
- ทีม dev มีกี่คน? Tech stack อะไร?
- มี code review / CI/CD?
- มี training สำหรับ junior?

---

---

# PART 2: Deep Dive (จาก Web Research 2025-2026)

> ข้อมูลเพิ่มเติมระดับ Senior — เอาไว้อ่านเสริมและตอบคำถามเชิงลึก

---

## 27. Observability — Deep Dive

### OpenTelemetry (OTel) — มาตรฐาน 2025

CNCF-graduated, vendor-neutral framework ที่รวม Logs + Metrics + Traces ไว้ด้วยกัน

```
App --[OTel SDK]--> OTel Collector --> Grafana Stack (Loki + Prometheus + Tempo)
                                  --> Datadog / Honeycomb (commercial)
```

**Key Concepts:**
- **Trace**: การเดินทางทั้งหมดของ 1 request ข้าม services
- **Span**: หน่วยงานย่อย 1 อันใน trace
- **Context Propagation**: ส่ง trace ID ข้าม service ผ่าน W3C `traceparent` header

**Structured Log Format (ใช้ JSON เสมอใน production):**
```json
{
  "timestamp": "2026-01-15T10:30:00Z",
  "level": "ERROR",
  "service": "order-service",
  "trace_id": "4bf92f3577b34da6",
  "span_id": "00f067aa0ba902b7",
  "message": "Payment processing failed",
  "error": "timeout after 5000ms"
}
```

**คำถามสัมภาษณ์:**
- Log กับ Trace เชื่อมกันได้ยังไง? → ใส่ `trace_id` ใน log field
- Cardinality คืออะไร? → label ที่มีค่าเยอะเกินทำให้ storage ระเบิด
- RED Method: Rate / Errors / Duration
- USE Method: Utilization / Saturation / Errors

---

## 28. Security — Deep Dive

### OAuth2 Grant Types

| Grant Type | ใช้กับ |
|-----------|--------|
| Authorization Code + PKCE | Browser/mobile app (user login) |
| Client Credentials | Machine-to-machine (service-to-service) |
| Device Code | CLI, IoT |
| Refresh Token | ต่ออายุ session |

### JWT Validation Steps (ทุก service ต้องทำ)

1. Verify signature ด้วย public key (JWKS endpoint)
2. Check `exp` (ยังไม่หมดอายุ)
3. Check `iss` (issuer ที่เชื่อถือ)
4. Check `aud` (audience ตรงกับ service นี้)

### Authorization Models

| Model | วิธีทำงาน | เหมาะกับ |
|-------|----------|---------|
| **RBAC** | User มี role, role มี permission | Permission ง่ายๆ |
| **ABAC** | ดู attribute (user, resource, env) | Rule ซับซ้อน |
| **ReBAC** | ดู relationship (Zanzibar model) | Google Docs sharing style |

**Tools:** Open Policy Agent (OPA), Casbin, Cerbos

### Zero Trust Architecture

> "Never trust, always verify"

- **mTLS**: ทั้ง 2 ฝั่งยืนยันตัวตนด้วย certificate
- **Service Identity**: ทุก service มี cryptographic identity
- **Least Privilege**: Token มี scope เท่าที่จำเป็น
- **Short-lived credentials**: หมุน token/cert บ่อยๆ

Service Mesh (Istio/Linkerd) ทำ mTLS อัตโนมัติ ไม่ต้องแก้โค้ด

---

## 29. CI/CD — Deep Dive

### GitOps (Pull-based)

```
Git Repo (desired state) <-- ArgoCD watches --> K8s Cluster (actual state)
                                              (reconcile drift ตลอดเวลา)
```

**ข้อดี**: audit history ครบ, rollback = `git revert`, DR = สร้าง cluster ใหม่จาก Git

### Deployment Strategies

| Strategy | วิธีทำงาน | ความเสี่ยง |
|----------|---------|-----------|
| **Rolling Update** | เปลี่ยน pod ทีละตัว (K8s default) | ปานกลาง |
| **Blue/Green** | สลับ environment ทีเดียว | ต่ำ |
| **Canary** | ปล่อย 5% → 25% → 100% | ต่ำมาก |
| **Shadow Traffic** | Mirror traffic ไป version ใหม่ (ไม่ใช้ผลจริง) | ไม่มี |
| **Feature Flags** | Deploy code dark, toggle runtime | ต่ำมาก |

### CI/CD Pipeline 2025

```
Code Push
  -> Lint + Unit Tests (< 5 min)
  -> Build Container Image
  -> Scan Image (Trivy for CVEs)
  -> Push to Registry (GHCR/ECR)
  -> Update GitOps Repo (image tag)
  -> ArgoCD deploys to Staging
  -> Integration + Contract Tests
  -> Metrics gate (auto check)
  -> Canary to Production (5% -> 25% -> 100%)
```

---

## 30. Kubernetes — Deep Dive

### Key Resources

| Resource | Purpose |
|----------|---------|
| **Deployment** | Manage replicas, rolling updates |
| **StatefulSet** | Stateful apps (DB, Kafka) — stable pod identity |
| **DaemonSet** | 1 pod per node (log collectors, monitoring) |
| **HPA** | Auto-scale on CPU/memory |
| **KEDA** | Event-driven autoscaling (Kafka lag, queue depth) |
| **PDB** | Min available pods during drain |
| **NetworkPolicy** | Firewall between pods |

### Service Mesh (Istio vs Linkerd 2025)

| Feature | Istio | Linkerd |
|---------|-------|---------|
| Complexity | สูง (Envoy) | ต่ำ (Rust proxy) |
| Performance | latency สูงกว่า | เร็วกว่า ~163ms p99 |
| mTLS | อัตโนมัติ | อัตโนมัติ |
| CNCF | Graduated | Graduated |

---

## 31. Infrastructure as Code — Deep Dive

| Tool | ภาษา | แนวคิด | เหมาะกับ |
|------|------|--------|---------|
| **Terraform/OpenTofu** | HCL | Declarative, state file | Universal, mature |
| **Pulumi** | Python/TS/Go | Imperative (real code) | Dev teams, complex logic |
| **Crossplane** | K8s CRDs | Control-loop reconciliation | K8s-native platform |
| **AWS CDK** | TS/Python | Imperative | AWS-centric |
| **Ansible** | YAML | Procedural (push) | Config management |

---

## 32. API Design — Deep Dive

### REST vs GraphQL vs gRPC

| Aspect | REST | GraphQL | gRPC |
|--------|------|---------|------|
| Protocol | HTTP/1.1 + JSON | HTTP/1.1 + JSON | HTTP/2 + Protobuf |
| Latency | ~250ms | ~180ms | ~25ms |
| Over/Under-fetching | มีปัญหา | แก้ได้ (client เลือก field) | ไม่มีปัญหา |
| Type Safety | OpenAPI spec | SDL Schema | Protobuf (strongly typed) |
| Streaming | SSE/Polling | Subscriptions | Native bidirectional |
| Browser | Native | Native | ต้อง grpc-web proxy |
| **เหมาะกับ** | **Public API** | **Frontend BFF** | **Internal services** |

### Rate Limiting Algorithms

| Algorithm | วิธีทำงาน |
|-----------|---------|
| **Fixed Window** | นับ per time window |
| **Sliding Window** | นับย้อนหลัง N วินาที |
| **Token Bucket** | Token เติมทีละ rate R |
| **Leaky Bucket** | drain rate คงที่ |

**Distributed Rate Limiting**: Redis + Lua scripts สำหรับ atomic ops

### Backend-for-Frontend (BFF)

```
Mobile App -> BFF-Mobile -> Microservices
Web App    -> BFF-Web    -> Microservices
(แต่ละ BFF optimize payload ตาม client)
```

---

## 33. Testing — Deep Dive

### Testing Pyramid for Microservices

```
        /\   E2E Tests (น้อย, ช้า — user journeys)
       /----\
      / Contract \ Contract Tests (Pact — API compatibility)
     /------------\
    /  Component   \ Component Tests (service + real DB in isolation)
   /----------------\
  /    Unit Tests     \ (เยอะ, เร็ว — business logic)
 /--------------------\
```

### Contract Testing (Pact)
- Consumer เขียนว่า "expect อะไร"
- Provider verify ว่า "honor spec นั้น"
- CI gate: "Can I Deploy?" ก่อน release

### Testcontainers
- Spin up Docker จริง (PostgreSQL, Redis, Kafka) ใน test
- ไม่ใช้ mock — confidence สูงกว่า

### Chaos Engineering
- **Steady State Hypothesis**: กำหนดว่า "ปกติ" คืออะไร (p99 < 200ms, error < 0.1%)
- ทดสอบว่ายังปกติไหม ระหว่าง inject failure
- **Tools**: LitmusChaos (K8s), Chaos Monkey

---

## 34. Data Patterns — Deep Dive

### Event Sourcing

```
Traditional:   DB row updated in place (เห็นแค่สถานะปัจจุบัน)
Event Sourced: [OrderCreated -> ItemAdded -> PaymentProcessed -> OrderShipped]
               -> replay เพื่อ get current state
```

**ข้อดี**: full audit log, time-travel queries, replay สร้าง projection ใหม่
**ข้อเสีย**: eventual consistency, schema evolution ยาก

### Outbox Pattern

**ปัญหา**: update DB + publish Kafka แบบ atomic ไม่ได้

**แก้:**
```
1. เขียน business data + event ลง OUTBOX table (same DB transaction)
2. Outbox Relay อ่าน unprocessed rows
3. Publish event ไป Kafka
4. Mark rows as processed
```

**2 แบบ:**
- **Polling Publisher**: poll outbox table ตาม interval (ง่าย, delay นิดหน่อย)
- **CDC-based (Debezium)**: อ่าน DB WAL ตรงๆ (near real-time)

### Change Data Capture (CDC)

```
PostgreSQL WAL / MySQL binlog
  -> Debezium (Kafka Connect)
  -> Kafka Topic (per table)
  -> Consumers: search index, cache invalidation, analytics
```

---

## 35. Real-Time Communication — Deep Dive

| Technology | Direction | Best For |
|-----------|-----------|---------|
| **WebSocket** | Bi-directional | Chat, gaming, trading |
| **SSE** | Server-to-client | Dashboard, AI streaming |
| **gRPC Streaming** | Bi-directional | Backend-to-backend |
| **Long Polling** | Server-to-client | Legacy (avoid) |

### WebSocket at Scale

```
Client <-[WS]-> WS Server A -> Redis Pub/Sub <- WS Server B <-[WS]-> Other Client
```

ทุก server subscribe Redis channel -> fan out ไป connected clients

### SSE (Server-Sent Events) — แนะนำ 2025

- ทำงานบน HTTP/2 (multiplexed)
- Browser `EventSource` reconnect อัตโนมัติ
- Load balance ง่ายกว่า WebSocket
- ผ่าน proxy/CDN ได้

---

## 36. Edge Computing & CDN — Deep Dive

### CDN Cache Strategies

- **TTL-based**: หมดอายุตามเวลา
- **Purge by URL**: ลบ cache เฉพาะ URL
- **Surrogate keys**: ลบ cache ตาม tag (`product-123`)
- **Stale-while-revalidate**: serve stale ทันที, fetch ใหม่ background

### Edge Functions

| Platform | Runtime | Cold Start |
|----------|---------|-----------|
| Cloudflare Workers | V8 / Wasm | ~0ms |
| Lambda@Edge | Node.js / Python | ~100ms |
| Fastly Compute | Wasm (Rust, Go) | ~0ms |

**Use Cases**: JWT validation at edge, geolocation routing, A/B testing, bot detection

---

## 37. AI/ML Infrastructure — Deep Dive

### ML Pipeline

```
Data Sources
  -> Feature Engineering -> Feature Store (Feast)
  -> Model Training (MLflow / W&B for experiment tracking)
  -> Model Registry (versioned: staging / production)
  -> Model Serving (online inference API)
  -> Monitoring (drift detection)
  -> Retraining trigger (scheduled or drift-based)
```

### Feature Store

แก้ปัญหา "training-serving skew" (features คำนวณต่างกันตอน train vs serve)

- **Offline Store**: Parquet/S3 — batch training
- **Online Store**: Redis/DynamoDB — real-time inference (low latency)

### Model Serving Patterns

| Pattern | Tools |
|---------|-------|
| REST Inference API | FastAPI, BentoML, TorchServe |
| Batch Inference | Spark, Ray |
| Multi-model Serving | KServe, Seldon, Triton |
| Canary Model Rollout | KServe, feature flags |

### LLM Infrastructure 2025

- **RAG**: Retrieve docs from vector DB -> feed as context to LLM
- **LLM Gateway**: Rate limiting, cost tracking, model routing (LiteLLM, PortKey)
- **Prompt versioning**: Track changes (Langfuse, Helicone)
- **Inference optimization**: Quantization (INT8/INT4), vLLM, Flash Attention
- **Guardrails**: Output validation, toxicity filter, PII detection

### ML Monitoring — Types of Drift

| Type | คืออะไร |
|------|---------|
| **Data drift** | Input distribution เปลี่ยนจาก training data |
| **Concept drift** | Relationship ระหว่าง feature-target เปลี่ยน |
| **Prediction drift** | Output distribution เปลี่ยน |

**Tools**: Evidently AI, Arize, WhyLabs

---

## 38. File & Object Storage — Deep Dive

### Presigned URL Pattern (สำคัญมาก)

> ห้าม proxy file upload/download ผ่าน API server

```
1. Client ขอ upload URL จาก API
2. API สร้าง presigned PUT URL (expire 15 min) จาก S3
3. ส่ง URL กลับ client
4. Client upload ตรงไปที่ S3 (bypass API server)
5. S3 event trigger Lambda เมื่อ upload เสร็จ
```

**ทำไม**: ไม่กิน bandwidth ของ API server, scale ตาม S3

### Storage Options

| Storage | ข้อดี |
|---------|------|
| **S3** | Proven, ecosystem ใหญ่ |
| **Cloudflare R2** | Zero egress fees |
| **MinIO** | Self-hosted, S3-compatible, AI/ML workloads |

---

## 39. Distributed Patterns — Deep Dive

### Saga Pattern — 2 แบบ

**Choreography (event-driven):**
```
OrderService -> OrderCreated
  -> InventoryService reserves -> StockReserved
    -> PaymentService charges -> PaymentProcessed
      -> ShippingService ships

On failure: PaymentFailed -> InventoryService compensates (release stock)
```

**Orchestration (central coordinator):**
```
SagaOrchestrator calls InventoryService.reserve()
  -> Success: calls PaymentService.charge()
    -> Failure: calls InventoryService.release()
  -> Success: calls ShippingService.create()
```

| | Choreography | Orchestration |
|-|-------------|--------------|
| Coupling | หลวม | แน่นกว่า |
| Visibility | ตามยาก | เห็น flow ชัด |
| เหมาะกับ | < 4 steps | ซับซ้อน, ต้อง audit |

**Tools**: Temporal, AWS Step Functions, Axon

### Idempotency Keys

```
Client sends: POST /payments
Header: Idempotency-Key: <uuid>

Server:
  1. Check Redis: key นี้ process แล้วหรือยัง?
  2. ใช่ -> return cached response (ไม่ตัดเงินซ้ำ)
  3. ไม่ -> process, store result + key (TTL 24h), return
```

### Circuit Breaker States

```
CLOSED --(error rate > threshold)--> OPEN --(timer expires)--> HALF-OPEN
  ^                                                              |
  +----------- (probe succeeds) --------------------------------+
               (probe fails -> back to OPEN)
```

### Retry with Exponential Backoff + Jitter

```
Attempt 1: wait 1s
Attempt 2: wait 2s
Attempt 3: wait 4s + random(0-1s)  <- jitter ป้องกัน thundering herd
Attempt 4: wait 8s + random(0-1s)
Max retries: 5 -> circuit breaker opens
```

---

## 40. Interview Quick Reference — System Design Trade-offs

| X vs Y | Trade-off |
|--------|-----------|
| REST vs gRPC | ง่าย vs เร็ว |
| Kafka vs RabbitMQ | throughput + replay vs latency + routing |
| Orchestration vs Choreography | visibility vs loose coupling |
| Sync vs Async | latency ต่ำ vs resilience สูง |
| SQL vs NoSQL | ACID + schema vs scale + flexible |
| Microservices vs Monolith | autonomy vs simplicity |
| Polling vs SSE vs WebSocket | ง่าย vs push vs bi-directional |

### Classic System Design Problems

| Problem | Key Concepts |
|---------|-------------|
| URL shortener | Consistent hashing, Base62, Redis cache |
| Notification system | Event-driven, fan-out write/read |
| Payment system | Idempotency, Saga, Outbox, exactly-once |
| Search engine | Inverted index, sharding, ranking |
| Chat system | WebSocket, Redis pub/sub, message ordering |
| Rate limiter | Token bucket, sliding window, Redis atomic |
| Job scheduler | Distributed lock, at-least-once, cron |
| Social feed | Fan-out write/read, celebrity problem |

---

*Created: 2026-02-10 | Source: Gemini conversation + Peepo Oracle synthesis + Web Research*
*Total: 40 sections covering full modern System Design landscape*
