# Interview Preparation: ศุภวิชญ์ พยัคสุโข

## Source Documents
- ข้อ 1: ระบบจัดการเครือข่าย สสส. (Grant Management System)
- ข้อ 2: ระบบ PCS (Production Control System)

---

## ITERATION 1: Document Summary

### ระบบที่ 1: ระบบจัดการเครือข่าย สสส.

**วัตถุประสงค์**: บริหารจัดการโครงการครบวงจร สำหรับ สสส. (สำนักงานกองทุนสนับสนุนการสร้างเสริมสุขภาพ)

**Workflow หลัก**:
```
พัฒนาข้อเสนอ → อนุมัติโครงการ → ดำเนินการ+เบิกจ่าย → ปิดโครงการ
```

**ผู้ใช้งาน 5 กลุ่ม**:
| กลุ่ม | บทบาท |
|-------|--------|
| ภาคีเครือข่าย | ยื่นข้อเสนอ, ขอเบิก, ส่งรายงาน |
| นักวิชาการ | คัดกรอง, กลั่นกรอง, ตรวจสอบ |
| ผู้อนุมัติ | อนุมัติโครงการ, อนุมัติเบิก |
| ศูนย์สัญญา | จัดทำสัญญา, อนุมัติปิด |
| ฝ่ายกฎหมาย | ให้คำปรึกษา, พิจารณายกเลิก |

**8 Modules**: ข้อเสนอโครงการ, คัดกรอง/กลั่นกรอง, อนุมัติโครงการ, สัญญา, เบิกจ่าย/ส่งงาน, ปิดโครงการ, Dashboard/KPI, รายงาน

---

### ระบบที่ 2: ระบบ PCS (Production Control System)

**วัตถุประสงค์**: บริหารจัดการการผลิตครบวงจร

**Workflow หลัก**:
```
Order → MRP → Purchase → Production → Shipment
```

**ผู้ใช้งาน 6 กลุ่ม**:
| กลุ่ม | บทบาท |
|-------|--------|
| ฝ่ายขาย (Sale) | รับ Order, ออก Invoice |
| ฝ่ายวางแผน (Planning) | MRP, Production Plan |
| ฝ่ายผลิต (Production) | Work Order, บันทึกผล |
| ฝ่ายจัดซื้อ (Purchase) | PR, PO, รับวัตถุดิบ |
| คลังสินค้า (Warehouse) | Stock IN/OUT |
| ฝ่ายจัดส่ง (Shipment) | Delivery, Tracking |

**7 Modules**: Sales, MRP, Production, Purchase, Inventory, Shipment, Dashboard

---

## ITERATION 2: Technical Architecture Comparison

### ระบบ สสส. - 5 Layers
```
┌─────────────────────────────────────┐
│  Layer 1: Frontend (React/Vue)      │
├─────────────────────────────────────┤
│  Layer 2: API Gateway (Auth, Rate)  │
├─────────────────────────────────────┤
│  Layer 3: Business Logic Services   │
├─────────────────────────────────────┤
│  Layer 4: Database (PostgreSQL+S3)  │
├─────────────────────────────────────┤
│  Layer 5: Integration (GFMIS,e-GP)  │
└─────────────────────────────────────┘
```

### ระบบ PCS - 5 Layers
```
┌─────────────────────────────────────┐
│  Frontend (React + Handy Scanner)   │
├─────────────────────────────────────┤
│  API Gateway (Auth, Logging)        │
├─────────────────────────────────────┤
│  Business Services (6 modules)      │
├─────────────────────────────────────┤
│  Database (PostgreSQL+Redis+S3)     │
├─────────────────────────────────────┤
│  Integration (ERP, Accounting)      │
└─────────────────────────────────────┘
```

### Key Differences
| Aspect | สสส. | PCS |
|--------|------|-----|
| Frontend | React/Vue | React + Handy Scanner |
| Cache | ไม่ระบุ | Redis |
| External Integration | GFMIS, e-GP, SSO | ERP, Accounting, Supplier Portal |
| Special Feature | ลงนามอิเล็กทรอนิกส์ | Barcode/QR Scan, Offline Mode |

---

## ITERATION 3: RBAC Analysis

