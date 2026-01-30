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
  BorderStyle,
  HeadingLevel,
  PageOrientation,
  convertInchesToTwip,
} = require("docx");
const fs = require("fs");

// Create document
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
              text: "ระบบ ERP Procurement — กระบวนการจัดซื้อจัดจ้างแบบครบวงจร",
              bold: true,
              size: 32,
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
              text: "บริหารจัดการจัดซื้อจัดจ้างครบวงจร ตั้งแต่ขอซื้อ → อนุมัติ → สั่งซื้อ → รับของ → ชำระเงิน",
              size: 24,
              font: "TH Sarabun New",
            }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "ผู้ใช้งานหลัก: ",
              bold: true,
              size: 24,
              font: "TH Sarabun New",
            }),
            new TextRun({
              text: "ผู้ขอซื้อ | หัวหน้าแผนก | ฝ่ายจัดซื้อ | คลังสินค้า | ฝ่ายบัญชี",
              size: 24,
              font: "TH Sarabun New",
            }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "ระยะเวลา: 8-10 เดือน | งบประมาณ: 5-8 ล้านบาท | วิธีการ: Agile (2-week sprint)",
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
              text: "[ PR ขอซื้อ ] → [ Approve อนุมัติ ] → [ PO สั่งซื้อ ] → [ GR รับของ ] → [ Payment ชำระเงิน ]",
              bold: true,
              size: 24,
              font: "TH Sarabun New",
            }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "• Phase 1 (PR): ",
              bold: true,
              size: 22,
              font: "TH Sarabun New",
            }),
            new TextRun({
              text: "ผู้ขอซื้อสร้างใบขอซื้อ ระบุสินค้า/บริการ แนบเอกสาร ระบบตรวจงบอัตโนมัติ",
              size: 22,
              font: "TH Sarabun New",
            }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "• Phase 2 (Approve): ",
              bold: true,
              size: 22,
              font: "TH Sarabun New",
            }),
            new TextRun({
              text: "หัวหน้าอนุมัติตามวงเงิน ผู้บริหารอนุมัติกรณีเกินวงเงิน",
              size: 22,
              font: "TH Sarabun New",
            }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "• Phase 3 (PO): ",
              bold: true,
              size: 22,
              font: "TH Sarabun New",
            }),
            new TextRun({
              text: "จัดซื้อเปรียบเทียบราคา (≥3 ราย) เลือก Vendor สร้างและส่ง PO",
              size: 22,
              font: "TH Sarabun New",
            }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "• Phase 4 (GR): ",
              bold: true,
              size: 22,
              font: "TH Sarabun New",
            }),
            new TextRun({
              text: "คลังรับของตาม PO ตรวจจำนวน/คุณภาพ บันทึกเข้าระบบ",
              size: 22,
              font: "TH Sarabun New",
            }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "• Phase 5 (Payment): ",
              bold: true,
              size: 22,
              font: "TH Sarabun New",
            }),
            new TextRun({
              text: "3-Way Matching (PO-GR-Invoice) บัญชีอนุมัติ ชำระผ่าน GFMIS",
              size: 22,
              font: "TH Sarabun New",
            }),
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

        // Modules Table
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: "Module", bold: true, size: 22, font: "TH Sarabun New" })] })],
                  shading: { fill: "E8E8E8" },
                }),
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: "ฟังก์ชันหลัก", bold: true, size: 22, font: "TH Sarabun New" })] })],
                  shading: { fill: "E8E8E8" },
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "1. PR", size: 20, font: "TH Sarabun New" })] })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "สร้าง/แก้ไข/ยื่นขอซื้อ, แนบไฟล์, ตรวจงบ", size: 20, font: "TH Sarabun New" })] })] }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "2. Approval", size: 20, font: "TH Sarabun New" })] })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Workflow อนุมัติตามวงเงิน, หลายระดับ", size: 20, font: "TH Sarabun New" })] })] }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "3. Vendor", size: 20, font: "TH Sarabun New" })] })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "ทะเบียน Vendor, ประเมินผล, Blacklist", size: 20, font: "TH Sarabun New" })] })] }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "4. PO", size: 20, font: "TH Sarabun New" })] })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "สร้าง/ส่ง PO, ติดตามสถานะ, แก้ไข/ยกเลิก", size: 20, font: "TH Sarabun New" })] })] }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "5. GR", size: 20, font: "TH Sarabun New" })] })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "รับของ, ตรวจสอบ, Partial/Reject", size: 20, font: "TH Sarabun New" })] })] }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "6. Invoice", size: 20, font: "TH Sarabun New" })] })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "รับ Invoice, 3-Way Matching, อนุมัติจ่าย", size: 20, font: "TH Sarabun New" })] })] }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "7. Dashboard", size: 20, font: "TH Sarabun New" })] })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "สถานะ Real-time, KPI, แจ้งเตือน", size: 20, font: "TH Sarabun New" })] })] }),
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

        // RBAC Table
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Role", bold: true, size: 20, font: "TH Sarabun New" })] })], shading: { fill: "E8E8E8" } }),
                new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "PR", bold: true, size: 20, font: "TH Sarabun New" })] })], shading: { fill: "E8E8E8" } }),
                new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Approve", bold: true, size: 20, font: "TH Sarabun New" })] })], shading: { fill: "E8E8E8" } }),
                new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "PO", bold: true, size: 20, font: "TH Sarabun New" })] })], shading: { fill: "E8E8E8" } }),
                new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "GR", bold: true, size: 20, font: "TH Sarabun New" })] })], shading: { fill: "E8E8E8" } }),
                new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Payment", bold: true, size: 20, font: "TH Sarabun New" })] })], shading: { fill: "E8E8E8" } }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "ผู้ขอซื้อ", size: 20, font: "TH Sarabun New" })] })] }),
                new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "✓C", size: 20, font: "TH Sarabun New", color: "28A745" })] })] }),
                new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "○", size: 20, font: "TH Sarabun New" })] })] }),
                new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "○", size: 20, font: "TH Sarabun New" })] })] }),
                new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "○", size: 20, font: "TH Sarabun New" })] })] }),
                new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "○", size: 20, font: "TH Sarabun New" })] })] }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "หัวหน้า", size: 20, font: "TH Sarabun New" })] })] }),
                new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "○", size: 20, font: "TH Sarabun New" })] })] }),
                new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "✓A", size: 20, font: "TH Sarabun New", color: "007BFF" })] })] }),
                new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "○", size: 20, font: "TH Sarabun New" })] })] }),
                new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "○", size: 20, font: "TH Sarabun New" })] })] }),
                new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "○", size: 20, font: "TH Sarabun New" })] })] }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "จัดซื้อ", size: 20, font: "TH Sarabun New" })] })] }),
                new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "○", size: 20, font: "TH Sarabun New" })] })] }),
                new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "○", size: 20, font: "TH Sarabun New" })] })] }),
                new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "✓C", size: 20, font: "TH Sarabun New", color: "28A745" })] })] }),
                new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "○", size: 20, font: "TH Sarabun New" })] })] }),
                new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "○", size: 20, font: "TH Sarabun New" })] })] }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "คลัง", size: 20, font: "TH Sarabun New" })] })] }),
                new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "-", size: 20, font: "TH Sarabun New" })] })] }),
                new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "-", size: 20, font: "TH Sarabun New" })] })] }),
                new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "○", size: 20, font: "TH Sarabun New" })] })] }),
                new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "✓C", size: 20, font: "TH Sarabun New", color: "28A745" })] })] }),
                new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "-", size: 20, font: "TH Sarabun New" })] })] }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "บัญชี", size: 20, font: "TH Sarabun New" })] })] }),
                new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "○", size: 20, font: "TH Sarabun New" })] })] }),
                new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "○", size: 20, font: "TH Sarabun New" })] })] }),
                new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "○", size: 20, font: "TH Sarabun New" })] })] }),
                new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "○", size: 20, font: "TH Sarabun New" })] })] }),
                new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "✓A", size: 20, font: "TH Sarabun New", color: "007BFF" })] })] }),
              ],
            }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "(✓C=Create, ✓A=Approve, ○=Read-only, -=No access)",
              size: 18,
              font: "TH Sarabun New",
              italics: true,
            }),
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
              text: "Frontend (React) → API Gateway → Business Services (PR/PO/GR/Vendor/Report) → Database (PostgreSQL + S3) → Integration (GFMIS, e-GP, Banking, Inventory)",
              size: 22,
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
            new TextRun({ text: "• User Adoption ต่ำ → ", bold: true, size: 22, font: "TH Sarabun New" }),
            new TextRun({ text: "อบรมผู้ใช้แยกตาม Role, User Manual, Help Desk", size: 22, font: "TH Sarabun New" }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "• Integration ล้มเหลว → ", bold: true, size: 22, font: "TH Sarabun New" }),
            new TextRun({ text: "PoC ก่อน Go-live, API Testing อย่างละเอียด", size: 22, font: "TH Sarabun New" }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "• Data Migration → ", bold: true, size: 22, font: "TH Sarabun New" }),
            new TextRun({ text: "Data Cleansing, Parallel Run 1 เดือน", size: 22, font: "TH Sarabun New" }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "• Security Breach → ", bold: true, size: 22, font: "TH Sarabun New" }),
            new TextRun({ text: "MFA, Audit Log, PDPA Compliance, Penetration Test", size: 22, font: "TH Sarabun New" }),
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
            new TextRun({ text: "✓ Process Efficiency: ", bold: true, size: 22, font: "TH Sarabun New" }),
            new TextRun({ text: "ลดเวลาจัดซื้อ 15→5 วัน, Paperless 100%", size: 22, font: "TH Sarabun New" }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "✓ Transparency: ", bold: true, size: 22, font: "TH Sarabun New" }),
            new TextRun({ text: "Real-time tracking, Audit Trail ครบถ้วน", size: 22, font: "TH Sarabun New" }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "✓ Cost Saving: ", bold: true, size: 22, font: "TH Sarabun New" }),
            new TextRun({ text: "เปรียบเทียบราคาง่าย, ลดจัดซื้อซ้ำซ้อน 10-15%", size: 22, font: "TH Sarabun New" }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "✓ KPIs: ", bold: true, size: 22, font: "TH Sarabun New" }),
            new TextRun({ text: "Lead Time ≤3 วัน | 3-Way Matching >98% | User Adoption >95%", size: 22, font: "TH Sarabun New" }),
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

// Save document
Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync("../docs/interview/Answer_2_Procurement_ERP.docx", buffer);
  console.log("✅ Created: docs/interview/Answer_2_Procurement_ERP.docx");
});
