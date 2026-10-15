from flask import Blueprint, request, jsonify
from backend.services.supabase_service import db

user_bp = Blueprint("users", __name__)

@user_bp.route("", methods=["GET"])
def get_users():
    users = db.get_users()
    tasks = db.tasks

    # Attach active task counts
    enriched = []
    for u in users:
        u_copy = dict(u)
        user_tasks = [t for t in tasks if t.get("assignee_id") == u["id"]]
        u_copy["total_tasks"] = len(user_tasks)
        u_copy["pending_tasks"] = len([t for t in user_tasks if t.get("status") != "completed"])
        u_copy["completed_tasks"] = len([t for t in user_tasks if t.get("status") == "completed"])
        enriched.append(u_copy)

    return jsonify({
        "success": True,
        "count": len(enriched),
        "users": enriched
    })

@user_bp.route("", methods=["POST"])
def create_user():
    data = request.get_json() or {}
    email = data.get("email")
    if not email:
        return jsonify({"error": "Email is required"}), 400

    user = db.create_or_update_user(data)
    return jsonify({
        "success": True,
        "user": user
    }), 201
