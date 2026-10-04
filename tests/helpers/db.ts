import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongod: MongoMemoryServer | null = null;

export async function startInMemoryMongo(): Promise<string> {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  process.env.MONGODB_URI = uri;
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(uri);
  }
  return uri;
}

export async function clearDatabase(): Promise<void> {
  if (mongoose.connection.readyState === 0) return;
  const collections = mongoose.connection.collections;
  await Promise.all(Object.values(collections).map((c) => c.deleteMany({})));
}

export async function stopInMemoryMongo(): Promise<void> {
  await mongoose.disconnect().catch(() => {});
  await mongod?.stop().catch(() => {});
  mongod = null;
}
