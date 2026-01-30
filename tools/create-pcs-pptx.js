const PptxGenJS = require("pptxgenjs");
const fs = require("fs");

const pptx = new PptxGenJS();
pptx.author = "Peepo Oracle";
pptx.title = "PCS - Production Control System";
pptx.subject = "ระบบควบคุมการผลิตแบบครบวงจร";

// Color scheme
const colors = {
  primary: "2E86AB",
  success: "28A745",
  danger: "DC3545",
  warning: "FD7E14",
  purple: "6F42C1",
  dark: "343A40",
  light: "F8F9FA",
  white: "FFFFFF",
};

// ============ SLIDE 1: Title ============
let slide1 = pptx.addSlide();
slide1.addShape(pptx.shapes.RECTANGLE, {
  x: 0, y: 0, w: "100%", h: "100%",
  fill: { color: colors.primary },
});
slide1.addText("ระบบ PCS", {
  x: 0.5, y: 2, w: 9, h: 1,
  fontSize: 54, bold: true, color: colors.white,
  fontFace: "TH Sarabun New",
});
slide1.addText("Production Control System", {
  x: 0.5, y: 2.8, w: 9, h: 0.6,
  fontSize: 32, color: colors.white,
  fontFace: "TH Sarabun New",
});
slide1.addText("ระบบควบคุมการผลิตแบบครบวงจร", {
  x: 0.5, y: 3.4, w: 9, h: 0.5,
  fontSize: 24, color: colors.light,
  fontFace: "TH Sarabun New",
});
slide1.addText("Order → MRP → Purchase → Production → Shipment", {
  x: 0.5, y: 4.5, w: 9, h: 0.5,
  fontSize: 20, color: colors.light, italic: true,
  fontFace: "TH Sarabun New",
});

// ============ SLIDE 2: Overview ============
let slide2 = pptx.addSlide();
slide2.addText("1. ภาพรวมระบบ (Overview)", {
  x: 0.5, y: 0.3, w: 9, h: 0.6,
  fontSize: 32, bold: true, color: colors.primary,
  fontFace: "TH Sarabun New",
});

slide2.addText("วัตถุประสงค์", {
  x: 0.5, y: 1, w: 2, h: 0.4,
  fontSize: 18, bold: true, color: colors.dark,
  fontFace: "TH Sarabun New",
});
slide2.addText("บริหารจัดการการผลิตครบวงจร ตั้งแต่รับ Order → วางแผน MRP → ผลิต → จัดส่ง", {
  x: 0.5, y: 1.4, w: 9, h: 0.4,
  fontSize: 16, color: colors.dark,
  fontFace: "TH Sarabun New",
});

slide2.addText("ผู้ใช้งานหลัก 6 กลุ่ม", {
  x: 0.5, y: 2, w: 3, h: 0.4,
  fontSize: 18, bold: true, color: colors.dark,
  fontFace: "TH Sarabun New",
});

const users = [
  ["ฝ่ายขาย (Sale)", "รับ Order, ออก Invoice"],
  ["ฝ่ายวางแผน (Planning)", "MRP, Production Plan"],
  ["ฝ่ายผลิต (Production)", "Work Order, บันทึกผล"],
  ["ฝ่ายจัดซื้อ (Purchase)", "PR, PO, รับวัตถุดิบ"],
  ["คลังสินค้า (Warehouse)", "Stock IN/OUT"],
  ["ฝ่ายจัดส่ง (Shipment)", "Delivery, Tracking"],
];

slide2.addTable(users, {
  x: 0.5, y: 2.4, w: 9, h: 2,
  fontSize: 14,
  fontFace: "TH Sarabun New",
  color: colors.dark,
  border: { pt: 0.5, color: "CCCCCC" },
  fill: { color: colors.light },
});

slide2.addShape(pptx.shapes.RECTANGLE, {
  x: 0.5, y: 4.6, w: 9, h: 0.6,
  fill: { color: colors.light },
});
slide2.addText("ระยะเวลา: 10-12 เดือน  |  งบประมาณ: 8-15 ล้านบาท  |  วิธีการ: Agile", {
  x: 0.5, y: 4.7, w: 9, h: 0.4,
  fontSize: 16, color: colors.dark, italic: true,
  fontFace: "TH Sarabun New", align: "center",
});