### ระบบ สสส. RBAC
```
✓ = เข้าถึงได้ | ○ = ดูอย่างเดียว | - = ไม่มีสิทธิ์

บทบาท     | ข้อเสนอ | คัดกรอง | อนุมัติ | สัญญา | เบิกจ่าย | ปิดโครงการ
----------|---------|---------|---------|-------|----------|------------
ภาคี      |    ✓    |    ○    |    ○    |   ✓   |    ✓     |     ✓
นักวิชาการ |    ✓    |    ✓    |    ○    |   ○   |    ✓     |     ✓
ผู้อนุมัติ  |    ○    |    ○    |    ✓    |   ✓   |    ✓     |     ○
ศูนย์สัญญา |    -    |    -    |    -    |   ✓   |    -     |     ✓
กฎหมาย    |    ○    |    ○    |    ○    |   ○   |    ○     |     ✓
```

### ระบบ PCS RBAC
```
✓C = Create | ✓U = Update | ✓A = Approve/All | ○ = Read-only | - = No access

Role      | Sale | MRP  | Prod | Purch | Stock | Ship
----------|------|------|------|-------|-------|------
ฝ่ายขาย   | ✓C   |  ○   |  ○   |   -   |   ○   |  ○
วางแผน    |  ○   | ✓C   | ✓C   |   ○   |   ○   |  ○
ฝ่ายผลิต  |  ○   |  ○   | ✓C   |   ○   |  ✓U   |  -
จัดซื้อ   |  -   |  ○   |  ○   |  ✓C   |  ✓U   |  -
คลังสินค้า |  ○   |  ○   |  ○   |   ○   |  ✓C   | ✓U
จัดส่ง    |  ○   |  -   |  ○   |   -   |  ✓U   | ✓C
ผู้บริหาร  | ✓A   | ✓A   | ✓A   |  ✓A   |  ✓A   | ✓A
```

---

## ITERATION 4: KPIs Comparison

### ระบบ สสส. KPIs

**Process KPIs**:
- Time to Approve (ข้อเสนอ): ≤ 30 วัน
- Time to Pay (เบิกจ่าย): ≤ 15 วัน
- Document Processing Time: ≤ 5 วันทำการ
- First-time Approval Rate: ≥ 70%

**System KPIs**:
- System Uptime: ≥ 99.5%
- Response Time: ≤ 3 วินาที
- User Satisfaction: ≥ 4.0/5.0
- Bug/Defect Rate: ≤ 5 ต่อ Sprint

**Business KPIs**:
- Paper Reduction: ≥ 80%
- User Adoption Rate: ≥ 90%
- Process Automation: ≥ 60%
- Cost Savings: ≥ 20%

### ระบบ PCS KPIs

- On-Time Delivery: > 95%
- MRP Accuracy: > 90%
- Stock Accuracy: > 99%
- Production Yield: > 98%
- Lead Time Reduction: 20%
- User Adoption: > 95%

---

## ITERATION 5: Risk Analysis

### ระบบ สสส. - Risks & Mitigation

| ความเสี่ยง | ระดับ | แนวทางแก้ไข |
|-----------|-------|------------|
| User Adoption ต่ำ | สูง | อบรมผู้ใช้, User Manual, Help Desk |
| Integration ล้มเหลว | สูง | PoC ก่อน, Testing กับ GFMIS/e-GP |
| Security/PDPA | ปานกลาง | Security Audit, Encryption, MFA |
| Timeline ล่าช้า | ปานกลาง | Agile Sprint, Weekly review |
| Budget เกิน | ต่ำ | Phased approach, MVP first |

### ระบบ PCS - Risks & Mitigation

| ความเสี่ยง | แนวทางแก้ไข |
|-----------|------------|
| MRP คำนวณไม่แม่นยำ | ปรับ Parameter จาก Historical Data, Review รายสัปดาห์ |
| Production หยุดชะงัก | Offline Mode สำหรับ Handy, Auto-sync เมื่อ Online |
| Stock ไม่ตรงกับระบบ | Barcode/QR Scan ทุกการเคลื่อนไหว, Stock Count รายเดือน |
| Integration กับ ERP ล้มเหลว | API Testing, Parallel Run 2 เดือนก่อน Go-live |
| User ไม่คุ้นเคยระบบ | Training แยกตาม Role, Super User ประจำแผนก |

---

## ITERATION 6: Interview Questions - Technical

### Q1: ทำไมเลือก PostgreSQL เป็น Database?
**Answer**:
- Open-source, ไม่มีค่า license
- รองรับ JSON/JSONB สำหรับ flexible schema
- Strong ACID compliance สำหรับ financial transactions
- Full-text search capability
- ระบบ สสส. ต้องการ reliability สำหรับเรื่องการเงิน
- ระบบ PCS ต้องการ complex queries สำหรับ MRP calculations

