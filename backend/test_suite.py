import requests
import sys

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

BASE_URL = "http://127.0.0.1:8000"

def run_tests():
    print("=== Running RythuMithra SIH 26193 Automated Test Suite ===")

    # Test 1: Health Check
    res = requests.get(f"{BASE_URL}/")
    assert res.status_code == 200, f"Health check failed: {res.status_code}"
    print("✓ Test 1 Passed: Root Health Check")

    # Test 2: Admin Login
    res = requests.post(f"{BASE_URL}/api/auth/admin/login", json={
        "username": "admin",
        "password": "admin123"
    })
    assert res.status_code == 200, f"Admin login failed: {res.text}"
    admin_token = res.json()["access_token"]
    print("✓ Test 2 Passed: Admin Authentication")

    # Test 3: Farmer Login
    res = requests.post(f"{BASE_URL}/api/auth/farmer/login", json={
        "mobile": "9876543210",
        "password": "farmer123"
    })
    assert res.status_code == 200, f"Farmer login failed: {res.text}"
    farmer_token = res.json()["access_token"]
    print("✓ Test 3 Passed: Farmer Authentication")

    # Test 4: Transparent Crop Recommendation Scoring
    res = requests.post(f"{BASE_URL}/api/crops/recommend", json={
        "district": "Anantapur",
        "soil_type": "Red Soil",
        "water_availability": "Borewell (Moderate)",
        "season": "Kharif"
    })
    assert res.status_code == 200, f"Recommendation failed: {res.text}"
    recs = res.json()
    assert len(recs) > 0, "No crops returned"
    top_crop = recs[0]
    assert top_crop["crop_name"] == "Groundnut", f"Expected Groundnut, got {top_crop['crop_name']}"
    assert top_crop["suitability_score"] >= 90, f"Suitability score too low: {top_crop['suitability_score']}"
    assert "breakdown" in top_crop, "Breakdown missing"
    assert len(top_crop["reasons"]) > 0, "Reasons missing"
    assert len(top_crop["telugu_reasons"]) > 0, "Telugu reasons missing"
    print(f"✓ Test 4 Passed: Crop Recommendation Engine (Top: {top_crop['crop_name']}, Score: {top_crop['suitability_score']}%)")

    # Test 5: Production Tracking
    headers = {"Authorization": f"Bearer {farmer_token}"}
    res = requests.get(f"{BASE_URL}/api/production", headers=headers)
    assert res.status_code == 200, f"Get productions failed: {res.text}"
    prods = res.json()
    assert len(prods) > 0, "No productions found for farmer"
    print(f"✓ Test 5 Passed: Farmer Production Tracking ({len(prods)} active crops)")

    # Test 6: Buyers Marketplace
    res = requests.get(f"{BASE_URL}/api/buyers?crop=Groundnut")
    assert res.status_code == 200, f"Get buyers failed: {res.text}"
    buyers = res.json()
    assert len(buyers) > 0, "No groundnut buyers found"
    print(f"✓ Test 6 Passed: Buyers Marketplace ({len(buyers)} buyers matched)")

    # Test 7: Government Schemes
    res = requests.get(f"{BASE_URL}/api/schemes")
    assert res.status_code == 200, f"Get schemes failed: {res.text}"
    schemes = res.json()
    assert len(schemes) >= 7, f"Expected at least 7 verified schemes, got {len(schemes)}"
    # Verify official URLs are authentic
    for s in schemes:
        assert ".gov.in" in s["official_url"] or ".nic.in" in s["official_url"], f"Invalid official URL: {s['official_url']}"
    print(f"✓ Test 7 Passed: Verified Government Schemes ({len(schemes)} authentic schemes verified)")

    # Test 8: AI Voice Assistant (All 7 Indian Languages)
    test_languages = ["te", "en", "hi", "ta", "kn", "ml", "mr"]
    for lang in test_languages:
        res = requests.post(f"{BASE_URL}/api/ai/ask", json={
            "question": "Groundnut farming guidance",
            "language": lang,
            "farmer_context": {"district": "Anantapur", "soil_type": "Red Soil"}
        })
        assert res.status_code == 200, f"AI ask failed for language {lang}: {res.text}"
        ai_ans = res.json()
        assert len(ai_ans["answer"]) > 20, f"AI answer too short for {lang}"
        assert len(ai_ans["suggestions"]) > 0, f"AI suggestions missing for {lang}"
        assert ai_ans["language"] == lang, f"Language mismatch: expected {lang}, got {ai_ans.get('language')}"
    print(f"✓ Test 8 Passed: AI Voice Consultation Engine across 7 Languages ({', '.join(test_languages)})")

    # Test 9: Privacy-Preserving Geolocation
    res = requests.post(f"{BASE_URL}/api/location/detect-region", json={
        "latitude": 14.6819,
        "longitude": 77.6006
    })
    assert res.status_code == 200, f"Location detect failed: {res.text}"
    loc = res.json()
    assert loc["district"] == "Anantapur", f"Expected Anantapur, got {loc['district']}"
    assert "privacy_notice" in loc, "Privacy notice missing"
    print(f"✓ Test 9 Passed: Privacy-Preserving Location Reverse Geocoding (Matched: {loc['district']})")

    # Test 10: Admin Aggregated Analytics & Privacy Audit
    res = requests.get(f"{BASE_URL}/api/admin/analytics")
    assert res.status_code == 200, f"Admin analytics failed: {res.text}"
    analytics = res.json()
    assert "total_registered_farmers" in analytics
    assert "top_produced_crops" in analytics
    assert "surplus_shortage_records" in analytics
    assert "policy_planning_insights" in analytics
    # Ensure NO individual farmer PII exists in analytics response
    json_str = str(analytics)
    assert "Ramesh Babu" not in json_str, "PII leak: Farmer name in admin analytics!"
    assert "9876543210" not in json_str, "PII leak: Farmer mobile in admin analytics!"
    print("✓ Test 10 Passed: Admin Aggregated Analytics & Zero-PII Privacy Audit")

    print("\n=======================================================")
    print(" ALL 10 TEST PHASES PASSED WITH ZERO FAILURES! ")
    print("=======================================================")

if __name__ == "__main__":
    run_tests()
