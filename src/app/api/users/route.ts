import { NextRequest, NextResponse } from 'next/server';
import { getServerStore } from '@/lib/serverStore';
import { User } from '@/types';

export async function GET() {
  const store = getServerStore();
  const enriched = store.users.map(u => {
    const userTasks = store.tasks.filter(t => t.assignee_id === u.id);
    return {
      ...u,
      total_tasks: userTasks.length,
      pending_tasks: userTasks.filter(t => t.status !== 'completed').length,
      completed_tasks: userTasks.filter(t => t.status === 'completed').length
    };
  });

  return NextResponse.json({
    success: true,
    count: enriched.length,
    users: enriched
  });
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    if (!data.email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const store = getServerStore();
    let user = store.users.find(u => u.email.toLowerCase() === data.email.toLowerCase());

    if (!user) {
      user = {
        id: crypto.randomUUID(),
        email: data.email.toLowerCase(),
        name: data.name || data.email.split('@')[0],
        avatar_url: data.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${data.email}`,
        role: data.role || 'Collaborator',
        department: data.department || 'Fashion & Tech'
      };
      store.users.push(user);
    }

    return NextResponse.json({
      success: true,
      user
    }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
