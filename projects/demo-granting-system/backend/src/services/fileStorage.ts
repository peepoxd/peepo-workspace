import { Client as MinioClient } from 'minio';
import { logger } from '../utils/logger';

// Layer 5c: File Storage (MinIO/S3)
// Separate from App Server per architecture principle

const BUCKETS = {
  PROPOSALS: 'proposals',
  CONTRACTS: 'contracts',
  PAYMENTS: 'payments',
  REPORTS: 'reports',
};

let minioClient: MinioClient | null = null;

const getClient = (): MinioClient => {
  if (!minioClient) {
    minioClient = new MinioClient({
      endPoint: process.env.MINIO_ENDPOINT || 'localhost',
      port: parseInt(process.env.MINIO_PORT || '9000'),
      useSSL: false,
      accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
      secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
    });
  }
  return minioClient;
};

export const initBuckets = async (): Promise<void> => {
  const client = getClient();

  for (const bucket of Object.values(BUCKETS)) {
    try {
      const exists = await client.bucketExists(bucket);
      if (!exists) {
        await client.makeBucket(bucket, 'us-east-1');
        logger.info(`Bucket '${bucket}' created`);
      }
    } catch (error) {
      logger.error(`Failed to create bucket '${bucket}'`, error);
    }
  }
};

export const uploadFile = async (
  bucket: string,
  objectName: string,
  buffer: Buffer,
  contentType: string
): Promise<string> => {
  const client = getClient();

  await client.putObject(bucket, objectName, buffer, buffer.length, {
    'Content-Type': contentType,
  });

  logger.info(`File uploaded: ${bucket}/${objectName}`);
  return `${bucket}/${objectName}`;
};

export const getFileUrl = async (
  bucket: string,
  objectName: string,
  expirySeconds: number = 3600
): Promise<string> => {
  const client = getClient();
  return await client.presignedGetObject(bucket, objectName, expirySeconds);
};

export const deleteFile = async (bucket: string, objectName: string): Promise<void> => {
  const client = getClient();
  await client.removeObject(bucket, objectName);
  logger.info(`File deleted: ${bucket}/${objectName}`);
};

export const listFiles = async (bucket: string, prefix: string = ''): Promise<string[]> => {
  const client = getClient();
  const files: string[] = [];

  const stream = client.listObjects(bucket, prefix, true);

  return new Promise((resolve, reject) => {
    stream.on('data', (obj) => {
      if (obj.name) files.push(obj.name);
    });
    stream.on('error', reject);
    stream.on('end', () => resolve(files));
  });
};

export { BUCKETS };
