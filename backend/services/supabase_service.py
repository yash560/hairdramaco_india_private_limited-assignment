import uuid
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional
from backend.config import Config

# Default seed data in memory for offline/resilient execution
INITIAL_USERS = [
    {
        "id": "11111111-1111-1111-1111-111111111111",
        "email": "vivek.tech@hairdramaco.com",
        "name": "Vivek Sharma",
        "avatar_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80",
        "role": "VP of Engineering",
        "department": "Technology & Systems",
        "created_at": "2026-10-10T10:00:00Z"
    },
    {
        "id": "22222222-2222-2222-2222-222222222222",
        "email": "priya.design@hairdramaco.com",
        "name": "Priya Verma",
        "avatar_url": "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&q=80",
        "role": "Head of Fashion & Accessories",
        "department": "Creative & Design",
        "created_at": "2026-10-10T10:00:00Z"
    },
    {
        "id": "33333333-3333-3333-3333-333333333333",
        "email": "rohan.ops@hairdramaco.com",
        "name": "Rohan Mehta",
        "avatar_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80",
        "role": "Supply Chain Director",
        "department": "Operations & Logistics",
        "created_at": "2026-10-10T10:00:00Z"
    },
    {
        "id": "44444444-4444-4444-4444-444444444444",
        "email": "yash.dev@hairdramaco.com",
        "name": "Yash Jain",
        "avatar_url": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80",
        "role": "Lead Full-Stack Architect",
        "department": "Technology & Systems",
        "created_at": "2026-10-10T10:00:00Z"
    },
    {
        "id": "55555555-5555-5555-5555-555555555555",
        "email": "ananya.marketing@hairdramaco.com",
        "name": "Ananya Roy",
        "avatar_url": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80",
        "role": "Brand & Influencer Lead",
        "department": "Marketing & Growth",
        "created_at": "2026-10-10T10:00:00Z"
    }
]

INITIAL_TASKS = [
    {
        "id": "aaaa1111-0000-0000-0000-000000000001",
        "title": "FW26 Haute Velvet Headband Capsule Launch",
        "description": "Finalize jewel-toned baroque embroidery and silk-lined headband prototypes for the Fall/Winter 2026 runway showcase.",
        "status": "in_progress",
        "priority": "urgent",
        "department": "Creative & Design",
        "due_date": "2026-10-20T18:00:00Z",
        "creator_id": "11111111-1111-1111-1111-111111111111",
        "assignee_id": "22222222-2222-2222-2222-222222222222",
        "created_at": "2026-10-13T11:00:00Z",
        "completed_at": None
    },
    {
        "id": "aaaa1111-0000-0000-0000-000000000002",
        "title": "Shopify Plus Fast-Checkout & Cartier Pay Integration",
        "description": "Optimize mobile checkout conversion rate on HairDramaCo.com by eliminating checkout latency and integrating 1-click Express Pay.",
        "status": "todo",
        "priority": "high",
        "department": "Technology & Systems",
        "due_date": "2026-10-22T18:00:00Z",
        "creator_id": "11111111-1111-1111-1111-111111111111",
        "assignee_id": "44444444-4444-4444-4444-444444444444",
        "created_at": "2026-10-14T09:30:00Z",
        "completed_at": None
    },
    {
        "id": "aaaa1111-0000-0000-0000-000000000003",
        "title": "Bespoke Pearl Clip Packaging & Holographic Unboxing",
        "description": "Audit luxury sustainable packaging batches across Mumbai and Surat distribution fulfillment centers.",
        "status": "in_review",
        "priority": "medium",
        "department": "Operations & Logistics",
        "due_date": "2026-10-21T15:00:00Z",
        "creator_id": "22222222-2222-2222-2222-222222222222",
        "assignee_id": "33333333-3333-3333-3333-333333333333",
        "created_at": "2026-10-12T14:00:00Z",
        "completed_at": None
    },
    {
        "id": "aaaa1111-0000-0000-0000-000000000004",
        "title": "Met Gala Red Carpet Styling Influencer Seeding Kit",
        "description": "Coordinate VIP gift hampers containing limited-edition 24K gold-plated hair combs with top celebrity stylists.",
        "status": "completed",
        "priority": "urgent",
        "department": "Marketing & Growth",
        "due_date": "2026-10-14T12:00:00Z",
        "creator_id": "44444444-4444-4444-4444-444444444444",
        "assignee_id": "55555555-5555-5555-5555-555555555555",
        "created_at": "2026-10-10T08:00:00Z",
        "completed_at": "2026-10-14T16:30:00Z"
    },
    {
        "id": "aaaa1111-0000-0000-0000-000000000005",
        "title": "Automated Gmail Notification & Real-Time SMTP Webhook",
        "description": "Implement production-grade Gmail SMTP notifications triggered whenever a task is created or marked completed.",
        "status": "completed",
        "priority": "high",
        "department": "Technology & Systems",
        "due_date": "2026-10-13T17:00:00Z",
        "creator_id": "11111111-1111-1111-1111-111111111111",
        "assignee_id": "44444444-4444-4444-4444-444444444444",
        "created_at": "2026-10-11T11:00:00Z",
        "completed_at": "2026-10-13T18:15:00Z"
    }
]

