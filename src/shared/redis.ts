/* eslint-disable @typescript-eslint/no-explicit-any */
import { Redis } from 'ioredis';
import config from '../config';

const redisUri = () => {
  if (config.redis_url) {
    return config.redis_url;
  }

  throw new Error('Failed to connect Redis.');
};

const redis = new Redis(redisUri());

const set = async (
  key: string,
  value: string,
  EX: any,
  expireTime: number,
): Promise<void> => {
  await redis.set(key, JSON.stringify(value), EX, expireTime);
};

const get = async (key: string): Promise<string | null> => {
  const response = await redis.get(key);

  return JSON.parse(response as string);
};

const del = async (key: string): Promise<void> => {
  await redis.del(key);
};

export const RedisClient = {
  set,
  get,
  del,
};
