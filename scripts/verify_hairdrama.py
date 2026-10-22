import subprocess
import time
import requests
import sys
import os
from playwright.sync_api import sync_playwright

PORT = 3015
BASE_URL = f"http://localhost:{PORT}"
PROJECT_DIR = "/home/opc/brane/workspace/assignments/hairdramaco_india_private_limited"

print("=" * 60)
print("HAIRDRAMA FLOWOS — SOVEREIGN VERIFICATION")
print("=" * 60)

# Step 1: Start Next.js server on PORT
print(f"[*] Starting Next.js production server on port {PORT}...")
proc = subprocess.Popen(
    ["npm", "run", "start", "--", "-p", str(PORT)],
    cwd=PROJECT_DIR,
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE,
    text=True
)

try:
    # Wait for server
    ready = False
    for i in range(25):
        try:
            r = requests.get(f"{BASE_URL}/api/health", timeout=1)
            if r.status_code == 200:
                ready = True
                print(f"[+] Server online on {BASE_URL} (took ~{i}s)")
                break
        except Exception:
            time.sleep(1)

    if not ready:
        print("[-] Server failed to respond in time")
        sys.exit(1)

    # Step 2: Test API Endpoints
    print("\n--- PHASE 1: REST API DETERMINISTIC VERIFICATION ---")
    endpoints = [
        ("/api/health", 200),
        ("/api/tasks", 200),
        ("/api/users", 200),
    ]
    for ep, expected in endpoints:
        res = requests.get(f"{BASE_URL}{ep}")
        assert res.status_code == expected, f"Endpoint {ep} returned {res.status_code}, expected {expected}"
        print(f"  ✓ GET {ep} -> {res.status_code} OK")

    # Step 3: Tri-Axis Playwright Inspection
    print("\n--- PHASE 2: TRI-AXIS PLAYWRIGHT VIEWPORT & PRIVACY INSPECTION ---")
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        viewports = [
            ("Mobile", 360, 800),
            ("Tablet", 768, 1024),
            ("Desktop", 1440, 900),
        ]
        
        console_errors = []

        for name, w, h in viewports:
            context = browser.new_context(viewport={"width": w, "height": h})
            page = context.new_page()
            page.on("console", lambda msg: console_errors.append(msg.text) if msg.type == "error" else None)
            
            page.goto(BASE_URL, wait_until="networkidle")
            time.sleep(1)
            
            # Check horizontal overflow
            scroll_w = page.evaluate("() => document.documentElement.scrollWidth")
            client_w = page.evaluate("() => document.documentElement.clientWidth")
            body_scroll_w = page.evaluate("() => document.body.scrollWidth")
            
            print(f"  [{name} {w}x{h}] clientWidth: {client_w}, scrollWidth: {scroll_w}, bodyScroll: {body_scroll_w}")
            assert scroll_w <= client_w + 1, f"Horizontal overflow detected on {name}: scrollWidth ({scroll_w}) > clientWidth ({client_w})"

            # Check Powered by TheWebVale badge
            tbv_count = page.locator("text=Powered by TheWebVale").count()
            print(f"  [{name} {w}x{h}] 'Powered by TheWebVale' occurrences: {tbv_count}")
            assert tbv_count >= 1, "Powered by TheWebVale badge is missing in DOM"

            # Check Privacy: Zero personal name leaks in public DOM
            body_text = page.locator("body").inner_text()
            assert "Yash Jain" not in body_text, f"Personal name leak 'Yash Jain' detected in body text on {name}!"
            print(f"  [{name} {w}x{h}] ✓ Zero personal name leaks verified")

            context.close()

        browser.close()

        # Check console errors
        print(f"\n[+] Total console errors across all viewports: {len(console_errors)}")
        if console_errors:
            print("Console errors:", console_errors)
        assert len(console_errors) == 0, f"Found {len(console_errors)} console errors!"

    print("\n" + "=" * 60)
    print("ALL TESTS PASSED DETERMINISTICALLY! ZERO REGRESSIONS.")
    print("=" * 60)

finally:
    proc.terminate()
    try:
        proc.wait(timeout=3)
    except:
        proc.kill()
