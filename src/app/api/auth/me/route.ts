import { NextRequest, NextResponse } from 'next/server';
import { getServerStore } from '@/lib/serverStore';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');
  const userId = searchParams.get('user_id');

  const store = getServerStore();
  let user = null;

  if (userId) {
    user = store.users.find(u => u.id === userId);
  } else if (email) {
    user = store.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  } else {
    user = store.users[0];
  }

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, user });
}
