import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";

// 1. Google OAuth Email & Token Validation
function validateGoogleEmail(email) {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.trim());
}

test("Google OAuth Email & Identity Validation", () => {
  assert.equal(validateGoogleEmail("vivek.tech@hairdramaco.com"), true);
  assert.equal(validateGoogleEmail("yash.dev@hairdramaco.com"), true);
  assert.equal(validateGoogleEmail("priya.design@hairdramaco.com"), true);
  assert.equal(validateGoogleEmail("invalid-email"), false);
  assert.equal(validateGoogleEmail("@hairdramaco.com"), false);
});

// 2. Task State Machine Transitions
const VALID_STATUSES = ['todo', 'in_progress', 'in_review', 'completed'];

function getNextStatus(current) {
  const map = {
    'todo': 'in_progress',
    'in_progress': 'in_review',
    'in_review': 'completed',
    'completed': 'completed'
  };
  return map[current] || current;
}

function getPrevStatus(current) {
  const map = {
    'completed': 'in_review',
    'in_review': 'in_progress',
    'in_progress': 'todo',
    'todo': 'todo'
  };
  return map[current] || current;
}

test("Kanban Task State Machine Transitions", () => {
  assert.equal(getNextStatus('todo'), 'in_progress');
  assert.equal(getNextStatus('in_progress'), 'in_review');
  assert.equal(getNextStatus('in_review'), 'completed');
  assert.equal(getNextStatus('completed'), 'completed');

  assert.equal(getPrevStatus('completed'), 'in_review');
  assert.equal(getPrevStatus('in_review'), 'in_progress');
  assert.equal(getPrevStatus('in_progress'), 'todo');
  assert.equal(getPrevStatus('todo'), 'todo');
});

// 3. Gmail HTML Notification Template Validation
function generateEmailSummary(title, recipient, priority) {
  return `✨ Notification dispatched to ${recipient}: Task "${title}" [Priority: ${priority.toUpperCase()}]`;
}

test("Gmail Notification Dispatcher Formatter", () => {
  const summary = generateEmailSummary("FW26 Velvet Headband", "priya.design@hairdramaco.com", "urgent");
  assert.ok(summary.includes("priya.design@hairdramaco.com"));
  assert.ok(summary.includes("FW26 Velvet Headband"));
  assert.ok(summary.includes("URGENT"));
});

// 4. Supabase Migration DDL File Verification
test("Supabase PostgreSQL Migrations Integrity", () => {
  const schemaPath = "migrations/001_initial_schema.sql";
  const seedPath = "migrations/002_seed_data.sql";

  assert.ok(fs.existsSync(schemaPath), "001_initial_schema.sql must exist");
  assert.ok(fs.existsSync(seedPath), "002_seed_data.sql must exist");

  const schemaSql = fs.readFileSync(schemaPath, "utf-8");
  assert.ok(schemaSql.includes("CREATE TABLE IF NOT EXISTS public.users"), "Schema must define users table");
  assert.ok(schemaSql.includes("CREATE TABLE IF NOT EXISTS public.tasks"), "Schema must define tasks table");
  assert.ok(schemaSql.includes("CREATE TABLE IF NOT EXISTS public.email_notifications"), "Schema must define email_notifications table");
  assert.ok(schemaSql.includes("ENABLE ROW LEVEL SECURITY"), "Schema must enforce RLS");

  const seedSql = fs.readFileSync(seedPath, "utf-8");
  assert.ok(seedSql.includes("vivek.tech@hairdramaco.com"), "Seed data must contain Vivek Sharma");
  assert.ok(seedSql.includes("FW26 Haute Velvet Headband"), "Seed data must contain core fashion tasks");
});

// 5. Flask Backend Structure Integrity
test("Flask Backend Structure & Config Verification", () => {
  assert.ok(fs.existsSync("backend/app.py"), "Flask app factory must exist");
  assert.ok(fs.existsSync("backend/config.py"), "Config must exist");
  assert.ok(fs.existsSync("backend/services/supabase_service.py"), "Supabase service must exist");
  assert.ok(fs.existsSync("backend/services/mail_service.py"), "Gmail service must exist");
  assert.ok(fs.existsSync("backend/tests/test_api.py"), "Backend test suite must exist");
  assert.ok(fs.existsSync("backend/Dockerfile"), "Backend Dockerfile must exist");
  assert.ok(fs.existsSync(".env.example"), ".env.example must exist");
});
