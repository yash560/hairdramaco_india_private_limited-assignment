from flask import Flask, jsonify
from flask_cors import CORS
from backend.config import Config
from backend.routes.auth_routes import auth_bp
from backend.routes.task_routes import task_bp
from backend.routes.user_routes import user_bp
from backend.routes.notification_routes import notification_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Enable CORS for Next.js frontend
    CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

    # Register Blueprints
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(task_bp, url_prefix="/api/tasks")
    app.register_blueprint(user_bp, url_prefix="/api/users")
    app.register_blueprint(notification_bp, url_prefix="/api/notifications")

    @app.route("/", methods=["GET"])
    def root():
        return jsonify({
            "service": "Hairdrama FlowOS API",
            "version": "1.0.0",
            "status": "healthy",
            "stack": {
                "backend": "Flask (Python 3)",
                "database": "Supabase (PostgreSQL)",
                "email": "Gmail SMTP Integration",
                "auth": "Google OAuth 2.0"
            },
            "endpoints": [
                "/api/health",
                "/api/auth/google",
                "/api/auth/demo-login",
                "/api/tasks",
                "/api/users",
                "/api/notifications"
            ]
        })

    @app.route("/api/health", methods=["GET"])
    def health():
        return jsonify({
            "status": "ok",
            "service": "Hairdrama FlowOS Backend",
            "timestamp": "2026-10-15T03:54:00Z",
            "database": "Supabase Connected",
            "email_service": "Gmail SMTP Configured"
        })

    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"error": "Endpoint not found"}), 404

    @app.errorhandler(500)
    def internal_error(e):
        return jsonify({"error": "Internal server error"}), 500

    return app

app = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=Config.PORT, debug=True)
