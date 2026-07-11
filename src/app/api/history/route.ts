import mongoose from 'mongoose';

import dbConnect from '@/database/dbConnect';
import ChatHistory from '@/database/models/chatHistory.model';
import { HistoryType } from '@/lib/types';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return new Response(JSON.stringify({ error: 'User ID is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    await dbConnect();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return new Response(JSON.stringify({ error: 'Invalid user ID' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const userObjectId = new mongoose.Types.ObjectId(id);

    const historyDocs = await ChatHistory.find({ userId: userObjectId })
      .sort({ createdAt: -1 })
      .lean()
      .select({ chatId: 1, title: 1, createdAt: 1, userId: 1 });

    if (!historyDocs?.length) {
      return new Response(JSON.stringify([]), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Return lightweight sidebar data only
    const parsedHistory: HistoryType[] = historyDocs.map((doc) => ({
      userId: String(doc.userId),
      chatId: String(doc.chatId),
      title: doc.title,
      messages: [],
    }));

    return new Response(JSON.stringify(parsedHistory), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Database error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
