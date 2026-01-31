# PRP: demo-granting-system
## Product Requirement Prompt for AI-Driven Development

---

## 1. GOAL (เป้าหมาย)

สร้าง Demo ระบบ demo-granting-system ที่แสดงให้เห็น:
1. **Proper Server Role Separation** - แยกบทบาทเซิร์ฟเวอร์ตาม Modern Architecture
2. **Business Value** - ลด Cost, ลด Risk, รักษา Revenue
3. **Scalable Design** - โตได้โดยไม่ต้องยกเครื่องใหม่

---

## 2. WHY (ทำไมต้องทำ)

### Pain Point จาก idea.txt:
> "องค์กรไม่ได้เจ็บหนักเพราะ 'เขียนโค้ดไม่ดี' แต่เพราะ 'จัดบทบาทของเซิร์ฟเวอร์ผิด'
> จนทุกอย่างไปกองอยู่ชั้นเดียว แล้วความล้มเหลวลามเป็นโดมิโน"

### 5 ปัญหาที่ Demo นี้จะแก้:

| # | ปัญหา | ผลกระทบ | วิธีแก้ใน Demo |
|---|-------|---------|----------------|
| 1 | Web + App Server ปนกัน | พังทีเดียว พังทั้งระบบ | แยก Nginx (Web) + Node/Python (App) |
| 2 | ไม่มี Load Balancer จริง | Deploy = เสี่ยง Downtime | ใช้ Traefik/Nginx + Health Check |
| 3 | Cache ไม่มี Policy | เร็วบ้างช้าบ้าง ข้อมูลเพี้ยน | Redis + TTL + Invalidation Strategy |
| 4 | Database เป็นคอขวด | ต้นทุนเพิ่ม ข้อมูลเสี่ยง | Connection Pool + Read Replica Pattern |
| 5 | File อยู่บนเครื่อง App | Scale ยาก Backup ไม่ชัด | แยก MinIO/S3 File Storage |

### Business Impact (จาก Simulation):
- **Before**: Downtime 2 ชม. = สูญเสีย 250,000-400,000 บาท
- **After**: Incident ลดจาก 3-4 ครั้ง/เดือน → 0-1 ครั้ง/เดือน

---

## 3. WHAT (ทำอะไร)

### 3.1 e-Granting Business Modules (จาก docx)

```
┌─────────────────────────────────────────────────────────────────┐
│                    e-Granting Workflow                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   Phase 1        Phase 2        Phase 3-4       Phase 5        │
│  ┌────────┐    ┌────────┐    ┌──────────┐    ┌────────┐       │
│  │ข้อเสนอ │ → │อนุมัติ │ → │ดำเนินการ│ → │ปิดโครงการ│       │
│  │โครงการ │    │โครงการ │    │+เบิกจ่าย │    │         │       │
│  └────────┘    └────────┘    └──────────┘    └────────┘       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**7 Modules:**
1. **ข้อเสนอโครงการ** - สร้าง/แก้ไข/ยื่น, แนบไฟล์
2. **คัดกรอง/กลั่นกรอง** - ตรวจคุณสมบัติ, กำหนดงวด
3. **อนุมัติโครงการ** - พิจารณา, บันทึกเงื่อนไข
4. **สัญญา** - ตรวจเอกสาร, ลงนามอิเล็กทรอนิกส์
5. **เบิกจ่าย/ส่งงาน** - ขอเบิกงวด, รายงาน, อนุมัติ
6. **Dashboard/KPI** - สถานะ, งบประมาณ, แจ้งเตือน
7. **รายงาน** - Export Excel/PDF, สถิติ

**5 Roles (RBAC):**
| บทบาท | ข้อเสนอ | คัดกรอง | อนุมัติ | สัญญา | เบิกจ่าย |
|-------|--------|---------|--------|-------|---------|
| ภาคี | ✓ | ○ | ○ | ✓ | ✓ |
| นักวิชาการ | ✓ | ✓ | ○ | ○ | ✓ |
| ผู้อนุมัติ | ○ | ○ | ✓ | ✓ | ✓ |
| ศูนย์สัญญา | - | - | - | ✓ | - |
| กฎหมาย | ○ | ○ | ○ | ○ | ✓ |

---

### 3.2 Modern Server Architecture (จากรูป + idea.txt)

```
═══════════════════════════════════════════════════════════════════════════════
                    e-Granting Demo Architecture
                    "แยกบทบาทชัด ควบคุมการล่มได้"
