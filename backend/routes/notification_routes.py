from flask import Blueprint, request, jsonify
from backend.services.supabase_service import db
from backend.services.mail_service import mailer

notification_bp = Blueprint("notifications", __name__)

@notification_bp.route("", methods=["GET"])
def get_notifications():
    limit = int(request.args.get("limit", 50))
    notifications = db.get_email_notifications(limit=limit)
    return jsonify({
        "success": True,
        "count": len(notifications),
        "notifications": notifications
    })

@notification_bp.route("/test-email", methods=["POST"])
def send_test_email():
    data = request.get_json() or {}
    recipient_email = data.get("email", "vivek.tech@hairdramaco.com")
    recipient_name = data.get("name", "Hairdrama Tech Lead")

    dummy_task = {
        "title": "Hairdrama FlowOS Test Notification",
        "description": "Deterministic validation of the Gmail SMTP automated notification webhook.",
        "priority": "high",
        "department": "Technology & Systems",
        "status": "in_progress"
    }

    result = mailer.notify_task_created(
        task=dummy_task,
        creator={"name": "System Administrator", "email": "admin@hairdramaco.com"},
        assignee={"name": recipient_name, "email": recipient_email}
    )

    return jsonify({
        "success": True,
        "message": f"Test notification dispatched to {recipient_email}",
        "result": result
    })