### Q2: ทำไมใช้ Agile methodology?
**Answer**:
- ทั้ง 2 ระบบมี stakeholders หลายกลุ่ม ต้องการ feedback เร็ว
- Requirements อาจเปลี่ยนแปลงระหว่างพัฒนา
- สามารถส่งมอบ MVP ก่อนได้ (Sprint 1-2)
- ลดความเสี่ยง Timeline ล่าช้า
- สสส.: 9-12 เดือน แบ่งเป็น Sprint 2-4 สัปดาห์

### Q3: อธิบาย MRP (Material Requirements Planning) ในระบบ PCS
**Answer**:
- MRP คำนวณความต้องการวัตถุดิบจาก:
  - Sales Order (ความต้องการสินค้า)
  - BOM (Bill of Materials)
  - Current Stock
  - Lead Time ของ Supplier
- Output: Purchase Requisition (PR) และ Work Order
- ความท้าทาย: ต้อง tune parameter จาก historical data

### Q4: ระบบ สสส. เชื่อมต่อกับระบบภาครัฐอะไรบ้าง?
**Answer**:
- **GFMIS**: ระบบบริหารการเงินการคลังภาครัฐ (สำหรับเบิกจ่าย)
- **e-GP**: ระบบจัดซื้อจัดจ้างภาครัฐ
- **SSO**: Single Sign-On สำหรับ Authentication
- ต้องทำ PoC และ Parallel Run ก่อน Go-live

### Q5: ทำไมระบบ PCS ต้องมี Offline Mode?
**Answer**:
- Handy Scanner ใช้ในโรงงาน อาจมีปัญหา network
- Production ต้องไม่หยุดชะงักเพราะ system down
- ใช้ Auto-sync เมื่อกลับมา online
- เก็บ queue ไว้ใน local storage ของ device

---

## ITERATION 7: Interview Questions - Process

### Q6: อธิบาย Workflow การเบิกจ่ายในระบบ สสส.
**Answer**:
```
1. ภาคี → ขอเบิกเงินงวด + ส่งรายงาน
2. นักวิชาการ → ตรวจสอบรายงาน + หลักฐาน
3. ผู้อนุมัติ → พิจารณาอนุมัติเบิก
4. (วนซ้ำ ถ้ามีหลายงวด)
5. ระบบ → ส่งข้อมูลไป GFMIS
```

### Q7: Production Workflow ในระบบ PCS เป็นอย่างไร?
**Answer**:
```
1. Customer Order → Sale Import
2. MRP → คำนวณความต้องการผลิต+วัตถุดิบ
3. Purchase → สร้าง PR/PO, รับวัตถุดิบ
4. Production → ผลิตตาม Work Order (ใช้ Handy บันทึก)
5. Warehouse → Stock OUT
6. Shipment → Delivery + Invoice
```

### Q8: ถ้ามี Bug ในระบบ Production จะ handle อย่างไร?
**Answer**:
- ระบบ สสส. ตั้ง target: ≤ 5 bugs ต่อ Sprint
- ใช้ Agile Sprint Review ทุก 2-4 สัปดาห์
- มี Weekly review สำหรับ issues
- Priority: Security > Financial > UX

### Q9: User Adoption ต่ำ จะแก้ไขอย่างไร?
**Answer**:
- **สสส.**: อบรมผู้ใช้, User Manual, Help Desk
- **PCS**: Training แยกตาม Role, Super User ประจำแผนก
- ทั้ง 2 ระบบ target User Adoption > 90-95%
- ออกแบบ UI/UX ให้ใช้งานง่าย, Mobile responsive

---

## ITERATION 8: Interview Questions - Architecture Decisions

### Q10: ทำไมแยก Layer เป็น 5 ชั้น?
**Answer**:
- **Separation of Concerns**: แต่ละ layer มีหน้าที่ชัดเจน
- **Scalability**: Scale แต่ละ layer แยกกันได้
- **Security**: API Gateway จัดการ Auth, Rate Limiting
- **Maintainability**: เปลี่ยน Frontend ได้โดยไม่กระทบ Backend
- **Testing**: Test แต่ละ layer แยกกันได้

### Q11: ระบบ PCS ใช้ Redis ทำอะไร?
**Answer**:
- **Session Cache**: เก็บ user session
- **MRP Cache**: เก็บผลคำนวณ MRP ที่ใช้บ่อย
- **Real-time Dashboard**: เก็บ metrics สำหรับ Dashboard
- **Queue**: จัดการ async jobs (เช่น sync จาก Handy)