═══════════════════════════════════════════════════════════════════════════════

                            ┌─────────────┐
                            │   Client    │
                            │  (Browser)  │
                            └──────┬──────┘
                                   │ HTTPS
                                   ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│ Layer 1: DNS                                                                 │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │  DNS Server                                                             │ │
│ │  - egranting-demo.local → 127.0.0.1                                    │ │
│ │  - Owner: Infrastructure                                                │ │
│ │  - Failure Mode: ใช้ /etc/hosts fallback                                │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│ Layer 2: Load Balancer / Reverse Proxy                                       │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │  Traefik / Nginx                                                        │ │
│ │  - TLS Termination                                                      │ │
│ │  - Health Check: /health every 10s                                      │ │
│ │  - Rate Limit: 100 req/s per IP                                         │ │
│ │  - Timeout: 30s                                                         │ │
│ │  - Circuit Breaker: 5 failures → open                                   │ │
│ │  - Owner: DevOps                                                        │ │
│ │  - Failure Mode: Return 503, log alert                                  │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────┘
                                   │
                    ┌──────────────┴──────────────┐
                    ▼                              ▼
┌─────────────────────────────────┐  ┌─────────────────────────────────┐
│ Layer 3a: Web Server            │  │ Layer 3b: Static Assets         │
│ ┌─────────────────────────────┐ │  │ ┌─────────────────────────────┐ │
│ │  Nginx (Static)             │ │  │ │  CDN / Nginx                │ │
│ │  - Serve React build        │ │  │ │  - CSS, JS, Images          │ │
│ │  - Gzip compression         │ │  │ │  - Cache: 1 year            │ │
│ │  - Cache static: 1 year     │ │  │ │  - Versioned filenames      │ │
│ └─────────────────────────────┘ │  │ └─────────────────────────────┘ │
└─────────────────────────────────┘  └─────────────────────────────────┘
                    │
                    ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│ Layer 4: Application Server                                                  │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │  Node.js / Python FastAPI                                               │ │
│ │  - Business Logic ONLY                                                  │ │
│ │  - Stateless (no session on server)                                     │ │
│ │  - JWT Authentication                                                   │ │
│ │  - Connection Pool: max 20 per instance                                 │ │
│ │  - Modules:                                                             │ │
│ │    ├── /api/proposals      → ข้อเสนอโครงการ                             │ │
│ │    ├── /api/screening      → คัดกรอง                                    │ │
│ │    ├── /api/approval       → อนุมัติ                                    │ │
│ │    ├── /api/contracts      → สัญญา                                      │ │
│ │    ├── /api/payments       → เบิกจ่าย                                   │ │
│ │    ├── /api/dashboard      → Dashboard/KPI                             │ │
│ │    └── /api/reports        → รายงาน                                     │ │
│ │  - Owner: Backend Team                                                  │ │
│ │  - Failure Mode: Return error JSON, don't crash                        │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────┘
                    │
        ┌───────────┼───────────┬───────────────┐
        ▼           ▼           ▼               ▼
┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐
│ Layer 5a    │ │ Layer 5b    │ │ Layer 5c    │ │ Layer 5d            │
│ Cache       │ │ Database    │ │ File Storage│ │ External Services   │
│ ┌─────────┐ │ │ ┌─────────┐ │ │ ┌─────────┐ │ │ ┌─────────────────┐ │
│ │ Redis   │ │ │ │PostgreSQL│ │ │ │ MinIO   │ │ │ │ GFMIS, e-GP,   │ │
│ │         │ │ │ │         │ │ │ │ (S3)    │ │ │ │ SSO            │ │
│ └─────────┘ │ │ └─────────┘ │ │ └─────────┘ │ │ └─────────────────┘ │
│             │ │             │ │             │ │                     │
│ Policy:     │ │ Config:     │ │ Config:     │ │ Config:             │
│ - Session:  │ │ - Pool: 20  │ │ - Bucket:   │ │ - Timeout: 10s      │
│   TTL 30m   │ │ - Replica:  │ │   proposals │ │ - Retry: 3x         │
│ - Dashboard:│ │   1 read    │ │   contracts │ │ - Circuit: 5 fail   │
│   TTL 5m    │ │ - Backup:   │ │   reports   │ │                     │
│ - API:      │ │   daily     │ │ - Versioned │ │                     │
│   TTL 1m    │ │ - Restore   │ │ - Encrypted │ │                     │
│             │ │   drill:    │ │             │ │                     │
│ Hit Ratio   │ │   monthly   │ │             │ │                     │
│ Target: 80% │ │             │ │             │ │                     │
└─────────────┘ └─────────────┘ └─────────────┘ └─────────────────────┘

