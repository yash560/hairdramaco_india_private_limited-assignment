from flask import Blueprint, request, jsonify
from backend.services.supabase_service import db
from backend.services.mail_service import mailer

task_bp = Blueprint("tasks", __name__)

@task_bp.route("", methods=["GET"])
def get_tasks():
    status = request.args.get("status")
    priority = request.args.get("priority")
    department = request.args.get("department")
    assignee_id = request.args.get("assignee_id")
    search = request.args.get("search")

    tasks = db.get_tasks(
        status=status,
        priority=priority,
        department=department,
        assignee_id=assignee_id,
        search=search
    )
    return jsonify({
        "success": True,
        "count": len(tasks),
        "tasks": tasks
    })

@task_bp.route("/<task_id>", methods=["GET"])
def get_task(task_id):
    task = db.get_task_by_id(task_id)
    if not task:
        return jsonify({"error": "Task not found"}), 404
    return jsonify({
        "success": True,
        "task": task
    })

@task_bp.route("", methods=["POST"])
def create_task():
    data = request.get_json() or {}
    title = data.get("title")
    if not title:
        return jsonify({"error": "Task title is required"}), 400

    new_task = db.create_task(data)
    
    # Send email notification to assignee
    creator = db.get_user_by_id(new_task.get("creator_id", ""))
    assignee = db.get_user_by_id(new_task.get("assignee_id", "")) if new_task.get("assignee_id") else None

    email_dispatch = None
    if assignee:
        email_dispatch = mailer.notify_task_created(new_task, creator, assignee)

    return jsonify({
        "success": True,
        "task": new_task,
        "email_dispatch": email_dispatch
    }), 201

@task_bp.route("/<task_id>", methods=["PUT"])
def update_task(task_id):
    data = request.get_json() or {}
    actor_id = data.get("actor_id")

    existing_task = db.get_task_by_id(task_id)
    if not existing_task:
        return jsonify({"error": "Task not found"}), 404

    old_status = existing_task.get("status")
    updated_task = db.update_task(task_id, data, actor_id=actor_id)
    if not updated_task:
        return jsonify({"error": "Failed to update task"}), 500

    # Trigger email notifications if completed
    completion_emails = []
    if updated_task.get("status") == "completed" and old_status != "completed":
        actor = db.get_user_by_id(actor_id) if actor_id else updated_task.get("assignee")
        creator = updated_task.get("creator")
        assignee = updated_task.get("assignee")
        completion_emails = mailer.notify_task_completed(updated_task, actor, creator, assignee)

    return jsonify({
        "success": True,
        "task": updated_task,
        "completion_emails": completion_emails
    })

@task_bp.route("/<task_id>", methods=["DELETE"])
def delete_task(task_id):
    success = db.delete_task(task_id)
    if not success:
        return jsonify({"error": "Task not found or could not be deleted"}), 404
    return jsonify({
        "success": True,
        "message": f"Task {task_id} deleted successfully"
    })
