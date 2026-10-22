import { Task, User, EmailNotification, TaskStatus, TaskPriority, Department } from '@/types';
import { INITIAL_USERS, INITIAL_TASKS, INITIAL_NOTIFICATIONS } from './mockData';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export const api = {
  // Authentication
  async googleLogin(credential: string, profile?: any): Promise<{ user: User; token: string }> {
    try {
      const res = await fetch(`${BASE_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential, ...profile })
      });
      if (res.ok) {
        const data = await res.json();
        return { user: data.user, token: data.token };
      }
    } catch (e) {
      console.warn('API googleLogin fallback:', e);
    }
    // Fallback
    const user: User = {
      id: crypto.randomUUID(),
      email: profile?.email || 'alex.tech@hairdramaco.com',
      name: profile?.name || 'Alex Vance',
      avatar_url: profile?.avatar_url || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
      role: 'Lead Full-Stack Architect',
      department: 'Technology & Systems'
    };
    return { user, token: `local_${user.id}` };
  },

  async demoLogin(email: string): Promise<{ user: User; token: string }> {
    try {
      const res = await fetch(`${BASE_URL}/auth/demo-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (res.ok) {
        const data = await res.json();
        return { user: data.user, token: data.token };
      }
    } catch (e) {
      console.warn('API demoLogin fallback:', e);
    }
    const found = INITIAL_USERS.find(u => u.email.toLowerCase() === email.toLowerCase()) || INITIAL_USERS[0];
    return { user: found, token: `demo_${found.id}` };
  },

  // Users
  async getUsers(): Promise<User[]> {
    try {
      const res = await fetch(`${BASE_URL}/users`);
      if (res.ok) {
        const data = await res.json();
        return data.users;
      }
    } catch (e) {
      console.warn('API getUsers fallback:', e);
    }
    return INITIAL_USERS;
  },

  // Tasks
  async getTasks(params?: { status?: string; priority?: string; department?: string; assignee_id?: string; search?: string }): Promise<Task[]> {
    try {
      const q = new URLSearchParams();
      if (params?.status && params.status !== 'all') q.set('status', params.status);
      if (params?.priority && params.priority !== 'all') q.set('priority', params.priority);
      if (params?.department && params.department !== 'all') q.set('department', params.department);
      if (params?.assignee_id && params.assignee_id !== 'all') q.set('assignee_id', params.assignee_id);
      if (params?.search) q.set('search', params.search);

      const res = await fetch(`${BASE_URL}/tasks?${q.toString()}`);
      if (res.ok) {
        const data = await res.json();
        return data.tasks;
      }
    } catch (e) {
      console.warn('API getTasks fallback:', e);
    }
    return INITIAL_TASKS;
  },

  async createTask(task: Partial<Task>): Promise<{ task: Task; email_dispatch?: EmailNotification }> {
    try {
      const res = await fetch(`${BASE_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('API createTask fallback:', e);
    }

    const newTask: Task = {
      id: crypto.randomUUID(),
      title: task.title || 'Untitled Task',
      description: task.description || '',
      status: task.status || 'todo',
      priority: task.priority || 'medium',
      department: task.department || 'General',
      due_date: task.due_date || null,
      creator_id: task.creator_id || INITIAL_USERS[0].id,
      creator: INITIAL_USERS.find(u => u.id === task.creator_id) || INITIAL_USERS[0],
      assignee_id: task.assignee_id || null,
      assignee: INITIAL_USERS.find(u => u.id === task.assignee_id) || null,
      created_at: new Date().toISOString()
    };
    return { task: newTask };
  },

  async updateTask(id: string, updates: Partial<Task>, actorId?: string): Promise<{ task: Task; completion_emails?: EmailNotification[] }> {
    try {
      const res = await fetch(`${BASE_URL}/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...updates, actor_id: actorId })
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('API updateTask fallback:', e);
    }

    const existing = INITIAL_TASKS.find(t => t.id === id) || INITIAL_TASKS[0];
    const updated = { ...existing, ...updates, updated_at: new Date().toISOString() };
    return { task: updated };
  },

  async deleteTask(id: string): Promise<boolean> {
    try {
      const res = await fetch(`${BASE_URL}/tasks/${id}`, { method: 'DELETE' });
      if (res.ok) return true;
    } catch (e) {
      console.warn('API deleteTask fallback:', e);
    }
    return true;
  },

  // Notifications
  async getNotifications(limit: number = 50): Promise<EmailNotification[]> {
    try {
      const res = await fetch(`${BASE_URL}/notifications?limit=${limit}`);
      if (res.ok) {
        const data = await res.json();
        return data.notifications;
      }
    } catch (e) {
      console.warn('API getNotifications fallback:', e);
    }
    return INITIAL_NOTIFICATIONS;
  }
};
