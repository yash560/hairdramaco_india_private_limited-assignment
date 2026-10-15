import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv("JWT_SECRET", "super-secret-jwt-signing-key-hairdramaco-2026")
    FLASK_ENV = os.getenv("FLASK_ENV", "production")
    PORT = int(os.getenv("FLASK_PORT", 5000))

    # Supabase Configuration
    SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL", "")
    SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY", ""))

    # Google OAuth 2.0
    GOOGLE_CLIENT_ID = os.getenv("NEXT_PUBLIC_GOOGLE_CLIENT_ID", "")
    GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET", "")

    # Gmail SMTP Integration
    GMAIL_USER = os.getenv("GMAIL_USER", "notifications@hairdramaco.com")
    GMAIL_APP_PASSWORD = os.getenv("GMAIL_APP_PASSWORD", "")
    SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
    SMTP_PORT = int(os.getenv("SMTP_PORT", 465))
    EMAIL_SIMULATION_MODE = os.getenv("EMAIL_SIMULATION_MODE", "true").lower() in ("true", "1", "yes")

    # CORS
    CORS_ORIGINS = [
        origin.strip()
        for origin in os.getenv("CORS_ORIGINS", "*").split(",")
    ]
