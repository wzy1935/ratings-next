import { Storage } from '@google-cloud/storage';
import { PrismaClient } from '@prisma/client';

declare global {
  var GCPStorage: Storage;
  var prismaClient: PrismaClient;
}

const GCP_BASE64 = process.env.GCP_BASE64 as string;

function base64ToJSON(base64String: string) {
  const decodedString = Buffer.from(base64String, 'base64').toString('utf-8');
  const jsonObject = JSON.parse(decodedString);
  return jsonObject;
}

const GCPStorage =
  globalThis.GCPStorage ??
  new Storage({ credentials: base64ToJSON(GCP_BASE64) });
export const imageBucket = GCPStorage.bucket('wzy1935-ratings');

export const prismaClient = globalThis.prismaClient ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.GCPStorage = GCPStorage;
  globalThis.prismaClient = prismaClient;
}
