import pytest
import sys
import os

# Add project root to sys.path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from backend.app import create_app
from backend.services.supabase_service import db

@pytest.fixture
def client():
    app = create_app()
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client

def test_health_check(client):
    res = client.get("/api/health")
    assert res.status_code == 200
    data = res.get_json()
    assert data["status"] == "ok"
    assert "Hairdrama FlowOS" in data["service"]

def test_demo_login(client):
    res = client.post("/api/auth/demo-login", json={"email": "vivek.tech@hairdramaco.com"})
    assert res.status_code == 200
    data = res.get_json()
    assert data["success"] is True
    assert data["user"]["email"] == "vivek.tech@hairdramaco.com"
    assert data["user"]["name"] == "Vivek Sharma"

def test_get_users(client):
    res = client.get("/api/users")
    assert res.status_code == 200
    data = res.get_json()
    assert data["success"] is True
    assert len(data["users"]) >= 5

def test_create_task_triggers_email(client):
    payload = {
        "title": "SS26 Silk Scarf Velvet Band Prototyping",
        "description": "Coordinate with Paris textile atelier for Mulberry silk swatches.",
        "status": "todo",
        "priority": "high",
        "department": "Creative & Design",
        "due_date": "2026-11-01T12:00:00Z",
        "creator_id": "11111111-1111-1111-1111-111111111111", # Vivek
        "assignee_id": "22222222-2222-2222-2222-222222222222" # Priya
    }
    res = client.post("/api/tasks", json=payload)
    assert res.status_code == 201
    data = res.get_json()
    assert data["success"] is True
    assert data["task"]["title"] == payload["title"]
    # Verify email dispatch was triggered
    assert data["email_dispatch"] is not None
    assert data["email_dispatch"]["recipient"] == "priya.design@hairdramaco.com"

def test_complete_task_triggers_completion_email(client):
    # First create a task
    create_res = client.post("/api/tasks", json={
        "title": "Lakmé Fashion Week Runway Styling Test",
        "creator_id": "11111111-1111-1111-1111-111111111111",
        "assignee_id": "44444444-4444-4444-4444-444444444444",
        "status": "in_progress",
        "priority": "urgent"
    })
    task_id = create_res.get_json()["task"]["id"]

    # Mark as completed
    update_res = client.put(f"/api/tasks/{task_id}", json={
        "status": "completed",
        "actor_id": "44444444-4444-4444-4444-444444444444"
    })
    assert update_res.status_code == 200
    data = update_res.get_json()
    assert data["task"]["status"] == "completed"
    assert len(data["completion_emails"]) > 0

def test_get_notifications_log(client):
    res = client.get("/api/notifications")
    assert res.status_code == 200
    data = res.get_json()
    assert data["success"] is True
    assert len(data["notifications"]) > 0

def test_delete_task(client):
    create_res = client.post("/api/tasks", json={
        "title": "Temporary Task for Deletion",
        "creator_id": "11111111-1111-1111-1111-111111111111",
        "status": "todo"
    })
    task_id = create_res.get_json()["task"]["id"]

    del_res = client.delete(f"/api/tasks/{task_id}")
    assert del_res.status_code == 200
    assert del_res.get_json()["success"] is True