// ============ SLIDE 3: Workflow ============
let slide3 = pptx.addSlide();
slide3.addText("2. กระบวนการทำงาน (Workflow)", {
  x: 0.5, y: 0.3, w: 9, h: 0.6,
  fontSize: 32, bold: true, color: colors.primary,
  fontFace: "TH Sarabun New",
});

// Main flow boxes
const flowBoxes = [
  { name: "Customer\nOrder", color: "FFC107", x: 0.3 },
  { name: "Sale\nImport PO", color: "FF9800", x: 2.1 },
  { name: "MRP\nPlanning", color: colors.primary, x: 3.9 },
  { name: "Production\nWork Order", color: colors.success, x: 5.7 },
  { name: "Stock\nWarehouse", color: colors.purple, x: 7.5 },
];

flowBoxes.forEach((box, i) => {
  slide3.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: box.x, y: 1.2, w: 1.6, h: 0.9,
    fill: { color: box.color },
  });
  slide3.addText(box.name, {
    x: box.x, y: 1.35, w: 1.6, h: 0.7,
    fontSize: 12, bold: true, color: colors.white,
    fontFace: "TH Sarabun New", align: "center", valign: "middle",
  });
  if (i < flowBoxes.length - 1) {
    slide3.addText("→", {
      x: box.x + 1.6, y: 1.4, w: 0.5, h: 0.5,
      fontSize: 24, color: colors.dark, align: "center",
    });
  }
});

// Shipment box
slide3.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 7.5, y: 2.3, w: 1.6, h: 0.9,
  fill: { color: colors.warning },
});
slide3.addText("Shipment\nDelivery", {
  x: 7.5, y: 2.45, w: 1.6, h: 0.7,
  fontSize: 12, bold: true, color: colors.white,
  fontFace: "TH Sarabun New", align: "center", valign: "middle",
});

// Purchase flow
slide3.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 3.9, y: 2.5, w: 1.6, h: 0.7,
  fill: { color: colors.danger },
});
slide3.addText("Purchase\nPR/PO", {
  x: 3.9, y: 2.55, w: 1.6, h: 0.6,
  fontSize: 11, bold: true, color: colors.white,
  fontFace: "TH Sarabun New", align: "center", valign: "middle",
});

slide3.addText("↓", {
  x: 4.5, y: 2.1, w: 0.4, h: 0.4,
  fontSize: 20, color: colors.dark, align: "center",
});

// Phases description
const phases = [
  ["Phase 1 (Sales)", "รับ Order, Import PO, Delivery Note"],
  ["Phase 2 (MRP)", "คำนวณความต้องการผลิต+วัตถุดิบ, สร้าง Work Order"],
  ["Phase 3 (Purchase)", "สร้าง PR/PO, รับวัตถุดิบ, Stock IN"],
  ["Phase 4 (Production)", "ผลิตตาม Work Order, บันทึกผ่าน Handy"],
  ["Phase 5 (Shipment)", "Stock OUT, Shipment Tag, Invoice"],
];

slide3.addTable(phases, {
  x: 0.3, y: 3.5, w: 9.4, h: 1.8,
  fontSize: 13,
  fontFace: "TH Sarabun New",
  color: colors.dark,
  border: { pt: 0.5, color: "CCCCCC" },
  colW: [2, 7.4],
});

// ============ SLIDE 4: Key Modules ============
let slide4 = pptx.addSlide();
slide4.addText("3. โมดูลหลัก (Key Modules)", {
  x: 0.5, y: 0.3, w: 9, h: 0.6,
  fontSize: 32, bold: true, color: colors.success,
  fontFace: "TH Sarabun New",
});

const modules = [
  [{ text: "Module", options: { bold: true, fill: { color: "E8E8E8" } } }, { text: "ฟังก์ชันหลัก", options: { bold: true, fill: { color: "E8E8E8" } } }],
  ["1. Sales", "Import Order, Delivery Note, Invoice"],
  ["2. MRP", "คำนวณความต้องการผลิต+วัตถุดิบอัตโนมัติ"],
  ["3. Production", "Production Plan, Work Order, Production Tag"],
  ["4. Purchase", "PR, PO, Receive Material จาก Supplier"],
  ["5. Inventory", "Stock IN/OUT, Warehouse, Barcode/QR Scan"],
  ["6. Shipment", "Delivery, Shipment Tag, Tracking"],
  ["7. Dashboard", "Real-time Status, KPI, Alert Notification"],
];

