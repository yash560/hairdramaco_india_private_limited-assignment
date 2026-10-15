export type TaskStatus = 'todo' | 'in_progress' | 'in_review' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export type Department = 
  | 'Creative & Design'
  | 'Technology & Systems'
  | 'Operations & Logistics'
  | 'Marketing & Growth'
  | 'General';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  role?: string;
  department?: string;
  google_id?: string;
  total_tasks?: number;
  pending_tasks?: number;
  completed_tasks?: number;
}

export interface TaskActivity {
  id: string;
  task_id: string;
  actor_id?: string;
  actor?: User;
  action: 'created' | 'assigned' | 'status_changed' | 'priority_updated' | 'completed' | 'commented' | 'deleted';
  details: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  department: Department;
  due_date?: string | null;
  creator_id: string;
  creator?: User;
  assignee_id?: string | null;
  assignee?: User | null;
  created_at: string;
  updated_at?: string;
  completed_at?: string | null;
  activities?: TaskActivity[];
}

export interface EmailNotification {
  id: string;
  task_id?: string;
  recipient_email: string;
  recipient_name?: string;
  subject: string;
  event_type: 'task_created' | 'task_completed' | 'task_assigned' | 'task_updated';
  status: 'delivered' | 'simulated' | 'failed' | 'queued';
  sender_account: string;
  body_preview?: string;
  sent_at: string;
}

export type ViewMode = 'kanban' | 'table';