INITIAL_NOTIFICATIONS = [
    {
        "id": "bbbb1111-0000-0000-0000-000000000001",
        "task_id": "aaaa1111-0000-0000-0000-000000000001",
        "recipient_email": "priya.design@hairdramaco.com",
        "recipient_name": "Priya Verma",
        "subject": "✨ New Task Assigned: FW26 Haute Velvet Headband Capsule Launch",
        "event_type": "task_created",
        "status": "delivered",
        "sender_account": "notifications@hairdramaco.com",
        "body_preview": "You have been assigned to FW26 Haute Velvet Headband Capsule Launch by Vivek Sharma.",
        "sent_at": "2026-10-13T11:00:05Z"
    },
    {
        "id": "bbbb1111-0000-0000-0000-000000000002",
        "task_id": "aaaa1111-0000-0000-0000-000000000004",
        "recipient_email": "ananya.marketing@hairdramaco.com",
        "recipient_name": "Ananya Roy",
        "subject": "✅ Task Completed: Met Gala Red Carpet Styling Influencer Seeding Kit",
        "event_type": "task_completed",
        "status": "delivered",
        "sender_account": "notifications@hairdramaco.com",
        "body_preview": "Task Met Gala Red Carpet Styling Influencer Seeding Kit was marked completed.",
        "sent_at": "2026-10-14T16:30:10Z"
    }
]

