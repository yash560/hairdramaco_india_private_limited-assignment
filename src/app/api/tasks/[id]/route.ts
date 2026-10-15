import { NextRequest, NextResponse } from 'next/server';
import { getServerStore } from '@/lib/serverStore';
import { EmailNotification } from '@/types';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const store = getServerStore();
  const task = store.tasks.find(t => t.id === id);

  if (!task) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    task: {
      ...task,
      creator: store.users.find(u => u.id === task.creator_id) || task.creator,
      assignee: store.users.find(u => u.id === task.assignee_id) || task.assignee
    }
  });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await req.json();
    const store = getServerStore();
    const taskIdx = store.tasks.findIndex(t => t.id === id);

    if (taskIdx === -1) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    const currentTask = store.tasks[taskIdx];
    const oldStatus = currentTask.status;
    const oldAssigneeId = currentTask.assignee_id;
    const nowIso = new Date().toISOString();

    const actor = store.users.find(u => u.id === data.actor_id) || currentTask.assignee || store.users[0];
    const newAssignee = data.assignee_id !== undefined ? 
      (store.users.find(u => u.id === data.assignee_id) || null) : currentTask.assignee;

    const updatedTask = {
      ...currentTask,
      ...data,
      assignee_id: data.assignee_id !== undefined ? (newAssignee ? newAssignee.id : null) : currentTask.assignee_id,
      assignee: newAssignee,
      updated_at: nowIso,
      completed_at: data.status === 'completed' ? (currentTask.completed_at || nowIso) : (data.status ? null : currentTask.completed_at)
    };

    if (!updatedTask.activities) {
      updatedTask.activities = [];
    }

    // Audit Log for status change
    if (data.status && data.status !== oldStatus) {
      updatedTask.activities.unshift({
        id: crypto.randomUUID(),
        task_id: id,
        actor,
        action: data.status === 'completed' ? 'completed' : 'status_changed',
        details: `Status updated from ${oldStatus.replace('_', ' ')} to ${data.status.replace('_', ' ')}`,
        created_at: nowIso
      });
    }

    // Audit Log for reassignment
    if (data.assignee_id !== undefined && data.assignee_id !== oldAssigneeId) {
      updatedTask.activities.unshift({
        id: crypto.randomUUID(),
        task_id: id,
        actor,
        action: 'assigned',
        details: newAssignee ? `Reassigned to ${newAssignee.name}` : 'Unassigned',
        created_at: nowIso
      });
    }

    store.tasks[taskIdx] = updatedTask;

    // Trigger Completion Email Dispatch if newly marked completed
    const completionEmails: EmailNotification[] = [];
    if (data.status === 'completed' && oldStatus !== 'completed') {
      const creator = store.users.find(u => u.id === updatedTask.creator_id);
      const recipients = [];
      if (creator && creator.email) recipients.push(creator);
      if (newAssignee && newAssignee.email && newAssignee.email !== creator?.email) {
        recipients.push(newAssignee);
      }

      for (const r of recipients) {
        const notif: EmailNotification = {
          id: crypto.randomUUID(),
          task_id: id,
          recipient_email: r.email,
          recipient_name: r.name,
          subject: `✅ Task Completed: ${updatedTask.title}`,
          event_type: 'task_completed',
          status: 'delivered',
          sender_account: 'notifications@hairdramaco.com',
          body_preview: `Task "${updatedTask.title}" has been successfully completed by ${actor.name}. All milestones verified.`,
          sent_at: nowIso
        };
        store.notifications.unshift(notif);
        completionEmails.push(notif);
      }
    }

    return NextResponse.json({
      success: true,
      task: updatedTask,
      completion_emails: completionEmails
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const store = getServerStore();
  const initLen = store.tasks.length;
  store.tasks = store.tasks.filter(t => t.id !== id);

  if (store.tasks.length === initLen) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    message: `Task ${id} deleted`
  });
}
