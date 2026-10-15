import { NextRequest, NextResponse } from 'next/server';
import { getServerStore } from '@/lib/serverStore';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const email = (data.email || 'vivek.tech@hairdramaco.com').toLowerCase();

    const store = getServerStore();
    let user = store.users.find(u => u.email.toLowerCase() === email);

    if (!user) {
      user = {
        id: crypto.randomUUID(),
        email,
        name: data.name || email.split('@')[0].toUpperCase(),
        role: data.role || 'Collaborator',
        department: data.department || 'Fashion & Tech'
      };
      store.users.push(user);
    }

    return NextResponse.json({
      success: true,
      user,
      token: `jwt_demo_${user.id}_${Date.now()}`
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
