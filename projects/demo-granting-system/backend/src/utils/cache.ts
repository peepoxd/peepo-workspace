import { createClient, RedisClientType } from 'redis';
import { logger } from './logger';

let client: RedisClientType | null = null;

// Cache policy from PRP:
// - Session: TTL 30m
// - Dashboard: TTL 5m
// - API: TTL 1m
// - Hit Ratio Target: 80%

const getClient = async (): Promise<RedisClientType | null> => {
  if (client) return client;

  try {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    client = createClient({ url: redisUrl });

    client.on('error', (err) => {
      logger.error('Redis Client Error', err);
    });

    await client.connect();
    logger.info('Redis connected');
    return client;
  } catch (error) {
    logger.warn('Redis not available, using in-memory fallback');
    return null;
  }
};

// In-memory fallback
const memoryCache: Map<string, { value: any; expiry: number }> = new Map();

export const cacheGet = async <T>(key: string): Promise<T | null> => {
  try {
    const redis = await getClient();

    if (redis) {
      const value = await redis.get(key);
      return value ? JSON.parse(value) : null;
    }

    // Memory fallback
    const cached = memoryCache.get(key);
    if (cached && cached.expiry > Date.now()) {
      return cached.value as T;
    }
    memoryCache.delete(key);
    return null;
  } catch (error) {
    logger.error('Cache get error', error);
    return null;
  }
};

export const cacheSet = async (key: string, value: any, ttlSeconds: number): Promise<void> => {
  try {
    const redis = await getClient();

    if (redis) {
      await redis.setEx(key, ttlSeconds, JSON.stringify(value));
      return;
    }

    // Memory fallback
    memoryCache.set(key, {
      value,
      expiry: Date.now() + (ttlSeconds * 1000),
    });
  } catch (error) {
    logger.error('Cache set error', error);
  }
};

export const cacheDel = async (pattern: string): Promise<void> => {
  try {
    const redis = await getClient();

    if (redis) {
      if (pattern.includes('*')) {
        const keys = await redis.keys(pattern);
        if (keys.length > 0) {
          await redis.del(keys);
        }
      } else {
        await redis.del(pattern);
      }
      return;
    }

    // Memory fallback
    if (pattern.includes('*')) {
      const prefix = pattern.replace('*', '');
      for (const key of memoryCache.keys()) {
        if (key.startsWith(prefix)) {
          memoryCache.delete(key);
        }
      }
    } else {
      memoryCache.delete(pattern);
    }
  } catch (error) {
    logger.error('Cache delete error', error);
  }
};
