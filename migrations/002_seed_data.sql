-- ====================================================================
-- Hairdrama FlowOS - Supabase PostgreSQL Database Seed Data
-- Migration: 002_seed_data.sql
-- Description: Initial Team Members and Production Tasks for Hair Drama Co
-- ====================================================================

-- 1. Insert Team Members
INSERT INTO public.users (id, email, name, avatar_url, role, department, google_id)
VALUES
    ('11111111-1111-1111-1111-111111111111', 'vivek.tech@hairdramaco.com', 'Vivek Sharma', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80', 'VP of Engineering', 'Technology & Systems', 'google_vivek_sharma'),
    ('22222222-2222-2222-2222-222222222222', 'priya.design@hairdramaco.com', 'Priya Verma', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&q=80', 'Head of Fashion & Accessories', 'Creative & Design', 'google_priya_verma'),
    ('33333333-3333-3333-3333-333333333333', 'rohan.ops@hairdramaco.com', 'Rohan Mehta', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80', 'Supply Chain Director', 'Operations & Logistics', 'google_rohan_mehta'),
    ('44444444-4444-4444-4444-444444444444', 'yash.dev@hairdramaco.com', 'Yash Jain', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80', 'Lead Full-Stack Architect', 'Technology & Systems', 'google_yash_jain'),
    ('55555555-5555-5555-5555-555555555555', 'ananya.marketing@hairdramaco.com', 'Ananya Roy', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80', 'Brand & Influencer Lead', 'Marketing & Growth', 'google_ananya_roy')
ON CONFLICT (email) DO UPDATE SET 
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    department = EXCLUDED.department;

-- 2. Insert Core Fashion & Tech Tasks
INSERT INTO public.tasks (id, title, description, status, priority, department, due_date, creator_id, assignee_id, created_at, completed_at)
VALUES
    (
        'aaaa1111-0000-0000-0000-000000000001',
        'FW26 Haute Velvet Headband Capsule Launch',
        'Finalize jewel-toned baroque embroidery and silk-lined headband prototypes for the Fall/Winter 2026 runway showcase.',
        'in_progress',
        'urgent',
        'Creative & Design',
        NOW() + INTERVAL '3 days',
        '11111111-1111-1111-1111-111111111111',
        '22222222-2222-2222-2222-222222222222',
        NOW() - INTERVAL '2 days',
        NULL
    ),
    (
        'aaaa1111-0000-0000-0000-000000000002',
        'Shopify Plus Fast-Checkout & Cartier Pay Integration',
        'Optimize mobile checkout conversion rate on HairDramaCo.com by eliminating checkout latency and integrating 1-click Express Pay.',
        'todo',
        'high',
        'Technology & Systems',
        NOW() + INTERVAL '5 days',
        '11111111-1111-1111-1111-111111111111',
        '44444444-4444-4444-4444-444444444444',
        NOW() - INTERVAL '1 day',
        NULL
    ),
    (
        'aaaa1111-0000-0000-0000-000000000003',
        'Bespoke Pearl Clip Packaging & Holographic Unboxing',
        'Audit luxury sustainable packaging batches across Mumbai and Surat distribution fulfillment centers.',
        'in_review',
        'medium',
        'Operations & Logistics',
        NOW() + INTERVAL '4 days',
        '22222222-2222-2222-2222-222222222222',
        '33333333-3333-3333-3333-333333333333',
        NOW() - INTERVAL '3 days',
        NULL
    ),
    (
        'aaaa1111-0000-0000-0000-000000000004',
        'Met Gala Red Carpet Styling Influencer Seeding Kit',
        'Coordinate VIP gift hampers containing limited-edition 24K gold-plated hair combs with top celebrity stylists.',
        'completed',
        'urgent',
        'Marketing & Growth',
        NOW() - INTERVAL '1 day',
        '44444444-4444-4444-4444-444444444444',
        '55555555-5555-5555-5555-555555555555',
        NOW() - INTERVAL '5 days',
        NOW() - INTERVAL '1 day'
    ),
    (
        'aaaa1111-0000-0000-0000-000000000005',
        'Automated Gmail Notification & Real-Time SMTP Webhook',
        'Implement production-grade Gmail SMTP notifications triggered whenever a task is created or marked completed.',
        'completed',
        'high',
        'Technology & Systems',
        NOW() - INTERVAL '2 days',
        '11111111-1111-1111-1111-111111111111',
        '44444444-4444-4444-4444-444444444444',
        NOW() - INTERVAL '4 days',
        NOW() - INTERVAL '2 days'
    )
ON CONFLICT (id) DO NOTHING;

-- 3. Insert Initial Email Notification Logs
INSERT INTO public.email_notifications (id, task_id, recipient_email, recipient_name, subject, event_type, status, body_preview, sent_at)
VALUES
    (
        'bbbb1111-0000-0000-0000-000000000001',
        'aaaa1111-0000-0000-0000-000000000001',
        'priya.design@hairdramaco.com',
        'Priya Verma',
        '✨ New Task Assigned: FW26 Haute Velvet Headband Capsule Launch',
        'task_created',
        'delivered',
        'You have been assigned to: FW26 Haute Velvet Headband Capsule Launch by Vivek Sharma. Due in 3 days.',
        NOW() - INTERVAL '2 days'
    ),
    (
        'bbbb1111-0000-0000-0000-000000000002',
        'aaaa1111-0000-0000-0000-000000000004',
        'ananya.marketing@hairdramaco.com',
        'Ananya Roy',
        '✅ Task Completed: Met Gala Red Carpet Styling Influencer Seeding Kit',
        'task_completed',
        'delivered',
        'Task "Met Gala Red Carpet Styling Influencer Seeding Kit" has been marked as COMPLETED by Ananya Roy.',
        NOW() - INTERVAL '1 day'
    )
ON CONFLICT (id) DO NOTHING;