slide4.addTable(modules, {
  x: 0.5, y: 1.1, w: 9, h: 3.5,
  fontSize: 16,
  fontFace: "TH Sarabun New",
  color: colors.dark,
  border: { pt: 1, color: "CCCCCC" },
  colW: [2.5, 6.5],
});

// ============ SLIDE 5: RBAC ============
let slide5 = pptx.addSlide();
slide5.addText("4. สิทธิ์การเข้าถึง (RBAC)", {
  x: 0.5, y: 0.3, w: 9, h: 0.6,
  fontSize: 32, bold: true, color: colors.danger,
  fontFace: "TH Sarabun New",
});

const rbac = [
  [{ text: "Role", options: { bold: true, fill: { color: "E8E8E8" } } },
   { text: "Sale", options: { bold: true, fill: { color: "E8E8E8" } } },
   { text: "MRP", options: { bold: true, fill: { color: "E8E8E8" } } },
   { text: "Prod", options: { bold: true, fill: { color: "E8E8E8" } } },
   { text: "Purch", options: { bold: true, fill: { color: "E8E8E8" } } },
   { text: "Stock", options: { bold: true, fill: { color: "E8E8E8" } } },
   { text: "Ship", options: { bold: true, fill: { color: "E8E8E8" } } }],
  ["ฝ่ายขาย", "✓C", "○", "○", "-", "○", "○"],
  ["วางแผน", "○", "✓C", "✓C", "○", "○", "○"],
  ["ฝ่ายผลิต", "○", "○", "✓C", "○", "✓U", "-"],
  ["จัดซื้อ", "-", "○", "○", "✓C", "✓U", "-"],
  ["คลังสินค้า", "○", "○", "○", "○", "✓C", "✓U"],
  ["จัดส่ง", "○", "-", "○", "-", "✓U", "✓C"],
  ["ผู้บริหาร", "✓A", "✓A", "✓A", "✓A", "✓A", "✓A"],
];

slide5.addTable(rbac, {
  x: 0.3, y: 1, w: 9.4, h: 3.2,
  fontSize: 14,
  fontFace: "TH Sarabun New",
  color: colors.dark,
  border: { pt: 1, color: "CCCCCC" },
  colW: [1.8, 1.2, 1.2, 1.2, 1.2, 1.2, 1.2],
  align: "center",
});

slide5.addText("✓C = Create  |  ✓U = Update  |  ✓A = Approve/All  |  ○ = Read-only  |  - = No access", {
  x: 0.5, y: 4.3, w: 9, h: 0.4,
  fontSize: 14, italic: true, color: colors.dark,
  fontFace: "TH Sarabun New",
});

// ============ SLIDE 6: Architecture ============
let slide6 = pptx.addSlide();
slide6.addText("5. สถาปัตยกรรมระบบ (Architecture)", {
  x: 0.5, y: 0.3, w: 9, h: 0.6,
  fontSize: 32, bold: true, color: colors.purple,
  fontFace: "TH Sarabun New",
});

const archLayers = [
  { name: "Frontend (React + Handy Scanner)", color: colors.primary, y: 1 },
  { name: "API Gateway (Auth, Logging)", color: "17A2B8", y: 1.7 },
  { name: "Business Services (Sale | MRP | Production | Purchase | Stock | Shipment)", color: colors.success, y: 2.4 },
  { name: "Database (PostgreSQL + Redis + S3)", color: colors.warning, y: 3.1 },
  { name: "Integration (ERP | Accounting | Supplier Portal | Logistics)", color: colors.purple, y: 3.8 },
];

archLayers.forEach((layer) => {
  slide6.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.5, y: layer.y, w: 9, h: 0.55,
    fill: { color: layer.color },
  });
  slide6.addText(layer.name, {
    x: 0.5, y: layer.y + 0.1, w: 9, h: 0.4,
    fontSize: 16, bold: true, color: colors.white,
    fontFace: "TH Sarabun New", align: "center",
  });
});

// Arrows
for (let i = 0; i < 4; i++) {
  slide6.addText("↓", {
    x: 4.7, y: 1.5 + (i * 0.7), w: 0.6, h: 0.3,
    fontSize: 18, color: colors.dark, align: "center",
  });
}

// ============ SLIDE 7: Risks ============
let slide7 = pptx.addSlide();
slide7.addText("6. ความเสี่ยงและการจัดการ", {
  x: 0.5, y: 0.3, w: 9, h: 0.6,
  fontSize: 32, bold: true, color: colors.warning,
  fontFace: "TH Sarabun New",
});

