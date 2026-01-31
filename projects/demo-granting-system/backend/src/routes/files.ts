import { Router, Request, Response } from 'express';
import { authenticate } from '../middleware/auth';
import { uploadFile, getFileUrl, deleteFile, listFiles, BUCKETS } from '../services/fileStorage';
import { logger } from '../utils/logger';

export const filesRouter = Router();

// GET /api/files/:bucket/:objectName - Get file download URL
filesRouter.get('/:bucket/:objectName',
  authenticate,
  async (req: Request, res: Response) => {
    try {
      const { bucket, objectName } = req.params;

      if (!Object.values(BUCKETS).includes(bucket)) {
        return res.status(400).json({ error: 'Invalid bucket' });
      }

      const url = await getFileUrl(bucket, objectName);
      res.json({ url, expiresIn: 3600 });
    } catch (error) {
      logger.error('File download error', error);
      res.status(500).json({ error: 'Failed to get file' });
    }
  }
);

// GET /api/files/:bucket - List files in bucket
filesRouter.get('/:bucket',
  authenticate,
  async (req: Request, res: Response) => {
    try {
      const { bucket } = req.params;
      const prefix = req.query.prefix as string || '';

      if (!Object.values(BUCKETS).includes(bucket)) {
        return res.status(400).json({ error: 'Invalid bucket' });
      }

      const files = await listFiles(bucket, prefix);
      res.json({ files, total: files.length });
    } catch (error) {
      logger.error('File list error', error);
      res.status(500).json({ error: 'Failed to list files' });
    }
  }
);

// POST /api/files/:bucket - Upload file (expects base64 in body for demo)
filesRouter.post('/:bucket',
  authenticate,
  async (req: Request, res: Response) => {
    try {
      const { bucket } = req.params;
      const { filename, content, contentType } = req.body;

      if (!Object.values(BUCKETS).includes(bucket)) {
        return res.status(400).json({ error: 'Invalid bucket' });
      }

      if (!filename || !content) {
        return res.status(400).json({ error: 'filename and content required' });
      }

      const buffer = Buffer.from(content, 'base64');
      const objectName = `${Date.now()}-${filename}`;

      const path = await uploadFile(bucket, objectName, buffer, contentType || 'application/octet-stream');

      logger.info(`File uploaded by ${req.user?.email}: ${path}`);

      res.status(201).json({
        path,
        bucket,
        objectName,
        size: buffer.length,
      });
    } catch (error) {
      logger.error('File upload error', error);
      res.status(500).json({ error: 'Failed to upload file' });
    }
  }
);

// DELETE /api/files/:bucket/:objectName
filesRouter.delete('/:bucket/:objectName',
  authenticate,
  async (req: Request, res: Response) => {
    try {
      const { bucket, objectName } = req.params;

      if (!Object.values(BUCKETS).includes(bucket)) {
        return res.status(400).json({ error: 'Invalid bucket' });
      }

      await deleteFile(bucket, objectName);

      logger.info(`File deleted by ${req.user?.email}: ${bucket}/${objectName}`);

      res.json({ message: 'File deleted' });
    } catch (error) {
      logger.error('File delete error', error);
      res.status(500).json({ error: 'Failed to delete file' });
    }
  }
);
