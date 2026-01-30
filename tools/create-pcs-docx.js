const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  convertInchesToTwip,
} = require("docx");
const fs = require("fs");

const doc = new Document({
  sections: [
    {
      properties: {
        page: {
          margin: {
            top: convertInchesToTwip(0.5),
            bottom: convertInchesToTwip(0.5),
            left: convertInchesToTwip(0.6),
            right: convertInchesToTwip(0.6),
          },
        },
      },
      children: [
        // Header
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: "ระบบ PCS (Production Control System)",
              bold: true,
              size: 32,
              font: "TH Sarabun New",
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: "ระบบควบคุมการผลิตแบบครบวงจร",
              size: 26,
              font: "TH Sarabun New",
            }),
          ],
        }),

        // 1. OVERVIEW
        new Paragraph({
          spacing: { before: 200 },
          children: [
            new TextRun({
              text: "1. ภาพรวมระบบ (Overview)",
              bold: true,
              size: 26,
              font: "TH Sarabun New",
              color: "2E86AB",
            }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "วัตถุประสงค์: ",
              bold: true,
              size: 24,
              font: "TH Sarabun New",
            }),
            new TextRun({
              text: "บริหารจัดการการผลิตครบวงจร ตั้งแต่รับ Order → วางแผน MRP → ผลิต → จัดส่ง",
              size: 24,
              font: "TH Sarabun New",
            }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "ผู้ใช้งาน 6 กลุ่ม: ",
              bold: true,
              size: 24,
              font: "TH Sarabun New",
            }),
            new TextRun({
              text: "ฝ่ายขาย | วางแผน | ผลิต | จัดซื้อ | คลังสินค้า | จัดส่ง",
              size: 24,
              font: "TH Sarabun New",
            }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "ระยะเวลา: 10-12 เดือน | งบประมาณ: 8-15 ล้านบาท | วิธีการ: Agile",
              size: 22,
              font: "TH Sarabun New",
              italics: true,
            }),
          ],
        }),

        // 2. WORKFLOW
        new Paragraph({
          spacing: { before: 200 },
          children: [
            new TextRun({
              text: "2. กระบวนการทำงาน (Workflow)",
              bold: true,
              size: 26,
              font: "TH Sarabun New",
              color: "2E86AB",
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 100, after: 100 },
          children: [
            new TextRun({
              text: "[ Customer Order ] → [ Sale/Import ] → [ MRP Planning ] → [ Production ] → [ Stock ] → [ Shipment ]",
              bold: true,
              size: 22,
              font: "TH Sarabun New",
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: "↓ MRP Purchase → [ PR ] → [ PO ] → [ Receive Material ] → Stock IN",
              size: 22,
              font: "TH Sarabun New",
            }),
          ],
        }),
        new Paragraph({
          spacing: { before: 80 },
          children: [
            new TextRun({ text: "• Phase 1 (Sales): ", bold: true, size: 22, font: "TH Sarabun New" }),
            new TextRun({ text: "รับ Order จากลูกค้า, Import PO, สร้าง Delivery Note", size: 22, font: "TH Sarabun New" }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "• Phase 2 (MRP): ", bold: true, size: 22, font: "TH Sarabun New" }),
            new TextRun({ text: "คำนวณความต้องการผลิต+วัตถุดิบ, วางแผนการผลิต, สร้าง Work Order", size: 22, font: "TH Sarabun New" }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "• Phase 3 (Purchase): ", bold: true, size: 22, font: "TH Sarabun New" }),
            new TextRun({ text: "สร้าง PR/PO จัดซื้อวัตถุดิบ, รับของเข้าคลัง (Stock IN)", size: 22, font: "TH Sarabun New" }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "• Phase 4 (Production): ", bold: true, size: 22, font: "TH Sarabun New" }),
            new TextRun({ text: "ผลิตตาม Work Order, บันทึกผลผ่าน Handy/Scanner, Production Tag", size: 22, font: "TH Sarabun New" }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "• Phase 5 (Shipment): ", bold: true, size: 22, font: "TH Sarabun New" }),
            new TextRun({ text: "เบิกสินค้า (Stock OUT), สร้าง Shipment Tag, Delivery, ออก Invoice", size: 22, font: "TH Sarabun New" }),
          ],
        }),

        // 3. KEY MODULES
        new Paragraph({
          spacing: { before: 200 },
          children: [
            new TextRun({
              text: "3. โมดูลหลัก (Key Modules)",
              bold: true,
              size: 26,
              font: "TH Sarabun New",
              color: "28A745",
            }),
          ],
        }),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Module", bold: true, size: 22, font: "TH Sarabun New" })] })], shading: { fill: "E8E8E8" } }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "ฟังก์ชันหลัก", bold: true, size: 22, font: "TH Sarabun New" })] })], shading: { fill: "E8E8E8" } }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "1. Sales", size: 20, font: "TH Sarabun New" })] })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Import Order, Delivery Note, Invoice", size: 20, font: "TH Sarabun New" })] })] }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "2. MRP", size: 20, font: "TH Sarabun New" })] })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "คำนวณความต้องการผลิต+วัตถุดิบอัตโนมัติ", size: 20, font: "TH Sarabun New" })] })] }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "3. Production", size: 20, font: "TH Sarabun New" })] })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Plan, Work Order, Production Tag, Result", size: 20, font: "TH Sarabun New" })] })] }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "4. Purchase", size: 20, font: "TH Sarabun New" })] })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "PR, PO, Receive Material จาก Supplier", size: 20, font: "TH Sarabun New" })] })] }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "5. Inventory", size: 20, font: "TH Sarabun New" })] })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Stock IN/OUT, Warehouse, Barcode/QR", size: 20, font: "TH Sarabun New" })] })] }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "6. Shipment", size: 20, font: "TH Sarabun New" })] })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Delivery, Shipment Tag, Tracking", size: 20, font: "TH Sarabun New" })] })] }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "7. Dashboard", size: 20, font: "TH Sarabun New" })] })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Real-time Status, KPI, Alert", size: 20, font: "TH Sarabun New" })] })] }),
              ],
            }),
          ],
        }),

        // 4. RBAC
        new Paragraph({
          spacing: { before: 200 },
          children: [
            new TextRun({
              text: "4. สิทธิ์การเข้าถึง (RBAC)",
              bold: true,
              size: 26,
              font: "TH Sarabun New",
              color: "DC3545",
            }),
          ],
        }),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Role", bold: true, size: 18, font: "TH Sarabun New" })] })], shading: { fill: "E8E8E8" } }),
                new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Sale", bold: true, size: 18, font: "TH Sarabun New" })] })], shading: { fill: "E8E8E8" } }),
                new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "MRP", bold: true, size: 18, font: "TH Sarabun New" })] })], shading: { fill: "E8E8E8" } }),
                new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Prod", bold: true, size: 18, font: "TH Sarabun New" })] })], shading: { fill: "E8E8E8" } }),
                new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Purch", bold: true, size: 18, font: "TH Sarabun New" })] })], shading: { fill: "E8E8E8" } }),
                new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Stock", bold: true, size: 18, font: "TH Sarabun New" })] })], shading: { fill: "E8E8E8" } }),
                new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Ship", bold: true, size: 18, font: "TH Sarabun New" })] })], shading: { fill: "E8E8E8" } }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "ฝ่ายขาย", size: 18, font: "TH Sarabun New" })] })] }),
                new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "✓C", size: 18, color: "28A745" })] })] }),
                new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "○", size: 18 })] })] }),
                new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "○", size: 18 })] })] }),
                new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "-", size: 18 })] })] }),
                new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "○", size: 18 })] })] }),
                new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "○", size: 18 })] })] }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "วางแผน", size: 18, font: "TH Sarabun New" })] })] }),
                new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "○", size: 18 })] })] }),
                new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "✓C", size: 18, color: "28A745" })] })] }),
                new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "✓C", size: 18, color: "28A745" })] })] }),
                new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "○", size: 18 })] })] }),
                new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "○", size: 18 })] })] }),
                new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "○", size: 18 })] })] }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "ฝ่ายผลิต", size: 18, font: "TH Sarabun New" })] })] }),
                new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "○", size: 18 })] })] }),
                new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "○", size: 18 })] })] }),
                new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "✓C", size: 18, color: "28A745" })] })] }),
                new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "○", size: 18 })] })] }),
                new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "✓U", size: 18, color: "007BFF" })] })] }),
                new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "-", size: 18 })] })] }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "จัดซื้อ", size: 18, font: "TH Sarabun New" })] })] }),
                new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "-", size: 18 })] })] }),
                new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "○", size: 18 })] })] }),
                new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "○", size: 18 })] })] }),
                new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "✓C", size: 18, color: "28A745" })] })] }),
                new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "✓U", size: 18, color: "007BFF" })] })] }),
                new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "-", size: 18 })] })] }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "คลัง", size: 18, font: "TH Sarabun New" })] })] }),
                new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "○", size: 18 })] })] }),
                new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "○", size: 18 })] })] }),
                new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "○", size: 18 })] })] }),
                new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "○", size: 18 })] })] }),
                new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "✓C", size: 18, color: "28A745" })] })] }),
                new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "✓U", size: 18, color: "007BFF" })] })] }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "จัดส่ง", size: 18, font: "TH Sarabun New" })] })] }),
                new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "○", size: 18 })] })] }),
                new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "-", size: 18 })] })] }),
                new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "○", size: 18 })] })] }),
                new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "-", size: 18 })] })] }),
                new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "✓U", size: 18, color: "007BFF" })] })] }),
                new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "✓C", size: 18, color: "28A745" })] })] }),
              ],
            }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "(✓C=Create, ✓U=Update, ○=Read-only, -=No access)", size: 16, font: "TH Sarabun New", italics: true }),
          ],
        }),

        // 5. Architecture
        new Paragraph({
          spacing: { before: 200 },
          children: [
            new TextRun({
              text: "5. สถาปัตยกรรมระบบ (Architecture)",
              bold: true,
              size: 26,
              font: "TH Sarabun New",
              color: "6F42C1",
            }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "Frontend (React + Handy Scanner) → API Gateway → Business Services (Sale/MRP/Production/Purchase/Stock/Shipment) → Database (PostgreSQL + Redis + S3) → Integration (ERP, Accounting, Supplier Portal)",
              size: 20,
              font: "TH Sarabun New",
            }),
          ],
        }),

        // 6. Risks
        new Paragraph({
          spacing: { before: 200 },
          children: [
            new TextRun({
              text: "6. ความเสี่ยงและการจัดการ (Risks & Mitigation)",
              bold: true,
              size: 26,
              font: "TH Sarabun New",
              color: "FD7E14",
            }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "• MRP ไม่แม่นยำ → ", bold: true, size: 20, font: "TH Sarabun New" }),
            new TextRun({ text: "ปรับ Parameter จาก Historical Data, Review รายสัปดาห์", size: 20, font: "TH Sarabun New" }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "• Production หยุดชะงัก → ", bold: true, size: 20, font: "TH Sarabun New" }),
            new TextRun({ text: "Offline Mode สำหรับ Handy, Auto-sync เมื่อ Online", size: 20, font: "TH Sarabun New" }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "• Stock ไม่ตรง → ", bold: true, size: 20, font: "TH Sarabun New" }),
            new TextRun({ text: "Barcode/QR Scan ทุกการเคลื่อนไหว, Stock Count รายเดือน", size: 20, font: "TH Sarabun New" }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "• Integration ล้มเหลว → ", bold: true, size: 20, font: "TH Sarabun New" }),
            new TextRun({ text: "API Testing, Parallel Run 2 เดือน", size: 20, font: "TH Sarabun New" }),
          ],
        }),

        // 7. Success Factors
        new Paragraph({
          spacing: { before: 200 },
          children: [
            new TextRun({
              text: "7. ปัจจัยความสำเร็จ (Success Factors & KPIs)",
              bold: true,
              size: 26,
              font: "TH Sarabun New",
              color: "28A745",
            }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "✓ Real-time Visibility: ", bold: true, size: 20, font: "TH Sarabun New" }),
            new TextRun({ text: "ดูสถานะการผลิต, Stock, Order ได้ทันที", size: 20, font: "TH Sarabun New" }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "✓ Traceability: ", bold: true, size: 20, font: "TH Sarabun New" }),
            new TextRun({ text: "ติดตามย้อนกลับได้ทุก Lot (Material → Product → Shipment)", size: 20, font: "TH Sarabun New" }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "✓ Efficiency: ", bold: true, size: 20, font: "TH Sarabun New" }),
            new TextRun({ text: "ลด Lead Time 20%, ลด Manual Entry 80%", size: 20, font: "TH Sarabun New" }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "✓ KPIs: ", bold: true, size: 20, font: "TH Sarabun New" }),
            new TextRun({ text: "On-Time Delivery >95% | MRP Accuracy >90% | Stock Accuracy >99%", size: 20, font: "TH Sarabun New" }),
          ],
        }),

        // Footer
        new Paragraph({
          spacing: { before: 200 },
          alignment: AlignmentType.RIGHT,
          children: [
            new TextRun({
              text: "ผู้จัดทำ: _________________ วันที่: 30 มกราคม 2569",
              size: 20,
              font: "TH Sarabun New",
            }),
          ],
        }),
      ],
    },
  ],
});

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync("../docs/interview/Answer_2_PCS_Production.docx", buffer);
  console.log("✅ Created: docs/interview/Answer_2_PCS_Production.docx");
});