═══════════════════════════════════════════════════════════════════════════════
```

---

## 4. CONTEXT (บริบท)

### 4.1 Strategic Insights (7 ข้อจาก idea.txt)

| # | Insight | การนำไปใช้ใน Demo |
|---|---------|------------------|
| 1 | นิยาม "หน้าที่" ก่อนเลือกเทคโนโลยี | แต่ละ Layer มี Owner + SLA + Failure Mode |
| 2 | แยก "รับทราฟฟิก" จาก "ประมวลผลธุรกิจ" | Nginx/Traefik แยกจาก Node.js/FastAPI |
| 3 | Load Balancer = เครื่องมือควบคุมความเสี่ยง | Health check + Timeout + Circuit breaker |
| 4 | Cache ต้องมีตัวเลขกำกับ | Hit ratio target 80%, TTL ตามชนิดข้อมูล |
| 5 | Database ต้องถูกปกป้องจากแอป | Connection pool + Read replica + Backup drill |
| 6 | ไฟล์โปรดักชันไม่ควรผูกกับเครื่องแอป | MinIO แยกจาก App server |
| 7 | ลงทุนใน "การออกแบบการล่ม" | Graceful degradation ทุก Layer |

### 4.2 Tech Stack

```yaml
Frontend:
  - React 18 + TypeScript
  - TailwindCSS
  - React Query (caching)
  - React Router

Backend:
  - Node.js + Express / Python + FastAPI
  - JWT Authentication
  - Zod/Pydantic validation

Infrastructure:
  - Docker Compose (local dev)
  - Traefik (reverse proxy)
  - Nginx (static files)
  - Redis (cache)
  - PostgreSQL (database)
  - MinIO (file storage)

Testing:
  - Playwright (E2E)
  - Jest/Pytest (Unit)
  - k6 (Load testing)
```

### 4.3 File Structure Pattern

```
e-granting-demo/
├── docker-compose.yml          # All services
├── traefik/
│   └── traefik.yml             # Load balancer config
├── nginx/
│   └── nginx.conf              # Web server config
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── proposals/      # ข้อเสนอโครงการ
│   │   │   ├── screening/      # คัดกรอง
│   │   │   ├── approval/       # อนุมัติ
│   │   │   ├── contracts/      # สัญญา
│   │   │   ├── payments/       # เบิกจ่าย
│   │   │   ├── dashboard/      # Dashboard
│   │   │   └── reports/        # รายงาน
│   │   ├── hooks/
│   │   └── utils/
│   └── Dockerfile
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── models/
│   │   └── middleware/
│   │       ├── auth.ts         # JWT + RBAC
│   │       ├── cache.ts        # Redis middleware
│   │       └── rateLimit.ts    # Rate limiting
│   └── Dockerfile
├── database/
│   ├── migrations/
│   └── seeds/
├── tests/
│   ├── e2e/                    # Playwright tests
│   ├── unit/
│   └── load/                   # k6 scripts
└── docs/
    └── architecture.md
```

---

## 5. BLUEPRINT (พิมพ์เขียว)

### Phase 1: Infrastructure Setup
```
Tasks:
1. สร้าง docker-compose.yml
   - traefik (port 80, 443)
   - nginx (static)
   - backend (port 3000)
   - redis (port 6379)
   - postgres (port 5432)
   - minio (port 9000)

2. Configure Traefik
   - Health check endpoints
   - Rate limiting rules
   - Circuit breaker

3. Configure Redis
   - Session store (TTL 30m)
   - API cache (TTL 1-5m)

Validation:
- docker compose up → ทุก service healthy
- curl localhost/health → 200 OK
```

### Phase 2: Auth + RBAC
```
Tasks:
1. JWT Authentication
   - Login endpoint
   - Token refresh
   - Logout (blacklist)

