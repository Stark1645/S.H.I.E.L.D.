import requests
import json
import time

# Configuration
BASE_URL = "http://localhost:8080/api"
USERNAME = "admin"
PASSWORD = "admin123"

# Threat templates
THREATS = [
    {"sourceIP": "45.142.33.21", "targetSystem": "web-server-01", "threatType": "DDoS Attack", "severityScore": 9.0, "intentClassification": "Malicious", "status": "DETECTED"},
    {"sourceIP": "103.253.45.67", "targetSystem": "database-server", "threatType": "SQL Injection", "severityScore": 8.5, "intentClassification": "Malicious", "status": "DETECTED"},
    {"sourceIP": "185.220.101.45", "targetSystem": "file-server", "threatType": "Ransomware", "severityScore": 9.5, "intentClassification": "Malicious", "status": "DETECTED"},
    {"sourceIP": "91.219.64.89", "targetSystem": "email-gateway", "threatType": "Phishing Attack", "severityScore": 6.0, "intentClassification": "Social Engineering", "status": "DETECTED"},
    {"sourceIP": "198.98.57.123", "targetSystem": "workstation-42", "threatType": "Malware", "severityScore": 7.5, "intentClassification": "Malicious", "status": "DETECTED"},
    {"sourceIP": "159.65.88.201", "targetSystem": "web-app", "threatType": "XSS Attack", "severityScore": 5.5, "intentClassification": "Malicious", "status": "DETECTED"},
    {"sourceIP": "104.248.12.34", "targetSystem": "api-gateway", "threatType": "API Abuse", "severityScore": 6.5, "intentClassification": "Malicious", "status": "DETECTED"},
    {"sourceIP": "167.99.45.78", "targetSystem": "auth-server", "threatType": "Brute Force", "severityScore": 8.0, "intentClassification": "Malicious", "status": "DETECTED"},
    {"sourceIP": "178.128.90.12", "targetSystem": "storage-cluster", "threatType": "Data Exfiltration", "severityScore": 9.0, "intentClassification": "Malicious", "status": "DETECTED"},
    {"sourceIP": "206.189.67.89", "targetSystem": "vpn-gateway", "threatType": "Unauthorized Access", "severityScore": 7.0, "intentClassification": "Malicious", "status": "DETECTED"},
]

def login():
    """Login and get JWT token"""
    print("🔐 Logging in...")
    response = requests.post(
        f"{BASE_URL}/auth/login",
        json={"username": USERNAME, "password": PASSWORD}
    )
    if response.status_code == 200:
        token = response.json()["accessToken"]
        print("✅ Login successful!")
        return token
    else:
        print(f"❌ Login failed: {response.status_code}")
        return None

def create_threat(token, threat_data):
    """Create a single threat"""
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    response = requests.post(
        f"{BASE_URL}/threats",
        headers=headers,
        json=threat_data
    )
    return response.status_code == 200

def main():
    print("=" * 60)
    print("🛡️  S.H.I.E.L.D - Mass Threat Injection")
    print("=" * 60)
    print()
    
    # Login
    token = login()
    if not token:
        print("❌ Cannot proceed without authentication")
        return
    
    print()
    print(f"📊 Injecting {len(THREATS)} threats...")
    print()
    
    success_count = 0
    fail_count = 0
    
    for i, threat in enumerate(THREATS, 1):
        print(f"[{i}/{len(THREATS)}] Creating: {threat['threatType']} from {threat['sourceIP']}...", end=" ")
        
        if create_threat(token, threat):
            print("✅ Success + Email sent!")
            success_count += 1
        else:
            print("❌ Failed")
            fail_count += 1
        
        time.sleep(0.5)  # Small delay between requests
    
    print()
    print("=" * 60)
    print(f"✅ Successfully created: {success_count} threats")
    print(f"❌ Failed: {fail_count} threats")
    print(f"📧 Total emails sent: {success_count * 3} (to 3 recipients each)")
    print("=" * 60)
    print()
    print("📋 Check:")
    print("  1. Intelligence page - Refresh to see all threats")
    print("  2. Backend logs - Email confirmations")
    print("  3. Email inboxes - All 3 recipients")
    print()

if __name__ == "__main__":
    main()
    input("Press Enter to exit...")
