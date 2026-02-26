import requests
import json

BASE_URL = "http://localhost:8080/api"
USERNAME = "admin"
PASSWORD = "admin123"

THREATS = {
    1: {"sourceIP": "45.142.33.21", "targetSystem": "web-server-01", "threatType": "DDoS Attack", "severityScore": 9.0, "intentClassification": "Malicious", "status": "DETECTED"},
    2: {"sourceIP": "103.253.45.67", "targetSystem": "database-server", "threatType": "SQL Injection", "severityScore": 8.5, "intentClassification": "Malicious", "status": "DETECTED"},
    3: {"sourceIP": "185.220.101.45", "targetSystem": "file-server", "threatType": "Ransomware", "severityScore": 9.5, "intentClassification": "Malicious", "status": "DETECTED"},
    4: {"sourceIP": "91.219.64.89", "targetSystem": "email-gateway", "threatType": "Phishing Attack", "severityScore": 6.0, "intentClassification": "Social Engineering", "status": "DETECTED"},
    5: {"sourceIP": "198.98.57.123", "targetSystem": "workstation-42", "threatType": "Malware", "severityScore": 7.5, "intentClassification": "Malicious", "status": "DETECTED"},
    6: {"sourceIP": "159.65.88.201", "targetSystem": "web-app", "threatType": "XSS Attack", "severityScore": 5.5, "intentClassification": "Malicious", "status": "DETECTED"},
    7: {"sourceIP": "104.248.12.34", "targetSystem": "api-gateway", "threatType": "API Abuse", "severityScore": 6.5, "intentClassification": "Malicious", "status": "DETECTED"},
    8: {"sourceIP": "167.99.45.78", "targetSystem": "auth-server", "threatType": "Brute Force", "severityScore": 8.0, "intentClassification": "Malicious", "status": "DETECTED"},
    9: {"sourceIP": "178.128.90.12", "targetSystem": "storage-cluster", "threatType": "Data Exfiltration", "severityScore": 9.0, "intentClassification": "Malicious", "status": "DETECTED"},
    10: {"sourceIP": "206.189.67.89", "targetSystem": "vpn-gateway", "threatType": "Unauthorized Access", "severityScore": 7.0, "intentClassification": "Malicious", "status": "DETECTED"},
}

def login():
    print("🔐 Logging in...")
    response = requests.post(f"{BASE_URL}/auth/login", json={"username": USERNAME, "password": PASSWORD})
    if response.status_code == 200:
        print("✅ Login successful!\n")
        return response.json()["accessToken"]
    print(f"❌ Login failed: {response.status_code}")
    return None

def create_threat(token, threat_data):
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    response = requests.post(f"{BASE_URL}/threats", headers=headers, json=threat_data)
    return response.status_code == 200

def show_menu():
    print("=" * 70)
    print("🛡️  S.H.I.E.L.D - Interactive Threat Injection")
    print("=" * 70)
    print("\n📋 Available Threats:\n")
    for num, threat in THREATS.items():
        print(f"  [{num}]  {threat['threatType']:<25} (Severity: {threat['severityScore']}/10)")
    print(f"\n  [11] Inject ALL threats at once")
    print(f"  [0]  Exit")
    print("\n" + "=" * 70)

def main():
    token = login()
    if not token:
        input("Press Enter to exit...")
        return
    
    while True:
        show_menu()
        choice = input("\n👉 Enter threat number to inject: ").strip()
        
        if choice == "0":
            print("\n👋 Exiting...")
            break
        
        if choice == "11":
            print(f"\n🚀 Injecting ALL {len(THREATS)} threats...\n")
            success = 0
            for num, threat in THREATS.items():
                print(f"[{num}/10] {threat['threatType']}...", end=" ")
                if create_threat(token, threat):
                    print("✅ Success + Email sent!")
                    success += 1
                else:
                    print("❌ Failed")
            print(f"\n✅ Created {success} threats | 📧 Sent {success * 3} emails")
            input("\nPress Enter to continue...")
            continue
        
        try:
            num = int(choice)
            if num in THREATS:
                threat = THREATS[num]
                print(f"\n🚀 Injecting: {threat['threatType']}...")
                print(f"   Source: {threat['sourceIP']}")
                print(f"   Target: {threat['targetSystem']}")
                print(f"   Severity: {threat['severityScore']}/10")
                
                if create_threat(token, threat):
                    print("\n✅ SUCCESS!")
                    print("   - Threat created in database")
                    print("   - Email sent to 3 recipients")
                    print("   - Check Intelligence page (refresh)")
                else:
                    print("\n❌ FAILED - Check backend logs")
                
                input("\nPress Enter to continue...")
            else:
                print("\n❌ Invalid number! Choose 1-10, 11 for all, or 0 to exit")
                input("Press Enter to continue...")
        except ValueError:
            print("\n❌ Please enter a valid number!")
            input("Press Enter to continue...")

if __name__ == "__main__":
    main()