class SupabaseService:
    def __init__(self):
        self.supabase = None
        self.users: List[Dict[str, Any]] = [dict(u) for u in INITIAL_USERS]
        self.tasks: List[Dict[str, Any]] = [dict(t) for t in INITIAL_TASKS]
        self.activities: List[Dict[str, Any]] = []
        self.notifications: List[Dict[str, Any]] = [dict(n) for n in INITIAL_NOTIFICATIONS]

        if Config.SUPABASE_URL and Config.SUPABASE_KEY:
            try:
                from supabase import create_client
                self.supabase = create_client(Config.SUPABASE_URL, Config.SUPABASE_KEY)
                print("✓ Successfully connected to remote Supabase instance")
            except Exception as e:
                print(f"! Supabase connection note: {e}. Using resilient in-memory data store.")

    # ------------------ USERS ------------------
    def get_users(self) -> List[Dict[str, Any]]:
        if self.supabase:
            try:
                res = self.supabase.table("users").select("*").execute()
                if res.data:
                    return res.data
            except Exception as e:
                print(f"Supabase get_users error: {e}")
        return self.users

    def get_user_by_id(self, user_id: str) -> Optional[Dict[str, Any]]:
        if self.supabase:
            try:
                res = self.supabase.table("users").select("*").eq("id", user_id).execute()
                if res.data and len(res.data) > 0:
                    return res.data[0]
            except Exception as e:
                print(f"Supabase get_user_by_id error: {e}")
        for u in self.users:
            if u["id"] == user_id:
                return u
        return None

    def get_user_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        if self.supabase:
            try:
                res = self.supabase.table("users").select("*").eq("email", email.lower()).execute()
                if res.data and len(res.data) > 0:
                    return res.data[0]
            except Exception as e:
                print(f"Supabase get_user_by_email error: {e}")
        for u in self.users:
            if u["email"].lower() == email.lower():
                return u
        return None

    def create_or_update_user(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        email = user_data.get("email", "").lower()
        now_iso = datetime.now(timezone.utc).isoformat()

        if self.supabase:
            try:
                payload = {**user_data, "email": email, "updated_at": now_iso}
                res = self.supabase.table("users").upsert(payload, on_conflict="email").execute()
                if res.data and len(res.data) > 0:
                    return res.data[0]
            except Exception as e:
                print(f"Supabase upsert user error: {e}")

        # In-memory upsert
        for idx, u in enumerate(self.users):
            if u["email"].lower() == email:
                updated = {**u, **user_data, "updated_at": now_iso}
                self.users[idx] = updated
                return updated

        new_user = {
            "id": user_data.get("id") or str(uuid.uuid4()),
            "email": email,
            "name": user_data.get("name", "Team Member"),
            "avatar_url": user_data.get("avatar_url", f"https://api.dicebear.com/7.x/initials/svg?seed={email}"),
            "role": user_data.get("role", "Collaborator"),
            "department": user_data.get("department", "Fashion & Tech"),
            "google_id": user_data.get("google_id"),
            "created_at": now_iso,
            "updated_at": now_iso
        }
        self.users.append(new_user)
        return new_user

    # ------------------ TASKS ------------------
    def get_tasks(self, status: Optional[str] = None, priority: Optional[str] = None, 
                  department: Optional[str] = None, assignee_id: Optional[str] = None,
                  search: Optional[str] = None) -> List[Dict[str, Any]]:
        tasks_list = self.tasks

        if self.supabase:
            try:
                query = self.supabase.table("tasks").select("*, creator:creator_id(name, email, avatar_url), assignee:assignee_id(name, email, avatar_url)")
                if status:
                    query = query.eq("status", status)
                if priority:
                    query = query.eq("priority", priority)
                if department:
                    query = query.eq("department", department)
                if assignee_id:
                    query = query.eq("assignee_id", assignee_id)
                res = query.order("created_at", desc=True).execute()
                if res.data is not None:
                    tasks_list = res.data
            except Exception as e:
                print(f"Supabase get_tasks error: {e}")

        # Hydrate local user references
        enriched = []
        for t in tasks_list:
            t_copy = dict(t)
            if "creator" not in t_copy or not t_copy["creator"]:
                creator = self.get_user_by_id(t_copy.get("creator_id", ""))
                t_copy["creator"] = creator if creator else {"name": "System", "email": "system@hairdramaco.com"}
            if "assignee" not in t_copy or not t_copy["assignee"]:
                assignee = self.get_user_by_id(t_copy.get("assignee_id", ""))
                t_copy["assignee"] = assignee if assignee else None

            # Filters
            if status and t_copy.get("status") != status:
                continue
            if priority and t_copy.get("priority") != priority:
                continue
            if department and t_copy.get("department") != department:
                continue
            if assignee_id and t_copy.get("assignee_id") != assignee_id:
                continue
            if search:
                s_lower = search.lower()
                title_match = s_lower in t_copy.get("title", "").lower()
                desc_match = s_lower in t_copy.get("description", "").lower()
                if not (title_match or desc_match):
                    continue

            enriched.append(t_copy)

        return sorted(enriched, key=lambda x: x.get("created_at", ""), reverse=True)

    def get_task_by_id(self, task_id: str) -> Optional[Dict[str, Any]]:
        for t in self.tasks:
            if t["id"] == task_id:
                t_copy = dict(t)
                t_copy["creator"] = self.get_user_by_id(t_copy.get("creator_id", ""))
                t_copy["assignee"] = self.get_user_by_id(t_copy.get("assignee_id", ""))
                t_copy["activities"] = self.get_activities(task_id)
                return t_copy
        return None

    def create_task(self, task_data: Dict[str, Any]) -> Dict[str, Any]:
        now_iso = datetime.now(timezone.utc).isoformat()
        new_task = {
            "id": task_data.get("id") or str(uuid.uuid4()),
            "title": task_data.get("title", "Untitled Task"),
            "description": task_data.get("description", ""),
            "status": task_data.get("status", "todo"),
            "priority": task_data.get("priority", "medium"),
            "department": task_data.get("department", "General"),
            "due_date": task_data.get("due_date"),
            "creator_id": task_data.get("creator_id", "11111111-1111-1111-1111-111111111111"),
            "assignee_id": task_data.get("assignee_id"),
            "created_at": now_iso,
            "updated_at": now_iso,
            "completed_at": now_iso if task_data.get("status") == "completed" else None
        }

        if self.supabase:
            try:
                res = self.supabase.table("tasks").insert(new_task).execute()
                if res.data and len(res.data) > 0:
                    new_task = res.data[0]
            except Exception as e:
                print(f"Supabase create_task error: {e}")

        self.tasks.insert(0, new_task)
        self.log_activity(
            task_id=new_task["id"],
            actor_id=new_task["creator_id"],
            action="created",
            details=f"Task '{new_task['title']}' was created"
        )
        return self.get_task_by_id(new_task["id"]) or new_task

    def update_task(self, task_id: str, updates: Dict[str, Any], actor_id: Optional[str] = None) -> Optional[Dict[str, Any]]:
        now_iso = datetime.now(timezone.utc).isoformat()
        target = None
        for idx, t in enumerate(self.tasks):
            if t["id"] == task_id:
                old_status = t.get("status")
                old_assignee = t.get("assignee_id")
                
                new_status = updates.get("status", old_status)
                if new_status == "completed" and old_status != "completed":
                    updates["completed_at"] = now_iso
                elif new_status != "completed":
                    updates["completed_at"] = None

                updated = {**t, **updates, "updated_at": now_iso}
                self.tasks[idx] = updated
                target = updated

                # Log Activities
                effective_actor = actor_id or updated.get("creator_id")
                if "status" in updates and updates["status"] != old_status:
                    self.log_activity(
                        task_id=task_id,
                        actor_id=effective_actor,
                        action="completed" if updates["status"] == "completed" else "status_changed",
                        details=f"Status changed from {old_status} to {updates['status']}",
                        metadata={"old_status": old_status, "new_status": updates["status"]}
                    )
                if "assignee_id" in updates and updates["assignee_id"] != old_assignee:
                    assignee = self.get_user_by_id(updates["assignee_id"])
                    assignee_name = assignee.get("name", "Team Member") if assignee else "Unassigned"
                    self.log_activity(
                        task_id=task_id,
                        actor_id=effective_actor,
                        action="assigned",
                        details=f"Task assigned to {assignee_name}",
                        metadata={"new_assignee_id": updates["assignee_id"]}
                    )
                break

        if self.supabase and target:
            try:
                self.supabase.table("tasks").update(updates).eq("id", task_id).execute()
            except Exception as e:
                print(f"Supabase update_task error: {e}")

        return self.get_task_by_id(task_id) if target else None

    def delete_task(self, task_id: str) -> bool:
        initial_len = len(self.tasks)
        self.tasks = [t for t in self.tasks if t["id"] != task_id]
        if self.supabase:
            try:
                self.supabase.table("tasks").delete().eq("id", task_id).execute()
            except Exception as e:
                print(f"Supabase delete_task error: {e}")
        return len(self.tasks) < initial_len

    # ------------------ ACTIVITIES ------------------
    def log_activity(self, task_id: str, actor_id: Optional[str], action: str, details: str, metadata: Optional[Dict] = None):
        activity = {
            "id": str(uuid.uuid4()),
            "task_id": task_id,
            "actor_id": actor_id,
            "action": action,
            "details": details,
            "metadata": metadata or {},
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        self.activities.insert(0, activity)
        if self.supabase:
            try:
                self.supabase.table("task_activities").insert(activity).execute()
            except Exception as e:
                pass

    def get_activities(self, task_id: str) -> List[Dict[str, Any]]:
        acts = [a for a in self.activities if a["task_id"] == task_id]
        enriched = []
        for a in acts:
            a_copy = dict(a)
            a_copy["actor"] = self.get_user_by_id(a_copy.get("actor_id", ""))
            enriched.append(a_copy)
        return enriched

    # ------------------ EMAIL NOTIFICATIONS ------------------
    def log_email_notification(self, task_id: Optional[str], recipient_email: str, 
                               recipient_name: str, subject: str, event_type: str, 
                               status: str = "delivered", body_preview: str = "") -> Dict[str, Any]:
        record = {
            "id": str(uuid.uuid4()),
            "task_id": task_id,
            "recipient_email": recipient_email,
            "recipient_name": recipient_name,
            "subject": subject,
            "event_type": event_type,
            "status": status,
            "sender_account": Config.GMAIL_USER,
            "body_preview": body_preview,
            "sent_at": datetime.now(timezone.utc).isoformat()
        }
        self.notifications.insert(0, record)
        if self.supabase:
            try:
                self.supabase.table("email_notifications").insert(record).execute()
            except Exception:
                pass
        return record

    def get_email_notifications(self, limit: int = 50) -> List[Dict[str, Any]]:
        return self.notifications[:limit]

# Singleton instance
db = SupabaseService()
