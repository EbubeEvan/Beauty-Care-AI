import { NextResponse } from 'next/server';

import { getPresignedUploadUrl, R2_PUBLIC_URL } from '@/lib/r2';

const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'audio/webm',
  'audio/mp4',
  'audio/mpeg',
  'audio/ogg',
];

export async function POST(req: Request) {
  try {
    const { filename, contentType, userId } = await req.json();

    if (!filename || !contentType || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields: filename, contentType, userId' },
        { status: 400 },
      );
    }

    const baseType = contentType.split(';')[0].trim();
    if (!ALLOWED_TYPES.includes(baseType)) {
      return NextResponse.json({ error: `File type not allowed: ${contentType}` }, { status: 400 });
    }

    const { uploadUrl, key } = await getPresignedUploadUrl(filename, userId, contentType);
    const publicUrl = `${R2_PUBLIC_URL}/${key}`;

    return NextResponse.json({ uploadUrl, key, publicUrl });
  } catch (error) {
    console.error('Upload URL generation failed:', error);
    return NextResponse.json({ error: 'Failed to generate upload URL' }, { status: 500 });
  }
}
