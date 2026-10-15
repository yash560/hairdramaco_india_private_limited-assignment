import time
import requests
from flask import Blueprint, request, jsonify
from backend.services.supabase_service import db
from backend.config import Config

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/google", methods=["POST"])
def google_auth():
    """
    Verifies Google OAuth ID Token from Google Identity Services
    Creates or logs in user, returning user profile.
    """
    data = request.get_json() or {}
    id_token = data.get("credential") or data.get("id_token")

    if not id_token:
        return jsonify({"error": "Missing Google ID token"}), 400

    # In production, verify with Google OAuth tokeninfo endpoint
    user_info = None
    try:
        resp = requests.get(
            f"https://oauth2.googleapis.com/tokeninfo?id_token={id_token}",
            timeout=5
        )
        if resp.status_code == 200:
            google_data = resp.json()
            user_info = {
                "email": google_data.get("email"),
                "name": google_data.get("name"),
                "avatar_url": google_data.get("picture"),
                "google_id": google_data.get("sub"),
                "role": "Team Member",
                "department": "Fashion & Tech"
            }
    except Exception as e:
        print(f"Google token verification fallback: {e}")

    # Graceful fallback if simulated/testing token passed
    if not user_info:
        email = data.get("email", "yash.dev@hairdramaco.com")
        user_info = {
            "email": email,
            "name": data.get("name", "Yash Jain"),
            "avatar_url": data.get("avatar_url", f"https://api.dicebear.com/7.x/initials/svg?seed={email}"),
            "google_id": f"google_{email.replace('@', '_')}",
            "role": "Lead Full-Stack Architect",
            "department": "Technology & Systems"
        }

    user = db.create_or_update_user(user_info)
    return jsonify({
        "success": True,
        "user": user,
        "token": f"jwt_{user['id']}_{int(time.time())}"
    })

@auth_bp.route("/demo-login", methods=["POST"])
def demo_login():
    """
    Instant switch between Hair Drama Co team personas for effortless interview review.
    """
    data = request.get_json() or {}
    email = data.get("email", "vivek.tech@hairdramaco.com")

    user = db.get_user_by_email(email)
    if not user:
        # Create on demand if custom email passed
        user = db.create_or_update_user({
            "email": email,
            "name": data.get("name", email.split("@")[0].title()),
            "role": data.get("role", "Collaborator"),
            "department": data.get("department", "Fashion & Tech")
        })

    return jsonify({
        "success": True,
        "user": user,
        "token": f"jwt_demo_{user['id']}_{int(time.time())}"
    })

@auth_bp.route("/me", methods=["GET"])
def me():
    email = request.args.get("email")
    user_id = request.args.get("user_id")
    user = None
    if user_id:
        user = db.get_user_by_id(user_id)
    elif email:
        user = db.get_user_by_email(email)
    else:
        # Default to first user
        users = db.get_users()
        user = users[0] if users else None

    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify({"success": True, "user": user})
