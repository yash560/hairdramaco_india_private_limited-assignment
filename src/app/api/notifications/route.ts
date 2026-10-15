import { NextRequest, NextResponse } from 'next/server';
import { getServerStore } from '@/lib/serverStore';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get('limit') || '50', 10);
  const store = getServerStore();

  const notifications = [...store.notifications]
    .sort((a, b) => new Date(b.sent_at).getTime() - new Date(a.sent_at).getTime())
    .slice(0, limit);

  return NextResponse.json({
    success: true,
    count: notifications.length,
    notifications
  });
}
