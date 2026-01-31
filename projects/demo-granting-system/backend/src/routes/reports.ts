import { Router } from 'express';
import { authenticate } from '../middleware/auth';

export const reportsRouter = Router();

// GET /api/reports - List available reports
reportsRouter.get('/', authenticate, (req, res) => {
  res.json({
    reports: [
      { id: 'proposals-summary', name: 'สรุปข้อเสนอโครงการ', format: ['xlsx', 'pdf'] },
      { id: 'budget-utilization', name: 'การใช้งบประมาณ', format: ['xlsx', 'pdf'] },
      { id: 'project-status', name: 'สถานะโครงการ', format: ['xlsx', 'pdf'] },
      { id: 'payment-history', name: 'ประวัติการเบิกจ่าย', format: ['xlsx'] },
    ],
  });
});

// GET /api/reports/:id/export
reportsRouter.get('/:id/export', authenticate, (req, res) => {
  const { id } = req.params;
  const format = req.query.format || 'xlsx';

  // TODO: Generate actual report
  res.json({
    message: `Generating report ${id} in ${format} format - TODO`,
    downloadUrl: `/api/reports/${id}/download?format=${format}`,
  });
});
