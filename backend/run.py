#!/usr/bin/env python3
import os
import sys

# Ensure backend root is on sys.path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.app import app
from backend.config import Config

if __name__ == "__main__":
    print(f"🚀 Starting Hairdrama FlowOS Flask Backend on port {Config.PORT}...")
    app.run(host="0.0.0.0", port=Config.PORT, debug=True)