2. RBAC Middleware
   - 5 roles: ภาคี, นักวิชาการ, ผู้อนุมัติ, ศูนย์สัญญา, กฎหมาย
   - Permission matrix
   - Role-based route guards

3. Frontend Auth
   - Login page
   - Protected routes
   - Role-based UI

Validation:
- Login as each role → correct permissions
- Access denied for unauthorized routes
```

### Phase 3-7: Business Modules
```
แต่ละ Module ทำตาม Pattern:
1. Database migration
2. API endpoints (CRUD)
3. Cache strategy
4. Frontend pages
5. Playwright tests

Modules:
- Phase 3: Proposals (ข้อเสนอโครงการ)
- Phase 4: Dashboard (real-time KPI)
- Phase 5: Screening + Approval
- Phase 6: Contracts (e-signature)
- Phase 7: Payments + Reports
```

### Phase 8: Load Testing & Graceful Degradation
```
Tasks:
1. k6 load test
   - Normal: 50 concurrent users
   - Peak: 200 concurrent users
   - Spike: 500 concurrent users

2. Graceful degradation
   - Cache miss → fallback to DB
   - DB timeout → return cached data
   - External service fail → queue for retry

3. Monitoring
   - Response time (P95 < 2s)
   - Error rate (< 1%)
   - Cache hit ratio (> 80%)

Validation:
- Load test passes all scenarios
- No cascade failures
```

---

## 6. VALIDATION (การตรวจสอบ)

### Level 1: Syntax & Lint
```bash
# Frontend
cd frontend && npm run lint && npm run type-check

# Backend
cd backend && npm run lint && npm run type-check
# หรือ
cd backend && ruff check && mypy .
```

### Level 2: Unit Tests
```bash
# Frontend
cd frontend && npm test

# Backend
cd backend && npm test
# หรือ
cd backend && pytest tests/unit -v
```

### Level 3: Integration Tests
```bash
# Start services
docker compose up -d

# Run integration tests
npm run test:integration
```

### Level 4: E2E Tests (Playwright)
```bash
# Start all services
docker compose up -d

# Run Playwright tests
npx playwright test

# Test scenarios:
# - Login as ภาคี → สร้างข้อเสนอ → ยื่น
# - Login as นักวิชาการ → คัดกรอง → ผ่าน
# - Login as ผู้อนุมัติ → อนุมัติ → ลงนาม
# - Dashboard → แสดง KPI ถูกต้อง
# - Export รายงาน → ได้ไฟล์
```

### Level 5: Load Test
```bash
# Run k6
k6 run tests/load/peak-traffic.js

# Expected:
# - P95 latency < 2s
# - Error rate < 1%
# - No cascade failures
```

---

## 7. SUCCESS CRITERIA (เกณฑ์สำเร็จ)

### Functional
- [ ] ทุก Module ทำงานครบ Workflow
- [ ] RBAC ถูกต้องตาม Permission Matrix
- [ ] File upload/download ทำงาน
- [ ] Export รายงาน Excel/PDF ได้

### Architecture
- [ ] แยก Layer ชัดเจน (ไม่มี Layer ทำหลายหน้าที่)
- [ ] ทุก Layer มี Health Check
- [ ] Cache hit ratio > 80%
- [ ] Graceful degradation ทำงาน

### Performance
- [ ] P95 latency < 2s (normal load)
- [ ] P95 latency < 5s (peak load)
- [ ] Error rate < 1%
- [ ] Zero cascade failures

### Documentation
- [ ] Architecture diagram
- [ ] API documentation
- [ ] Deployment guide
- [ ] Runbook for incidents

---

## 8. COMPLETION PROMISE

เมื่อทุกอย่างสำเร็จ output:

```
<promise>DEMO_GRANTING_SYSTEM_COMPLETE</promise>
```

---

## References

- Source: `projects/e-granting/e-Granting-System.docx`
- Architecture: `ψ/writing/IMG_3228.JPG` (ByteByteGo)
- Insights: `ψ/writing/idea.txt`
- Workflow: `ψ/writing/e-granting-demo-workflow.txt`

---

*Created: 2026-01-31*
*Author: Peepo Oracle*
*Version: 1.0*