### Q12: ทำไมระบบ สสส. ต้องมีลงนามอิเล็กทรอนิกส์?
**Answer**:
- สัญญาต้องมีผลทางกฎหมาย
- ลดการใช้กระดาษ (target 80%)
- เพิ่มความโปร่งใส, มี Audit trail
- รองรับการทำงานแบบ remote

### Q13: Data Entity Relationships ในระบบ สสส.?
**Answer**:
```
Project 1:N → Milestone (งวดงาน)
Project 1:N → Payment (การเบิก)
Project 1:N → Document (เอกสาร)
Project N:M → User (ผู้เกี่ยวข้อง)
Project 1:1 → Contract (สัญญา)
User N:1 → Role (บทบาท)
```

---

## ITERATION 9: Behavioral Questions

### Q14: เล่าประสบการณ์ที่ท้าทายที่สุดในโปรเจกต์นี้
**Suggested Answer (สสส.)**:
"Integration กับ GFMIS เป็นความท้าทายที่สุด เพราะเป็นระบบภาครัฐที่มี specification เฉพาะ ต้องทำ PoC ก่อน และ Parallel Run 2 เดือนก่อน Go-live เพื่อให้มั่นใจว่าข้อมูลการเงินถูกต้อง"

**Suggested Answer (PCS)**:
"การทำให้ MRP คำนวณแม่นยำ เพราะต้อง tune parameter จาก historical data และ review ผลทุกสัปดาห์ ถ้าคำนวณผิดจะกระทบทั้ง Purchase และ Production"

### Q15: ถ้าต้องเริ่มโปรเจกต์ใหม่ จะทำอะไรต่างไป?
**Suggested Answer**:
- เริ่ม user training เร็วขึ้น (ไม่รอ Go-live)
- ทำ Integration testing กับระบบภายนอกตั้งแต่ Sprint แรกๆ
- มี Super User ในแต่ละแผนกตั้งแต่ต้น
- ใช้ Feature flags สำหรับ gradual rollout

### Q16: ทำงานร่วมกับ stakeholders หลายกลุ่มอย่างไร?
**Suggested Answer**:
- สสส. มี 5 กลุ่มผู้ใช้ที่ต้องการต่างกัน
- ใช้ Sprint Review ให้ทุกกลุ่มเห็น progress
- จัด workshop แยกตาม role
- มี Product Owner เป็นตัวกลาง prioritize features

---

## ITERATION 10: Quick Reference Card

### ระบบ สสส. - Key Points
- **ชื่อ**: ระบบจัดการเครือข่าย สสส.
- **ประเภท**: Grant Management System
- **Users**: 5 กลุ่ม (ภาคี, นักวิชาการ, ผู้อนุมัติ, ศูนย์สัญญา, กฎหมาย)
- **Modules**: 8 modules
- **Tech**: React/Vue, PostgreSQL, S3/MinIO
- **Integration**: GFMIS, e-GP, SSO
- **Timeline**: 9-12 เดือน (Agile Sprint 2-4 สัปดาห์)
- **Special**: ลงนามอิเล็กทรอนิกส์, PDPA compliance

### ระบบ PCS - Key Points
- **ชื่อ**: Production Control System
- **ประเภท**: Manufacturing/Production Management
- **Users**: 6 กลุ่ม (Sale, Planning, Production, Purchase, Warehouse, Shipment)
- **Modules**: 7 modules
- **Tech**: React, PostgreSQL, Redis, S3, Handy Scanner
- **Integration**: ERP, Accounting, Supplier Portal, Logistics
- **Special**: MRP, Barcode/QR Scan, Offline Mode, Traceability

### เปรียบเทียบ 2 ระบบ
| Aspect | สสส. | PCS |
|--------|------|-----|
| Domain | Government/NGO | Manufacturing |
| Core Process | Grant Approval | Production Planning |
| Key Module | เบิกจ่าย/สัญญา | MRP/Inventory |
| Integration | ระบบภาครัฐ | ERP/Accounting |
| Mobile | Responsive | Handy Scanner + Offline |
| Target Uptime | 99.5% | ไม่ระบุ (มี Offline fallback) |

---

*Prepared by Peepo Oracle | 31 January 2026*
*Ralph Loop Iteration: 10/10 COMPLETE*
