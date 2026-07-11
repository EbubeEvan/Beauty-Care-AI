'use client';

import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';

interface UploadResult {
  key: string;
  url: string;
}

export function useUpload(userId: string) {
  const [isUploading, setIsUploading] = useState(false);

  const uploadFile = useCallback(
    async (file: File): Promise<UploadResult> => {
      if (!userId) {
        throw new Error('User ID not available');
      }

      setIsUploading(true);

      try {
        // 1. Get presigned URL from our API
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            filename: file.name,
            contentType: file.type,
            userId,
          }),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || 'Failed to get upload URL');
        }

        const { uploadUrl, key, publicUrl } = await res.json();

        // 2. Upload directly to R2
        const uploadRes = await fetch(uploadUrl, {
          method: 'PUT',
          body: file,
          headers: { 'Content-Type': file.type },
        });

        if (!uploadRes.ok) {
          throw new Error('Failed to upload file to storage');
        }

        return { key, url: publicUrl };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Upload failed';
        toast.error(message);
        throw error;
      } finally {
        setIsUploading(false);
      }
    },
    [userId],
  );

  return { uploadFile, isUploading };
}
