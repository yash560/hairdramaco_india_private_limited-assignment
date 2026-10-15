import { NextRequest, NextResponse } from 'next/server';
import { getServerStore } from '@/lib/serverStore';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const email = data.email || 'yash.dev@hairdramaco.com';
    const name = data.name || 'Yash Jain';

    const store = getServerStore();
    let user = store.users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      user = {
        id: crypto.randomUUID(),
        email,
        name,
        avatar_url: data.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${email}`,
        role: data.role || 'Lead Full-Stack Architect',
        department: data.department || 'Technology & Systems',
        google_id: data.google_id || `google_${email.replace('@', '_')}`
      };
      store.users.push(user);
    }

    return NextResponse.json({
      success: true,
      user,
      token: `jwt_${user.id}_${Date.now()}`
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Authentication failed' }, { status: 400 });
  }
}
