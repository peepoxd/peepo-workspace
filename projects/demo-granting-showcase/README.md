# Demo Granting System - Showcase

> Frontend Showcase with Mock Data - No Backend Required

## Quick Start

```bash
# Install dependencies
npm install

# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Demo Users

| Role | Email | Password |
|------|-------|----------|
| ภาคีเครือข่าย | partner@demo.com | partner123 |
| นักวิชาการ | academic@demo.com | academic123 |
| ผู้อนุมัติ | approver@demo.com | approver123 |
| ศูนย์สัญญา | contract@demo.com | contract123 |
| กฎหมาย | legal@demo.com | legal123 |

## Features

- **Dashboard** - ภาพรวมระบบ, สถิติ, งบประมาณ
- **Proposals** - ยื่นเสนอโครงการ, บันทึกร่าง, ยื่นข้อเสนอ
- **Screening** - คัดกรองข้อเสนอโดยนักวิชาการ
- **Approval** - อนุมัติโครงการโดยผู้อนุมัติ
- **Contracts** - จัดการสัญญา, ลงนามอิเล็กทรอนิกส์
- **Payments** - เบิกจ่ายงบประมาณ
- **Reports** - รายงานสรุป

## Deploy to Netlify

```bash
# Option 1: Netlify CLI
npm install -g netlify-cli
netlify login
netlify deploy --prod --dir=dist

# Option 2: Drag & Drop
# Go to https://app.netlify.com/drop
# Drag the "dist" folder
```

## Tech Stack

- React 18 + TypeScript
- Vite
- TailwindCSS
- React Query
- React Router
- Zustand (State Management)
- Lucide Icons
