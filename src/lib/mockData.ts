import { User, Task, EmailNotification } from '@/types';

export const INITIAL_USERS: User[] = [
  {
    id: "11111111-1111-1111-1111-111111111111",
    email: "vivek.tech@hairdramaco.com",
    name: "Vivek Sharma",
    avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80",
    role: "VP of Engineering",
    department: "Technology & Systems"
  },
  {
    id: "22222222-2222-2222-2222-222222222222",
    email: "priya.design@hairdramaco.com",
    name: "Priya Verma",
    avatar_url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&q=80",
    role: "Head of Fashion & Accessories",
    department: "Creative & Design"
  },
  {
    id: "33333333-3333-3333-3333-333333333333",
    email: "rohan.ops@hairdramaco.com",
    name: "Rohan Mehta",
    avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80",
    role: "Supply Chain Director",
    department: "Operations & Logistics"
  },
  {
    id: "44444444-4444-4444-4444-444444444444",
    email: "yash.dev@hairdramaco.com",
    name: "Yash Jain",
    avatar_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80",
    role: "Lead Full-Stack Architect",
    department: "Technology & Systems"
  },
  {
    id: "55555555-5555-5555-5555-555555555555",
    email: "ananya.marketing@hairdramaco.com",
    name: "Ananya Roy",
    avatar_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80",
    role: "Brand & Influencer Lead",
    department: "Marketing & Growth"
  }
];

export const INITIAL_TASKS: Task[] = [
  {
    id: "aaaa1111-0000-0000-0000-000000000001",
    title: "FW26 Haute Velvet Headband Capsule Launch",
    description: "Finalize jewel-toned baroque embroidery and silk-lined headband prototypes for the Fall/Winter 2026 runway showcase.",
    status: "in_progress",
    priority: "urgent",
    department: "Creative & Design",
    due_date: new Date(Date.now() + 3 * 86400000).toISOString(),
    creator_id: "11111111-1111-1111-1111-111111111111",
    creator: INITIAL_USERS[0],
    assignee_id: "22222222-2222-2222-2222-222222222222",
    assignee: INITIAL_USERS[1],
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    activities: [
      {
        id: "act-1",
        task_id: "aaaa1111-0000-0000-0000-000000000001",
        actor: INITIAL_USERS[0],
        action: "created",
        details: "Task created by Vivek Sharma",
        created_at: new Date(Date.now() - 2 * 86400000).toISOString()
      },
      {
        id: "act-2",
        task_id: "aaaa1111-0000-0000-0000-000000000001",
        actor: INITIAL_USERS[0],
        action: "assigned",
        details: "Assigned to Priya Verma",
        created_at: new Date(Date.now() - 2 * 86400000).toISOString()
      }
    ]
  },
  {
    id: "aaaa1111-0000-0000-0000-000000000002",
    title: "Shopify Plus Fast-Checkout & Cartier Pay Integration",
    description: "Optimize mobile checkout conversion rate on HairDramaCo.com by eliminating checkout latency and integrating 1-click Express Pay.",
    status: "todo",
    priority: "high",
    department: "Technology & Systems",
    due_date: new Date(Date.now() + 5 * 86400000).toISOString(),
    creator_id: "11111111-1111-1111-1111-111111111111",
    creator: INITIAL_USERS[0],
    assignee_id: "44444444-4444-4444-4444-444444444444",
    assignee: INITIAL_USERS[3],
    created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    activities: [
      {
        id: "act-3",
        task_id: "aaaa1111-0000-0000-0000-000000000002",
        actor: INITIAL_USERS[0],
        action: "created",
        details: "Task created and assigned to Yash Jain",
        created_at: new Date(Date.now() - 1 * 86400000).toISOString()
      }
    ]
  },
  {
    id: "aaaa1111-0000-0000-0000-000000000003",
    title: "Bespoke Pearl Clip Packaging & Holographic Unboxing",
    description: "Audit luxury sustainable packaging batches across Mumbai and Surat distribution fulfillment centers.",
    status: "in_review",
    priority: "medium",
    department: "Operations & Logistics",
    due_date: new Date(Date.now() + 4 * 86400000).toISOString(),
    creator_id: "22222222-2222-2222-2222-222222222222",
    creator: INITIAL_USERS[1],
    assignee_id: "33333333-3333-3333-3333-333333333333",
    assignee: INITIAL_USERS[2],
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    activities: [
      {
        id: "act-4",
        task_id: "aaaa1111-0000-0000-0000-000000000003",
        actor: INITIAL_USERS[1],
        action: "status_changed",
        details: "Moved to In Review",
        created_at: new Date(Date.now() - 1 * 86400000).toISOString()
      }
    ]
  },
  {
    id: "aaaa1111-0000-0000-0000-000000000004",
    title: "Met Gala Red Carpet Styling Influencer Seeding Kit",
    description: "Coordinate VIP gift hampers containing limited-edition 24K gold-plated hair combs with top celebrity stylists.",
    status: "completed",
    priority: "urgent",
    department: "Marketing & Growth",
    due_date: new Date(Date.now() - 1 * 86400000).toISOString(),
    creator_id: "44444444-4444-4444-4444-444444444444",
    creator: INITIAL_USERS[3],
    assignee_id: "55555555-5555-5555-5555-555555555555",
    assignee: INITIAL_USERS[4],
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    completed_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    activities: [
      {
        id: "act-5",
        task_id: "aaaa1111-0000-0000-0000-000000000004",
        actor: INITIAL_USERS[4],
        action: "completed",
        details: "Marked as completed by Ananya Roy",
        created_at: new Date(Date.now() - 1 * 86400000).toISOString()
      }
    ]
  },
  {
    id: "aaaa1111-0000-0000-0000-000000000005",
    title: "Automated Gmail Notification & Real-Time SMTP Webhook",
    description: "Implement production-grade Gmail SMTP notifications triggered whenever a task is created or marked completed.",
    status: "completed",
    priority: "high",
    department: "Technology & Systems",
    due_date: new Date(Date.now() - 2 * 86400000).toISOString(),
    creator_id: "11111111-1111-1111-1111-111111111111",
    creator: INITIAL_USERS[0],
    assignee_id: "44444444-4444-4444-4444-444444444444",
    assignee: INITIAL_USERS[3],
    created_at: new Date(Date.now() - 4 * 86400000).toISOString(),
    completed_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    activities: [
      {
        id: "act-6",
        task_id: "aaaa1111-0000-0000-0000-000000000005",
        actor: INITIAL_USERS[3],
        action: "completed",
        details: "Verified live SMTP dispatch on port 465",
        created_at: new Date(Date.now() - 2 * 86400000).toISOString()
      }
    ]
  }
];

