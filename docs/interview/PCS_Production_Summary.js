const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
        AlignmentType, BorderStyle, WidthType, ShadingType, VerticalAlign,
        Header, Footer, LevelFormat } = require('docx');
const fs = require('fs');

const tableBorder = { style: BorderStyle.SINGLE, size: 1, color: "999999" };
const cellBorders = { top: tableBorder, bottom: tableBorder, left: tableBorder, right: tableBorder };
const headerShading = { fill: "1E3A5F", type: ShadingType.CLEAR };
const lightShading = { fill: "F5F5F5", type: ShadingType.CLEAR };

const doc = new Document({
  styles: {
    default: { document: { run: { font: "TH Sarabun New", size: 28 } } },
    paragraphStyles: [
      { id: "Title", name: "Title", basedOn: "Normal",
        run: { size: 36, bold: true, color: "1E3A5F", font: "TH Sarabun New" },
        paragraph: { spacing: { before: 0, after: 100 }, alignment: AlignmentType.CENTER } },
      { id: "SectionHeader", name: "SectionHeader", basedOn: "Normal",
        run: { size: 28, bold: true, color: "1E3A5F", font: "TH Sarabun New" },
        paragraph: { spacing: { before: 120, after: 60 } } },
      { id: "Body", name: "Body", basedOn: "Normal",
        run: { size: 24, font: "TH Sarabun New" },
        paragraph: { spacing: { before: 20, after: 20 } } }
    ]
  },
  numbering: {
    config: [
      { reference: "bullet-list",
        levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 360, hanging: 180 } } } }] }
    ]
  },
  sections: [{
    properties: {
      page: {
        margin: { top: 567, right: 567, bottom: 567, left: 567 }, // 1cm margins
        size: { width: 11906, height: 16838 } // A4
      }
    },
    headers: {
      default: new Header({ children: [new Paragraph({
        alignment: AlignmentType.RIGHT,
        children: [new TextRun({ text: "PCS Production Control System", size: 18, color: "666666", font: "TH Sarabun New" })]
      })] })
    },
    children: [
      // Title
      new Paragraph({ style: "Title", children: [new TextRun("ระบบ PCS (Production Control System)")] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 },
        children: [new TextRun({ text: "ระบบควบคุมการผลิตแบบครบวงจร", size: 26, color: "666666", font: "TH Sarabun New" })] }),

      // 1. Overview
      new Paragraph({ style: "SectionHeader", children: [new TextRun("1. ภาพรวมระบบ (Overview)")] }),
      new Paragraph({ style: "Body", children: [
        new TextRun({ text: "วัตถุประสงค์: ", bold: true }),
        new TextRun("บริหารจัดการการผลิตครบวงจร (รับ Order → วางแผน → ผลิต → จัดส่ง)")
      ]}),
      new Paragraph({ style: "Body", children: [
        new TextRun({ text: "ผู้ใช้งาน 6 กลุ่ม: ", bold: true }),
        new TextRun("ฝ่ายขาย, วางแผน, ผลิต, จัดซื้อ, คลังสินค้า, จัดส่ง")
      ]}),
      new Paragraph({ style: "Body", children: [
        new TextRun({ text: "ข้อมูลโครงการ: ", bold: true }),
        new TextRun("ระยะเวลา 10-12 เดือน | งบประมาณ 8-15 ล้านบาท | Agile (2-week sprint)")
      ]}),

      // 2. Workflow
      new Paragraph({ style: "SectionHeader", children: [new TextRun("2. กระบวนการทำงาน (Workflow)")] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 60, after: 60 }, children: [
        new TextRun({ text: "Customer Order → Sale Import → MRP/Production Plan → Purchase → Stock → Shipment", size: 22, font: "TH Sarabun New" })
      ]}),

      // 3. Key Modules Table
      new Paragraph({ style: "SectionHeader", children: [new TextRun("3. โมดูลหลัก (Key Modules)")] }),
      new Table({
        columnWidths: [1800, 3600, 1800, 3600],
        rows: [
          new TableRow({ tableHeader: true, children: [
            new TableCell({ borders: cellBorders, shading: headerShading, width: { size: 1800, type: WidthType.DXA },
              children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Module", bold: true, color: "FFFFFF", size: 22, font: "TH Sarabun New" })] })] }),
            new TableCell({ borders: cellBorders, shading: headerShading, width: { size: 3600, type: WidthType.DXA },
              children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "ฟังก์ชัน", bold: true, color: "FFFFFF", size: 22, font: "TH Sarabun New" })] })] }),
            new TableCell({ borders: cellBorders, shading: headerShading, width: { size: 1800, type: WidthType.DXA },
              children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Module", bold: true, color: "FFFFFF", size: 22, font: "TH Sarabun New" })] })] }),
            new TableCell({ borders: cellBorders, shading: headerShading, width: { size: 3600, type: WidthType.DXA },
              children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "ฟังก์ชัน", bold: true, color: "FFFFFF", size: 22, font: "TH Sarabun New" })] })] })
          ]}),
          new TableRow({ children: [
            new TableCell({ borders: cellBorders, width: { size: 1800, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: "Sales", size: 22, font: "TH Sarabun New" })] })] }),
            new TableCell({ borders: cellBorders, width: { size: 3600, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: "Import Order, Delivery, Invoice", size: 22, font: "TH Sarabun New" })] })] }),
            new TableCell({ borders: cellBorders, width: { size: 1800, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: "Purchase", size: 22, font: "TH Sarabun New" })] })] }),
            new TableCell({ borders: cellBorders, width: { size: 3600, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: "PR, PO, Receive Material", size: 22, font: "TH Sarabun New" })] })] })
          ]}),
          new TableRow({ children: [
            new TableCell({ borders: cellBorders, shading: lightShading, width: { size: 1800, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: "MRP", size: 22, font: "TH Sarabun New" })] })] }),
            new TableCell({ borders: cellBorders, shading: lightShading, width: { size: 3600, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: "คำนวณความต้องการผลิต+วัตถุดิบ", size: 22, font: "TH Sarabun New" })] })] }),
            new TableCell({ borders: cellBorders, shading: lightShading, width: { size: 1800, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: "Inventory", size: 22, font: "TH Sarabun New" })] })] }),
            new TableCell({ borders: cellBorders, shading: lightShading, width: { size: 3600, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: "Stock IN/OUT, Warehouse", size: 22, font: "TH Sarabun New" })] })] })
          ]}),
          new TableRow({ children: [
            new TableCell({ borders: cellBorders, width: { size: 1800, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: "Production", size: 22, font: "TH Sarabun New" })] })] }),
            new TableCell({ borders: cellBorders, width: { size: 3600, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: "Plan, Work Order, Tag", size: 22, font: "TH Sarabun New" })] })] }),
            new TableCell({ borders: cellBorders, width: { size: 1800, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: "Shipment", size: 22, font: "TH Sarabun New" })] })] }),
            new TableCell({ borders: cellBorders, width: { size: 3600, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: "Delivery, Tracking", size: 22, font: "TH Sarabun New" })] })] })
          ]})
        ]
      }),

      // 4. RBAC
      new Paragraph({ style: "SectionHeader", children: [new TextRun("4. สิทธิ์การเข้าถึง (RBAC)")] }),
      new Table({
        columnWidths: [1500, 1350, 1350, 1350, 1350, 1350, 1350],
        rows: [
          new TableRow({ tableHeader: true, children: [
            new TableCell({ borders: cellBorders, shading: headerShading, width: { size: 1500, type: WidthType.DXA }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Role", bold: true, color: "FFFFFF", size: 20, font: "TH Sarabun New" })] })] }),
            new TableCell({ borders: cellBorders, shading: headerShading, width: { size: 1350, type: WidthType.DXA }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Sale", bold: true, color: "FFFFFF", size: 20, font: "TH Sarabun New" })] })] }),
            new TableCell({ borders: cellBorders, shading: headerShading, width: { size: 1350, type: WidthType.DXA }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "MRP", bold: true, color: "FFFFFF", size: 20, font: "TH Sarabun New" })] })] }),
            new TableCell({ borders: cellBorders, shading: headerShading, width: { size: 1350, type: WidthType.DXA }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Produce", bold: true, color: "FFFFFF", size: 20, font: "TH Sarabun New" })] })] }),
            new TableCell({ borders: cellBorders, shading: headerShading, width: { size: 1350, type: WidthType.DXA }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Purchase", bold: true, color: "FFFFFF", size: 20, font: "TH Sarabun New" })] })] }),
            new TableCell({ borders: cellBorders, shading: headerShading, width: { size: 1350, type: WidthType.DXA }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Stock", bold: true, color: "FFFFFF", size: 20, font: "TH Sarabun New" })] })] }),
            new TableCell({ borders: cellBorders, shading: headerShading, width: { size: 1350, type: WidthType.DXA }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Ship", bold: true, color: "FFFFFF", size: 20, font: "TH Sarabun New" })] })] })
          ]}),
          new TableRow({ children: [
            new TableCell({ borders: cellBorders, width: { size: 1500, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: "ฝ่ายขาย", size: 20, font: "TH Sarabun New" })] })] }),
            new TableCell({ borders: cellBorders, width: { size: 1350, type: WidthType.DXA }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "✓C", size: 20, font: "TH Sarabun New" })] })] }),
            new TableCell({ borders: cellBorders, width: { size: 1350, type: WidthType.DXA }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "○", size: 20, font: "TH Sarabun New" })] })] }),
            new TableCell({ borders: cellBorders, width: { size: 1350, type: WidthType.DXA }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "○", size: 20, font: "TH Sarabun New" })] })] }),
            new TableCell({ borders: cellBorders, width: { size: 1350, type: WidthType.DXA }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "-", size: 20, font: "TH Sarabun New" })] })] }),
            new TableCell({ borders: cellBorders, width: { size: 1350, type: WidthType.DXA }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "○", size: 20, font: "TH Sarabun New" })] })] }),
            new TableCell({ borders: cellBorders, width: { size: 1350, type: WidthType.DXA }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "○", size: 20, font: "TH Sarabun New" })] })] })
          ]}),
          new TableRow({ children: [
            new TableCell({ borders: cellBorders, shading: lightShading, width: { size: 1500, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: "วางแผน", size: 20, font: "TH Sarabun New" })] })] }),
            new TableCell({ borders: cellBorders, shading: lightShading, width: { size: 1350, type: WidthType.DXA }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "○", size: 20, font: "TH Sarabun New" })] })] }),
            new TableCell({ borders: cellBorders, shading: lightShading, width: { size: 1350, type: WidthType.DXA }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "✓C", size: 20, font: "TH Sarabun New" })] })] }),
            new TableCell({ borders: cellBorders, shading: lightShading, width: { size: 1350, type: WidthType.DXA }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "✓C", size: 20, font: "TH Sarabun New" })] })] }),
            new TableCell({ borders: cellBorders, shading: lightShading, width: { size: 1350, type: WidthType.DXA }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "○", size: 20, font: "TH Sarabun New" })] })] }),
            new TableCell({ borders: cellBorders, shading: lightShading, width: { size: 1350, type: WidthType.DXA }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "○", size: 20, font: "TH Sarabun New" })] })] }),
            new TableCell({ borders: cellBorders, shading: lightShading, width: { size: 1350, type: WidthType.DXA }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "○", size: 20, font: "TH Sarabun New" })] })] })
          ]}),
          new TableRow({ children: [
            new TableCell({ borders: cellBorders, width: { size: 1500, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: "ผู้บริหาร", size: 20, font: "TH Sarabun New" })] })] }),
            new TableCell({ borders: cellBorders, width: { size: 1350, type: WidthType.DXA }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "✓A", size: 20, font: "TH Sarabun New" })] })] }),
            new TableCell({ borders: cellBorders, width: { size: 1350, type: WidthType.DXA }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "✓A", size: 20, font: "TH Sarabun New" })] })] }),
            new TableCell({ borders: cellBorders, width: { size: 1350, type: WidthType.DXA }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "✓A", size: 20, font: "TH Sarabun New" })] })] }),
            new TableCell({ borders: cellBorders, width: { size: 1350, type: WidthType.DXA }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "✓A", size: 20, font: "TH Sarabun New" })] })] }),
            new TableCell({ borders: cellBorders, width: { size: 1350, type: WidthType.DXA }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "✓A", size: 20, font: "TH Sarabun New" })] })] }),
            new TableCell({ borders: cellBorders, width: { size: 1350, type: WidthType.DXA }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "✓A", size: 20, font: "TH Sarabun New" })] })] })
          ]})
        ]
      }),
      new Paragraph({ style: "Body", children: [new TextRun({ text: "(✓C=Create, ✓U=Update, ✓A=Approve/All, ○=Read-only, -=No access)", size: 18, color: "666666", font: "TH Sarabun New" })] }),

      // 5. Architecture
      new Paragraph({ style: "SectionHeader", children: [new TextRun("5. สถาปัตยกรรม (Architecture)")] }),
      new Paragraph({ style: "Body", children: [
        new TextRun({ text: "Frontend: ", bold: true }),
        new TextRun("React + Handy Device (Scanner) → "),
        new TextRun({ text: "API Gateway: ", bold: true }),
        new TextRun("Auth, Logging → "),
        new TextRun({ text: "Services: ", bold: true }),
        new TextRun("Sale, MRP, Prod, Purchase, Stock, Ship")
      ]}),
      new Paragraph({ style: "Body", children: [
        new TextRun({ text: "Database: ", bold: true }),
        new TextRun("PostgreSQL + Redis (Cache) + S3 (Files) → "),
        new TextRun({ text: "Integration: ", bold: true }),
        new TextRun("ERP, Accounting, Supplier Portal, Logistics")
      ]}),

      // 6. Risks & Mitigation
      new Paragraph({ style: "SectionHeader", children: [new TextRun("6. ความเสี่ยงและการแก้ไข (Risks & Mitigation)")] }),
      new Table({
        columnWidths: [3300, 7500],
        rows: [
          new TableRow({ tableHeader: true, children: [
            new TableCell({ borders: cellBorders, shading: headerShading, width: { size: 3300, type: WidthType.DXA }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "ความเสี่ยง", bold: true, color: "FFFFFF", size: 20, font: "TH Sarabun New" })] })] }),
            new TableCell({ borders: cellBorders, shading: headerShading, width: { size: 7500, type: WidthType.DXA }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "การแก้ไข", bold: true, color: "FFFFFF", size: 20, font: "TH Sarabun New" })] })] })
          ]}),
          new TableRow({ children: [
            new TableCell({ borders: cellBorders, width: { size: 3300, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: "MRP ไม่แม่นยำ", size: 20, font: "TH Sarabun New" })] })] }),
            new TableCell({ borders: cellBorders, width: { size: 7500, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: "ปรับ Parameter ตาม Historical Data, Review รายสัปดาห์", size: 20, font: "TH Sarabun New" })] })] })
          ]}),
          new TableRow({ children: [
            new TableCell({ borders: cellBorders, shading: lightShading, width: { size: 3300, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: "Production หยุดชะงัก", size: 20, font: "TH Sarabun New" })] })] }),
            new TableCell({ borders: cellBorders, shading: lightShading, width: { size: 7500, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: "Offline Mode + Auto-sync เมื่อกลับมา Online", size: 20, font: "TH Sarabun New" })] })] })
          ]}),
          new TableRow({ children: [
            new TableCell({ borders: cellBorders, width: { size: 3300, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: "Stock ไม่ตรง", size: 20, font: "TH Sarabun New" })] })] }),
            new TableCell({ borders: cellBorders, width: { size: 7500, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: "Barcode/QR Scan ทุกการเคลื่อนไหว, Stock Count รายเดือน", size: 20, font: "TH Sarabun New" })] })] })
          ]})
        ]
      }),

      // 7. Success Factors & KPIs
      new Paragraph({ style: "SectionHeader", children: [new TextRun("7. ปัจจัยสำเร็จและ KPIs")] }),
      new Table({
        columnWidths: [5400, 5400],
        rows: [
          new TableRow({ tableHeader: true, children: [
            new TableCell({ borders: cellBorders, shading: headerShading, width: { size: 5400, type: WidthType.DXA }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Success Factors", bold: true, color: "FFFFFF", size: 20, font: "TH Sarabun New" })] })] }),
            new TableCell({ borders: cellBorders, shading: headerShading, width: { size: 5400, type: WidthType.DXA }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "KPIs", bold: true, color: "FFFFFF", size: 20, font: "TH Sarabun New" })] })] })
          ]}),
          new TableRow({ children: [
            new TableCell({ borders: cellBorders, width: { size: 5400, type: WidthType.DXA }, children: [
              new Paragraph({ children: [new TextRun({ text: "• Real-time Visibility - ดูสถานะได้ทันที", size: 20, font: "TH Sarabun New" })] }),
              new Paragraph({ children: [new TextRun({ text: "• Accurate Planning - MRP แม่นยำ", size: 20, font: "TH Sarabun New" })] }),
              new Paragraph({ children: [new TextRun({ text: "• Traceability - ย้อนกลับได้ทุก Lot", size: 20, font: "TH Sarabun New" })] }),
              new Paragraph({ children: [new TextRun({ text: "• Efficiency - ลด Lead Time & Manual Entry", size: 20, font: "TH Sarabun New" })] })
            ]}),
            new TableCell({ borders: cellBorders, width: { size: 5400, type: WidthType.DXA }, children: [
              new Paragraph({ children: [new TextRun({ text: "• On-Time Delivery: > 95%", size: 20, font: "TH Sarabun New" })] }),
              new Paragraph({ children: [new TextRun({ text: "• MRP Accuracy: > 90%", size: 20, font: "TH Sarabun New" })] }),
              new Paragraph({ children: [new TextRun({ text: "• Stock Accuracy: > 99%", size: 20, font: "TH Sarabun New" })] }),
              new Paragraph({ children: [new TextRun({ text: "• Lead Time Reduction: 20%", size: 20, font: "TH Sarabun New" })] })
            ]})
          ]})
        ]
      }),

      // Footer note
      new Paragraph({ spacing: { before: 200 }, alignment: AlignmentType.CENTER, children: [
        new TextRun({ text: "จุดเด่น: End-to-End Flow | MRP Integration | Real-time Tracking | Traceability | Multi-device Support", size: 20, bold: true, color: "1E3A5F", font: "TH Sarabun New" })
      ]})
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("/workspaces/demo-oracle-cli/docs/interview/PCS_Production_Summary.docx", buffer);
  console.log("Created: PCS_Production_Summary.docx");
});