const risks = [
  [{ text: "ความเสี่ยง", options: { bold: true, fill: { color: colors.warning }, color: colors.white } },
   { text: "การจัดการ (Mitigation)", options: { bold: true, fill: { color: colors.success }, color: colors.white } }],
  ["MRP คำนวณไม่แม่นยำ", "ปรับ Parameter จาก Historical Data, Review รายสัปดาห์"],
  ["Production หยุดชะงัก", "Offline Mode สำหรับ Handy, Auto-sync เมื่อ Online"],
  ["Stock ไม่ตรงกับระบบ", "Barcode/QR Scan ทุกการเคลื่อนไหว, Stock Count รายเดือน"],
  ["Integration กับ ERP ล้มเหลว", "API Testing, Parallel Run 2 เดือนก่อน Go-live"],
  ["User ไม่คุ้นเคยระบบ", "Training แยกตาม Role, Super User ประจำแผนก"],
];

slide7.addTable(risks, {
  x: 0.3, y: 1, w: 9.4, h: 3,
  fontSize: 15,
  fontFace: "TH Sarabun New",
  color: colors.dark,
  border: { pt: 1, color: "CCCCCC" },
  colW: [3.5, 5.9],
});

// ============ SLIDE 8: Success & KPIs ============
let slide8 = pptx.addSlide();
slide8.addText("7. ปัจจัยความสำเร็จ & KPIs", {
  x: 0.5, y: 0.3, w: 9, h: 0.6,
  fontSize: 32, bold: true, color: colors.success,
  fontFace: "TH Sarabun New",
});

const success = [
  ["Real-time Visibility", "ดูสถานะการผลิต, Stock, Order ได้ทันที"],
  ["Accurate Planning", "MRP แม่นยำ ลดการขาด/เกิน Stock"],
  ["Traceability", "ติดตามย้อนกลับได้ทุก Lot (Material → Product → Ship)"],
  ["Efficiency", "ลด Lead Time 20%, ลด Manual Entry 80%"],
];

slide8.addText("Success Factors", {
  x: 0.5, y: 1, w: 3, h: 0.4,
  fontSize: 20, bold: true, color: colors.primary,
  fontFace: "TH Sarabun New",
});

slide8.addTable(success, {
  x: 0.5, y: 1.4, w: 9, h: 1.8,
  fontSize: 15,
  fontFace: "TH Sarabun New",
  color: colors.dark,
  border: { pt: 0.5, color: "CCCCCC" },
  colW: [2.5, 6.5],
});

slide8.addText("KPIs (ตัวชี้วัด)", {
  x: 0.5, y: 3.4, w: 3, h: 0.4,
  fontSize: 20, bold: true, color: colors.primary,
  fontFace: "TH Sarabun New",
});

const kpis = [
  ["On-Time Delivery", "> 95%"],
  ["MRP Accuracy", "> 90%"],
  ["Stock Accuracy", "> 99%"],
  ["Production Yield", "> 98%"],
  ["Lead Time Reduction", "20%"],
  ["User Adoption", "> 95%"],
];

slide8.addTable(kpis, {
  x: 0.5, y: 3.8, w: 5, h: 1.5,
  fontSize: 14,
  fontFace: "TH Sarabun New",
  color: colors.dark,
  border: { pt: 0.5, color: "CCCCCC" },
  colW: [3, 2],
});

// ============ SLIDE 9: Thank You ============
let slide9 = pptx.addSlide();
slide9.addShape(pptx.shapes.RECTANGLE, {
  x: 0, y: 0, w: "100%", h: "100%",
  fill: { color: colors.success },
});
slide9.addText("Thank You", {
  x: 0.5, y: 2, w: 9, h: 1,
  fontSize: 54, bold: true, color: colors.white,
  fontFace: "TH Sarabun New", align: "center",
});
slide9.addText("ระบบ PCS — Production Control System", {
  x: 0.5, y: 3, w: 9, h: 0.5,
  fontSize: 24, color: colors.white,
  fontFace: "TH Sarabun New", align: "center",
});
slide9.addText("Q & A", {
  x: 0.5, y: 4, w: 9, h: 0.5,
  fontSize: 32, color: colors.light,
  fontFace: "TH Sarabun New", align: "center",
});

// Save
pptx.writeFile({ fileName: "../docs/interview/Answer_2_PCS_Production.pptx" })
  .then(() => console.log("✅ Created: docs/interview/Answer_2_PCS_Production.pptx"))
  .catch(err => console.error(err));