export const INITIAL_NOTIFICATIONS: EmailNotification[] = [
  {
    id: "bbbb1111-0000-0000-0000-000000000001",
    task_id: "aaaa1111-0000-0000-0000-000000000001",
    recipient_email: "priya.design@hairdramaco.com",
    recipient_name: "Priya Verma",
    subject: "✨ New Task Assigned: FW26 Haute Velvet Headband Capsule Launch",
    event_type: "task_created",
    status: "delivered",
    sender_account: "notifications@hairdramaco.com",
    body_preview: "You have been assigned to: FW26 Haute Velvet Headband Capsule Launch by Vivek Sharma.",
    sent_at: new Date(Date.now() - 2 * 86400000).toISOString()
  },
  {
    id: "bbbb1111-0000-0000-0000-000000000002",
    task_id: "aaaa1111-0000-0000-0000-000000000004",
    recipient_email: "ananya.marketing@hairdramaco.com",
    recipient_name: "Ananya Roy",
    subject: "✅ Task Completed: Met Gala Red Carpet Styling Influencer Seeding Kit",
    event_type: "task_completed",
    status: "delivered",
    sender_account: "notifications@hairdramaco.com",
    body_preview: "Task 'Met Gala Red Carpet Styling Influencer Seeding Kit' has been marked as COMPLETED by Ananya Roy.",
    sent_at: new Date(Date.now() - 1 * 86400000).toISOString()
  }
];
