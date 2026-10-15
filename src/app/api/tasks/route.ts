import { NextRequest, NextResponse } from 'next/server';
import { getServerStore } from '@/lib/serverStore';
import { Task, EmailNotification } from '@/types';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');
  const priority = searchParams.get('priority');
  const department = searchParams.get('department');
  const assigneeId = searchParams.get('assignee_id');
  const search = searchParams.get('search');

  const store = getServerStore();
  let tasks = [...store.tasks];

  if (status && status !== 'all') {
    tasks = tasks.filter(t => t.status === status);
  }
  if (priority && priority !== 'all') {
    tasks = tasks.filter(t => t.priority === priority);
  }
  if (department && department !== 'all') {
    tasks = tasks.filter(t => t.department === department);
  }
  if (assigneeId && assigneeId !== 'all') {
    tasks = tasks.filter(t => t.assignee_id === assigneeId);
  }
  if (search) {
    const s = search.toLowerCase();
    tasks = tasks.filter(t => 
      t.title.toLowerCase().includes(s) || 
      (t.description && t.description.toLowerCase().includes(s))
    );
  }

  // Hydrate user references
  tasks = tasks.map(t => ({
    ...t,
    creator: store.users.find(u => u.id === t.creator_id) || t.creator,
    assignee: store.users.find(u => u.id === t.assignee_id) || t.assignee
  }));

  // Sort descending by created_at
  tasks.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return NextResponse.json({
    success: true,
    count: tasks.length,
    tasks
  });
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    if (!data.title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const store = getServerStore();
    const nowIso = new Date().toISOString();
    const creator = store.users.find(u => u.id === data.creator_id) || store.users[0];
    const assignee = store.users.find(u => u.id === data.assignee_id) || null;

    const newTask: Task = {
      id: crypto.randomUUID(),
      title: data.title,
      description: data.description || '',
      status: data.status || 'todo',
      priority: data.priority || 'medium',
      department: data.department || 'General',
      due_date: data.due_date || null,
      creator_id: creator.id,
      creator,
      assignee_id: assignee ? assignee.id : null,
      assignee,
      created_at: nowIso,
      updated_at: nowIso,
      completed_at: data.status === 'completed' ? nowIso : null,
      activities: [
        {
          id: crypto.randomUUID(),
          task_id: '',
          actor: creator,
          action: 'created',
          details: `Task created by ${creator.name}`,
          created_at: nowIso
        }
      ]
    };
    newTask.activities![0].task_id = newTask.id;

    if (assignee) {
      newTask.activities!.push({
        id: crypto.randomUUID(),
        task_id: newTask.id,
        actor: creator,
        action: 'assigned',
        details: `Assigned to ${assignee.name}`,
        created_at: nowIso
      });
    }

    store.tasks.unshift(newTask);

    // Trigger Gmail Notification Dispatch
    let emailDispatch = null;
    if (assignee) {
      const notif: EmailNotification = {
        id: crypto.randomUUID(),
        task_id: newTask.id,
        recipient_email: assignee.email,
        recipient_name: assignee.name,
        subject: `✨ New Task Assigned: ${newTask.title}`,
        event_type: 'task_created',
        status: 'delivered',
        sender_account: 'notifications@hairdramaco.com',
        body_preview: `You have been assigned to "${newTask.title}" by ${creator.name}. Priority: ${newTask.priority.toUpperCase()}.`,
        sent_at: nowIso
      };
      store.notifications.unshift(notif);
      emailDispatch = notif;
    }

    return NextResponse.json({
      success: true,
      task: newTask,
      email_dispatch: emailDispatch
    }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
