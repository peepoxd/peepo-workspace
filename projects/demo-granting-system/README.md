# Demo Granting System

ระบบบริหารโครงการสาธิต - Demo Grant Management System

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  Client (Browser)                                                           │
│      │                                                                      │
│      ▼                                                                      │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Layer 2: TRAEFIK (Load Balancer)                                    │   │
│  │ - Health check, Rate limit 100 req/s, Circuit breaker               │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│      │                                                                      │
│      ├─────────────────────┬────────────────────────────────────────┐      │
│      ▼                     ▼                                        │      │
│  ┌────────────────┐   ┌────────────────────────────────────────────┐│      │
│  │ Layer 3: NGINX │   │ Layer 4: BACKEND (Express/Node.js)         ││      │
│  │ (Static Files) │   │ - JWT Auth + RBAC (5 roles)                ││      │
│  │ - React SPA    │   │ - 9 API modules                            ││      │
│  └────────────────┘   └──────────────────┬─────────────────────────┘│      │
│                                          │                          │      │
│      ┌───────────────────────────────────┼──────────────────────┐   │      │
│      ▼                                   ▼                      ▼   │      │
│  ┌──────────────┐  ┌──────────────────────────┐  ┌──────────────┐   │      │
│  │ Layer 5a:    │  │ Layer 5b: POSTGRESQL     │  │ Layer 5c:    │   │      │
│  │ REDIS        │  │ - 7 tables + audit       │  │ MINIO        │   │      │
│  │ (Cache)      │  │ - 11 indexes             │  │ (S3 Storage) │   │      │
│  └──────────────┘  └──────────────────────────┘  └──────────────┘   │      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Quick Start

```bash
# Start all services
docker compose up -d

# Check health
curl http://localhost/health

# Access
# - Frontend: http://localhost
# - API: http://localhost/api
# - Traefik Dashboard: http://localhost:8080
# - MinIO Console: http://localhost:9001
```

## Demo Users

| Email | Password | Role | Thai |
|-------|----------|------|------|
| partner@demo.com | partner123 | Partner | ภาคีเครือข่าย |
| academic@demo.com | academic123 | Academic | นักวิชาการ |
| approver@demo.com | approver123 | Approver | ผู้อนุมัติ |
| contract@demo.com | contract123 | Contract Center | ศูนย์สัญญา |
| legal@demo.com | legal123 | Legal | กฎหมาย |

## Modules

1. **Proposals** - Create, edit, submit project proposals
2. **Screening** - Review and filter submissions
3. **Approval** - Approve/reject decisions
4. **Contracts** - Electronic signatures
5. **Payments** - Request and approve disbursements
6. **Dashboard** - KPIs and budget overview
7. **Reports** - Export Excel/PDF

## Development

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```

## Testing

```bash
# E2E Tests (Playwright)
npx playwright test

# Load Tests (k6)
k6 run tests/load/smoke.js
k6 run tests/load/peak.js
```

## Architecture Principles

Based on "Servers You Should Know in Modern Systems":

1. **Layer Separation** - Each layer has single responsibility
2. **Health Checks** - Every service monitored
3. **Rate Limiting** - Protect from abuse
4. **Circuit Breaker** - Prevent cascade failures
5. **Cache Policies** - TTL by data type (1m API, 5m Dashboard, 30m Session)
6. **Graceful Degradation** - Return cached data on failure

## Project Structure

```
demo-granting-system/
├── docker-compose.yml
├── traefik/
├── nginx/
├── backend/
│   └── src/
│       ├── routes/      # 9 API modules
│       ├── middleware/  # Auth, Rate limit
│       ├── services/    # MinIO integration
│       └── utils/       # Logger, Cache
├── frontend/
│   └── src/
│       ├── pages/       # 10 pages
│       ├── components/  # Reusable UI
│       └── hooks/       # Auth store
├── database/
│   ├── migrations/
│   └── seeds/
└── tests/
    ├── e2e/            # Playwright
    └── load/           # k6
```

---

*Built with Ralph Loop (10 iterations)*
*Architecture: ByteByteGo "Servers You Should Know"*
