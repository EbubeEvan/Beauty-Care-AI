/**
 * One-time migration script: Move base64 audio/image data from MongoDB to Cloudflare R2.
 *
 * Usage:
 *   1. Set R2_ENDPOINT, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME, MONGODB_URI in .env.local
 *   2. Run: npx tsx scripts/migrate-to-r2.ts
 *
 * What it does:
 *   - Finds all ChatHistory documents with base64 data URLs in message parts
 *   - Uploads the binary data to R2
 *   - Replaces the base64 URL with the R2 public URL
 *   - Updates the MongoDB document
 */

import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Load env vars
dotenv.config({ path: '.env.local' });

const R2_ENDPOINT = process.env.R2_ENDPOINT!;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID!;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY!;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME!;
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL!;
const MONGODB_URI = process.env.MONGODB_URI!;

if (
  !R2_ENDPOINT ||
  !R2_ACCESS_KEY_ID ||
  !R2_SECRET_ACCESS_KEY ||
  !R2_BUCKET_NAME ||
  !R2_PUBLIC_URL
) {
  console.error('Missing R2 environment variables. Please set them in .env.local');
  process.exit(1);
}

if (!MONGODB_URI) {
  console.error('Missing MONGODB_URI. Please set it in .env.local');
  process.exit(1);
}

const r2Client = new S3Client({
  region: 'auto',
  endpoint: R2_ENDPOINT,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

interface MessagePart {
  type: string;
  mediaType?: string;
  filename?: string;
  url?: string;
  text?: string;
  [key: string]: unknown;
}

interface ChatDocument {
  _id: mongoose.Types.ObjectId;
  chatId: string;
  title: string;
  messages: Array<{
    id: string;
    role: string;
    parts: MessagePart[];
    [key: string]: unknown;
  }>;
}

/**
 * Detect if a URL is a base64 data URL.
 */
function isDataUrl(url: string): boolean {
  return url.startsWith('data:');
}

/**
 * Convert a data URL to a Buffer.
 */
function dataUrlToBuffer(dataUrl: string): { buffer: Buffer; ext: string; contentType: string } {
  const [header, data] = dataUrl.split(',');
  const mimeMatch = header.match(/data:([^;]+)/);
  const contentType = mimeMatch?.[1] || 'application/octet-stream';

  const ext = contentType.split('/')[1] || 'bin';
  const buffer = Buffer.from(data, 'base64');

  return { buffer, ext, contentType };
}

/**
 * Upload a buffer to R2 and return the public URL.
 */
async function uploadToR2(buffer: Buffer, key: string, contentType: string): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  });

  await r2Client.send(command);
  return `${R2_PUBLIC_URL}/${key}`;
}

async function migrate() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB.');

  const db = mongoose.connection.db!;
  const collection = db.collection('chathistories');

  // Check collection stats
  const count = await collection.countDocuments();
  console.log(`Collection 'chathistories' has ${count} documents.`);

  if (count === 0) {
    console.log('No documents to migrate.');
    await mongoose.disconnect();
    return;
  }

  // Find all documents
  console.log('Fetching documents...');
  const docs = (await collection.find({}).toArray()) as unknown as ChatDocument[];
  console.log(`Found ${docs.length} chat documents.`);

  let migratedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  for (const doc of docs) {
    let docModified = false;

    for (const msg of doc.messages) {
      if (!msg.parts || !Array.isArray(msg.parts)) continue;

      for (const part of msg.parts) {
        if (part.type !== 'file' || !part.url || !isDataUrl(part.url)) continue;

        try {
          const { buffer, ext, contentType } = dataUrlToBuffer(part.url);
          const key = `migrated/${doc.chatId}/${msg.id}-${Date.now()}.${ext}`;

          console.log(`  Uploading ${key} (${(buffer.length / 1024).toFixed(1)} KB)...`);
          const r2Url = await uploadToR2(buffer, key, contentType);

          part.url = r2Url;
          docModified = true;
          migratedCount++;
        } catch (err) {
          console.error(`  Failed to migrate part in message ${msg.id}:`, err);
          errorCount++;
        }
      }
    }

    if (docModified) {
      try {
        await collection.updateOne({ _id: doc._id }, { $set: { messages: doc.messages } });
        console.log(`Updated chat ${doc.chatId}`);
      } catch (err) {
        console.error(`Failed to update chat ${doc.chatId}:`, err);
        errorCount++;
      }
    } else {
      skippedCount++;
    }
  }

  console.log('\n--- Migration Complete ---');
  console.log(`Migrated: ${migratedCount} file parts`);
  console.log(`Skipped: ${skippedCount} chats (no base64 data)`);
  console.log(`Errors: ${errorCount}`);

  await mongoose.disconnect();
  console.log('Disconnected from MongoDB.');
}

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
