import { User, Task, EmailNotification } from '@/types';
import { INITIAL_USERS, INITIAL_TASKS, INITIAL_NOTIFICATIONS } from './mockData';

// Global memory cache for Next.js API Routes
declare global {
  var __hairdrama_users: User[] | undefined;
  var __hairdrama_tasks: Task[] | undefined;
  var __hairdrama_notifications: EmailNotification[] | undefined;
}

export function getServerStore() {
  if (!globalThis.__hairdrama_users) {
    globalThis.__hairdrama_users = [...INITIAL_USERS];
  }
  if (!globalThis.__hairdrama_tasks) {
    globalThis.__hairdrama_tasks = [...INITIAL_TASKS];
  }
  if (!globalThis.__hairdrama_notifications) {
    globalThis.__hairdrama_notifications = [...INITIAL_NOTIFICATIONS];
  }

  return {
    users: globalThis.__hairdrama_users,
    tasks: globalThis.__hairdrama_tasks,
    notifications: globalThis.__hairdrama_notifications
  };
}
