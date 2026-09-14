from sqlalchemy.orm import Session
from app.models import Farmer, AdminUser, Crop, ProductionRecord, Buyer, GovernmentScheme, RegionalAgriData
from app.auth import get_password_hash

def seed_database(db: Session):
    # 1. Seed Admin User
    admin = db.query(AdminUser).filter(AdminUser.username == "admin").first()
    if not admin:
        admin = AdminUser(
            username="admin",
            hashed_password=get_password_hash("admin123"),
            full_name="Dr. K. Seshadri, Joint Director of Agriculture",
            role="Agricultural Officer",
            department="Department of Agriculture, Andhra Pradesh"
        )
        db.add(admin)

    # 2. Seed Default Farmers
    f1 = db.query(Farmer).filter(Farmer.mobile == "9876543210").first()
    if not f1:
        f1 = Farmer(
            name="Ramesh Babu (రామేశ్ బాబు)",
            mobile="9876543210",
            hashed_password=get_password_hash("farmer123"),
            preferred_language="te",
            state="Andhra Pradesh",
            district="Guntur",
            region="Coastal Andhra",
            soil_type="Black Soil",
            water_availability="Canal & Borewell",
            farming_experience="10+ years"
        )
        db.add(f1)
        db.flush()

        # Seed initial production record for Ramesh
        prod1 = ProductionRecord(
            farmer_id=f1.id,
            crop_name="Paddy (వరి)",
            season="Kharif",
            area_acres=3.0,
            expected_quantity_quintals=45.0,
            current_harvested_quintals=10.0,
            planting_date="2026-06-15",
            expected_harvest_date="2026-11-20",
            status="Growing",
            surplus_predicted=12.0
        )
        db.add(prod1)

    f2 = db.query(Farmer).filter(Farmer.mobile == "9876543211").first()
    if not f2:
        f2 = Farmer(
            name="Venkata Rao (వెంకట్రావు)",
            mobile="9876543211",
            hashed_password=get_password_hash("farmer123"),
            preferred_language="te",
            state="Andhra Pradesh",
            district="Anantapur",
            region="Rayalaseema",
            soil_type="Red Soil",
            water_availability="Borewell (Moderate)",
            farming_experience="8 years"
        )
        db.add(f2)
        db.flush()

        prod2 = ProductionRecord(
            farmer_id=f2.id,
            crop_name="Groundnut (వేరుశనగ)",
            season="Kharif",
            area_acres=4.0,
            expected_quantity_quintals=32.0,
            current_harvested_quintals=0.0,
            planting_date="2026-07-01",
            expected_harvest_date="2026-10-30",
            status="Flowering",
            surplus_predicted=8.5
        )
        db.add(prod2)

    # 3. Seed Crops
    if db.query(Crop).count() == 0:
        crops_data = [
            Crop(
                name="Groundnut",
                telugu_name="వేరుశనగ",
                hindi_name="मूंगफली",
                season="Kharif, Rabi",
                soil_types="Red Soil, Sandy Loam, Light Loam",
                water_requirement="Low to Moderate",
                ideal_ph="6.0 - 7.0",
                duration_days=105,
                base_yield_quintal=9.5,
                demand_level="High",
                production_trend="Increasing",
                market_price_per_quintal=6850.0,
                description="Crucial oilseed crop, fixes atmospheric nitrogen, excellent drought resilience.",
                telugu_description="రాయలసీమ ప్రాంతానికి అనువైన ప్రధాన నూనెగింజ పంట. తక్కువ నీటితో సమృద్ధిగా పెరుగుతుంది, నేల సారాన్ని పెంచుతుంది.",
                important_considerations="Treat seeds with Trichoderma viride to prevent collar rot. Monitor for leaf spot (Tikka).",
                telugu_considerations="విత్తనశుద్ధి తప్పనిసరి. టిక్కా తెగులు నివారణకు సమయానికి నివారణ మందులు పిచికారీ చేయాలి."
            ),
            Crop(
                name="Paddy",
                telugu_name="వరి",
                hindi_name="धान",
                season="Kharif, Rabi",
                soil_types="Black Soil, Alluvial Soil, Clay Loam",
                water_requirement="High",
                ideal_ph="5.5 - 7.0",
                duration_days=130,
                base_yield_quintal=22.0,
                demand_level="High",
                production_trend="Stable",
                market_price_per_quintal=2400.0,
                description="Staple food grain in delta and canal regions with high guaranteed MSP procurement.",
                telugu_description="డెల్టా మరియు కాలువ ఆయకట్టు ప్రాంతాలకు అత్యంత అనుకూలమైన ప్రధాన ఆహార ధాన్య పంట.",
                important_considerations="Maintain 2-3 cm standing water during panicle initiation. Apply balanced NPK with Zinc.",
                telugu_considerations="చిరుపొట్ట దశలో నీటి ఎద్దడి లేకుండా చూడాలి. జింక్ లోపం రాకుండా ముందస్తు జాగ్రత్తలు తీసుకోవాలి."
            ),
            Crop(
                name="Cotton",
                telugu_name="పత్తి",
                hindi_name="कपास",
                season="Kharif",
                soil_types="Black Soil, Deep Alluvial",
                water_requirement="Moderate",
                ideal_ph="6.5 - 8.0",
                duration_days=160,
                base_yield_quintal=11.0,
                demand_level="High",
                production_trend="Stable",
                market_price_per_quintal=7150.0,
                description="High commercial value fiber crop, thrives in deep moisture-retentive black soils.",
                telugu_description="నల్లరేగడి నేలల్లో అద్భుతమైన రాబడినిచ్చే వాణిజ్య పంట. ప్రస్తుత మార్కెట్లో భారీ డిమాండ్.",
                important_considerations="Watch out for Pink Bollworm. Install pheromone traps at 45 days after sowing.",
                telugu_considerations="గులాబీ రంగు పురుగు నివారణకు విధిగా లింగాకర్షక బుట్టలు ఏర్పాటు చేయాలి."
            ),
            Crop(
                name="Chilli",
                telugu_name="మిరప",
                hindi_name="मिर्च",
                season="Kharif, Late Kharif",
                soil_types="Black Soil, Well-Drained Red Loam",
                water_requirement="Moderate",
                ideal_ph="6.5 - 7.5",
                duration_days=150,
                base_yield_quintal=14.0,
                demand_level="High",
                production_trend="Increasing",
                market_price_per_quintal=16500.0,
                description="Guntur benchmark cash crop with high domestic and international spice export demand.",
                telugu_description="గుంటూరు మరియు ప్రకాశం జిల్లాల ప్రధాన వాణిజ్య పంట. ఎగుమతి నాణ్యతతో అపారమైన లాభాలు.",
                important_considerations="Ensure proper soil drainage. Manage thrips and mites using sticky traps and neem oil.",
                telugu_considerations="నీరు నిల్వ ఉండకుండా డ్రైనేజీ చూసుకోవాలి. తామర పురుగు నివారణకు జిగురు అట్టలు వాడాలి."
            ),
            Crop(
                name="Red Gram",
                telugu_name="కందులు",
                hindi_name="अरहर / तुअर",
                season="Kharif",
                soil_types="Red Soil, Loamy, Sandy Loam",
                water_requirement="Low",
                ideal_ph="6.0 - 7.5",
                duration_days=150,
                base_yield_quintal=7.5,
                demand_level="High",
                production_trend="Increasing",
                market_price_per_quintal=8200.0,
                description="Hardy pulse crop, high protein, thrives in rainfed conditions with minimal investment.",
                telugu_description="వర్షాధార పరిస్థితుల్లో తక్కువ ఖర్చుతో అధిక లాభాన్ని ఇచ్చే ప్రధాన పప్పుధాన్య పంట.",
                important_considerations="Nipping at 45-50 days induces more lateral branching and pod setting.",
                telugu_considerations="మొదటి 45 రోజుల్లో తలలు తుంచడం వల్ల కొమ్మలు ఎక్కువగా వచ్చి దిగుబడి పెరుగుతుంది."
            ),
            Crop(
                name="Maize",
                telugu_name="మొక్కజొన్న",
                hindi_name="मक्का",
                season="Kharif, Rabi",
                soil_types="Black Soil, Well-Drained Loam",
                water_requirement="Moderate",
                ideal_ph="6.0 - 7.5",
                duration_days=110,
                base_yield_quintal=28.0,
                demand_level="High",
                production_trend="Increasing",
                market_price_per_quintal=2250.0,
                description="High yielding feed & poultry crop with quick cycle and consistent agro-industrial buyers.",
                telugu_description="కోళ్ల పరిశ్రమ మరియు దాణా తయారీ యూనిట్ల నుండి ఎల్లప్పుడూ స్థిరమైన గిరాకీ ఉండే వేగవంతమైన పంట.",
                important_considerations="Monitor for Fall Armyworm (FAW) in early vegetative stages.",
                telugu_considerations="కత్తెర పురుగు ఆశించకుండా ముందస్తుగా గమనించి సుడిలో ఇసుక లేదా నివారణ మందులు వేయాలి."
            ),
            Crop(
                name="Bengal Gram",
                telugu_name="శనగలు",
                hindi_name="चना",
                season="Rabi",
                soil_types="Black Soil, Clay Loam",
                water_requirement="Low",
                ideal_ph="6.0 - 8.0",
                duration_days=95,
                base_yield_quintal=8.0,
                demand_level="Moderate",
                production_trend="Stable",
                market_price_per_quintal=5600.0,
                description="Prime Rabi pulse in Rayalaseema black soils, utilizes residual moisture effectively.",
                telugu_description="రబీ కాలంలో నల్లరేగడి నేలలో తేమ ఆధారంగా తక్కువ ఖర్చుతో పండే శనగ పంట.",
                important_considerations="Sow in moist soil bed; protect from wilt with Trichoderma bio-agent.",
                telugu_considerations="నేలలో తగినంత తేమ ఉన్నప్పుడు విత్తుకోవాలి. ఎండు తెగులు రాకుండా జీవ నియంత్రణ పాటించాలి."
            ),
            Crop(
                name="Mango",
                telugu_name="మామిడి",
                hindi_name="आम",
                season="All Season (Perennial)",
                soil_types="Red Soil, Loam, Laterite",
                water_requirement="Low to Moderate",
                ideal_ph="5.5 - 7.5",
                duration_days=365,
                base_yield_quintal=40.0,
                demand_level="High",
                production_trend="Increasing",
                market_price_per_quintal=4500.0,
                description="Flagship horticulture crop (Banganapalle, Totapuri) with export and pulp processing demand.",
                telugu_description="బంగినపల్లి మరియు తోతాపురి మామిడి తోటలు దీర్ఘకాలిక లాభదాయకమైన ఉద్యాన పంట.",
                important_considerations="Prune dead wood after harvest; spray micronutrients before flowering season.",
                telugu_considerations="కోత అనంతరం ఎండు కొమ్మలను కత్తిరించి, పూతకు ముందు సూక్ష్మధాతువులు అందించాలి."
            )
        ]
        db.add_all(crops_data)

    # 4. Seed Buyers & Local Markets
    if db.query(Buyer).count() == 0:
        buyers_data = [
            Buyer(
                name="ITC Agri-Business Division",
                buyer_type="Food Processor / Exporter",
                crops_required="Chilli, Tobacco, Maize",
                region="Coastal Andhra",
                district="Guntur",
                state="Andhra Pradesh",
                quantity_required_quintals=5000.0,
                indicative_price_per_quintal=17200.0,
                demand_level="High",
                contact_phone="+91 863 234 5001",
                email="procure.guntur@itc.in",
                verified_badge=True
            ),
            Buyer(
                name="Rayalaseema Agro & Oil Extraction Co.",
                buyer_type="Oil Mill",
                crops_required="Groundnut, Sunflower",
                region="Rayalaseema",
                district="Anantapur",
                state="Andhra Pradesh",
                quantity_required_quintals=3500.0,
                indicative_price_per_quintal=7100.0,
                demand_level="High",
                contact_phone="+91 8554 278 120",
                email="contact@rayalaseemaoil.com",
                verified_badge=True
            ),
            Buyer(
                name="Coastal Modern Rice Mill Consortium",
                buyer_type="Rice Mill / Wholesaler",
                crops_required="Paddy",
                region="Krishna Valley",
                district="Krishna",
                state="Andhra Pradesh",
                quantity_required_quintals=12000.0,
                indicative_price_per_quintal=2450.0,
                demand_level="High",
                contact_phone="+91 866 289 4432",
                email="procurement@coastalricemills.org",
                verified_badge=True
            ),
            Buyer(
                name="Sri Venkateswara Dal & Pulse Industry",
                buyer_type="Dal Mill",
                crops_required="Red Gram, Bengal Gram",
                region="Rayalaseema",
                district="Kurnool",
                state="Andhra Pradesh",
                quantity_required_quintals=2400.0,
                indicative_price_per_quintal=8450.0,
                demand_level="High",
                contact_phone="+91 8518 221 099",
                email="dalmills.kurnool@gmail.com",
                verified_badge=True
            ),
            Buyer(
                name="AP Cotton Ginning & Spinning Association",
                buyer_type="Wholesaler / Processor",
                crops_required="Cotton",
                region="Coastal Andhra",
                district="Guntur",
                state="Andhra Pradesh",
                quantity_required_quintals=8000.0,
                indicative_price_per_quintal=7350.0,
                demand_level="High",
                contact_phone="+91 863 222 7890",
                email="info@apcottonginners.com",
                verified_badge=True
            ),
            Buyer(
                name="e-NAM Agricultural Produce Market Yard",
                buyer_type="APMC Mandi (Govt)",
                crops_required="Groundnut, Paddy, Chilli, Maize, Red Gram",
                region="Central Andhra",
                district="Guntur",
                state="Andhra Pradesh",
                quantity_required_quintals=25000.0,
                indicative_price_per_quintal=6950.0,
                demand_level="High",
                contact_phone="1800 270 0224",
                email="helpdesk-enam@gov.in",
                verified_badge=True
            )
        ]
        db.add_all(buyers_data)

    # 5. Seed Authentic Government Schemes (Strictly verified official portals)
    if db.query(GovernmentScheme).count() == 0:
        schemes_data = [
            GovernmentScheme(
                scheme_name="Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
                telugu_name="పీఎం కిసాన్ సమ్మాన్ నిధి",
                hindi_name="प्रधानमंत्री किसान सम्मान निधि",
                state="All India",
                category="Financial Support",
                benefits="Direct income support of ₹6,000 per year transferred into farmer bank accounts in three equal installments of ₹2,000 every 4 months.",
                telugu_benefits="ఏడాదికి ₹6,000 నేరుగా బ్యాంక్ ఖాతాలో జమ (రూ. 2,000 చొప్పున మూడు విడతల్లో).",
                eligibility="All landholding farmer families having cultivable land in their names across India, subject to exclusion criteria (e.g. institutional landholders).",
                telugu_eligibility="సొంత సాగుభూమి కలిగిన రైతులందరికీ వర్తిస్తుంది.",
                documents_required="Aadhaar Card, Land ownership papers (Pattadar Passbook / 1B), Active Bank Account with Aadhaar linking, Mobile number.",
                application_process="Farmers can register online at the official PM-KISAN portal or through their local Village Agriculture Assistant / CSC Center.",
                official_url="https://pmkisan.gov.in",
                helpline="155261 / 011-24300606"
            ),
            GovernmentScheme(
                scheme_name="YSR Rythu Bharosa (Andhra Pradesh)",
                telugu_name="వైఎస్సార్ రైతు భరోసా",
                hindi_name="वाईएसआर रायथू भरोसा",
                state="Andhra Pradesh",
                category="Financial Support",
                benefits="Total input assistance of ₹13,500 per year per farmer family (including ₹6,000 from PM-KISAN) for seeds, fertilizers, and ploughing.",
                telugu_benefits="రైతు కుటుంబానికి ఏటా రూ. 13,500 పెట్టుబడి సాయం అందిస్తుంది.",
                eligibility="Cultivating landholders, including tenant farmers (SC, ST, BC, Minorities) with Crop Cultivator Rights Card (CCRC) in Andhra Pradesh.",
                telugu_eligibility="భూమి ఉన్న రైతులతో పాటు సిసిఆర్సీ కార్డు ఉన్న కౌలు రైతులకు కూడా వర్తిస్తుంది.",
                documents_required="Pattadar Passbook / CCRC Card, Aadhaar Card, Linked Bank Account Passbook, Ration/Rice Card.",
                application_process="Apply via local Rythu Bharosa Kendram (RBK) at Village Secretariat level with Village Agriculture Assistant.",
                official_url="https://ysrrythubharosa.ap.gov.in",
                helpline="1902 (AP Citizen Helpline)"
            ),
            GovernmentScheme(
                scheme_name="Pradhan Mantri Fasal Bima Yojana (PMFBY)",
                telugu_name="పీఎం ఫసల్ బీమా యోజన (పంట బీమా)",
                hindi_name="प्रधानमंत्री फसल बीमा योजना",
                state="All India",
                category="Crop Insurance",
                benefits="Comprehensive financial coverage against non-preventable natural risks (drought, dry spells, flood, pest epidemic) from pre-sowing to post-harvest.",
                telugu_benefits="వర్షాభావం, వరదలు, చీడపీడల వల్ల పంట నష్టపోతే గరిష్ట నష్టపరిహారం చెల్లింపు.",
                eligibility="All farmers growing notified crops in notified areas including sharecroppers and tenant farmers.",
                telugu_eligibility="నోటిఫై చేసిన పంటలు సాగు చేసే రైతులందరూ అర్హులు. అతి తక్కువ ప్రీమియం (1.5% నుండి 2%).",
                documents_required="Land Record (ROR/1B), Sowing Certificate from Agriculture Officer, Aadhaar Card, Bank Passbook.",
                application_process="Enroll through Bank Branch, Rythu Bharosa Kendra, or online via National Crop Insurance Portal.",
                official_url="https://pmfby.gov.in",
                helpline="1800-180-1551"
            ),
            GovernmentScheme(
                scheme_name="Pradhan Mantri Krishi Sinchayee Yojana (PMKSY / APMIP)",
                telugu_name="ప్రధానమంత్రి కృషి సించాయి యోజన (సూక్ష్మ సేద్యం)",
                hindi_name="प्रधानमंत्री कृषि सिंचाई योजना",
                state="All India",
                category="Irrigation",
                benefits="Subsidy up to 90% for SC/ST small/marginal farmers and 70% for other farmers for installing Drip and Sprinkler irrigation systems ('Per Drop More Crop').",
                telugu_benefits="బిందు (డ్రిప్) మరియు తుంపర (స్ప్రింక్లర్) సేద్య పరికరాలపై 70% నుండి 90% వరకు భారీ ప్రభుత్వ సబ్సిడీ.",
                eligibility="Farmers having land with an assured water source (borewell, open well, or farm pond).",
                telugu_eligibility="బోరుబావి లేదా నీటి వనరు ఉన్న చిన్న, సన్నకారు రైతులు అర్హులు.",
                documents_required="Pattadar Passbook, Aadhaar Card, Soil and Water test report, Passport size photos.",
                application_process="Apply through the AP Micro Irrigation Project (APMIP) portal or submit form at the Mandal Agriculture Office.",
                official_url="https://pmksy.gov.in",
                helpline="0863-2340500"
            ),
            GovernmentScheme(
                scheme_name="Sub-Mission on Agricultural Mechanization (SMAM)",
                telugu_name="వ్యవసాయ యాంత్రీకరణ పథకం (ట్రాక్టర్లు, యంత్రాలు)",
                hindi_name="कृषि यांत्रिकीकरण उप-मिशन",
                state="All India",
                category="Machinery",
                benefits="40% to 50% subsidy on procurement of tractors, rotavators, power tillers, laser land levelers, and custom hiring center machinery.",
                telugu_benefits="ట్రాక్టర్లు, పవర్ టిల్లర్లు, రొటవేటర్లు మరియు హార్వెస్టర్ల కొనుగోలుపై 40% నుండి 50% వరకు రాయితీ.",
                eligibility="Individual farmers, Farmer Producer Organizations (FPOs), and village self-help groups.",
                telugu_eligibility="వ్యక్తిగత రైతులు, మహిళా సంఘాలు మరియు రైతు ఉత్పత్తిదారుల సంఘాలు (FPO).",
                documents_required="Aadhaar, Land records, Quotation from authorized dealer, Bank account details.",
                application_process="Online application through central Agrimachinery portal or AP Agriculture Department portal.",
                official_url="https://agrimachinery.nic.in",
                helpline="1800-180-1551"
            ),
            GovernmentScheme(
                scheme_name="National Agriculture Market (e-NAM)",
                telugu_name="జాతీయ వ్యవసాయ మార్కెట్ (ఈ-నామ్)",
                hindi_name="राष्ट्रीय कृषि बाजार",
                state="All India",
                category="Market Linkage",
                benefits="Pan-India electronic trading portal connecting APMC mandis to facilitate transparent price discovery and direct online bank payments to farmers.",
                telugu_benefits="దేశవ్యాప్తంగా 1300+ మార్కెట్లకు అనుసంధానం. పోటీ బిడ్డింగ్ ద్వారా సరైన గిట్టుబాటు ధర, నేరుగా బ్యాంక్ ఖాతాలో చెల్లింపు.",
                eligibility="Any farmer selling agricultural produce in participating regulated APMC markets.",
                telugu_eligibility="తమ పంటను విక్రయించాలనుకునే ఏ రైతు అయినా ఉచితంగా నమోదు చేసుకోవచ్చు.",
                documents_required="Aadhaar Card, Bank Account Details (for instant online payment), Mobile Number.",
                application_process="Register online at enam.gov.in or visit the e-NAM kiosk located inside the nearest APMC Mandi yard.",
                official_url="https://enam.gov.in",
                helpline="1800-270-0224"
            ),
            GovernmentScheme(
                scheme_name="Soil Health Card Scheme",
                telugu_name="సాయిల్ హెల్త్ కార్డ్ పథకం (భూసార పరీక్ష)",
                hindi_name="मृदा स्वास्थ्य कार्ड योजना",
                state="All India",
                category="Soil Fertility",
                benefits="Free periodic testing of soil samples and issuance of Soil Health Card indicating 12 essential nutrients (N, P, K, pH, Zinc, etc.) and customized fertilizer dosages.",
                telugu_benefits="ఉచిత భూసార పరీక్ష. నేలలోని 12 రకాల పోషకాల వివరాలు మరియు తగిన ఎరువుల సిఫార్సులతో కార్డు అందజేత.",
                eligibility="All farmers cultivating agricultural lands.",
                telugu_eligibility="వ్యవసాయ భూమి ఉన్న రైతులందరూ అర్హులు.",
                documents_required="Land survey number, Farmer name, Mobile number.",
                application_process="Soil samples are collected by Village Agriculture Assistants or submitted at District Soil Testing Labs.",
                official_url="https://soilhealth.dac.gov.in",
                helpline="1800-180-1551"
            )
        ]
        db.add_all(schemes_data)

    # 6. Seed Regional Aggregated Agricultural Data (Privacy-Preserving / For Admin Dashboard)
    if db.query(RegionalAgriData).count() == 0:
        regional_data = [
            RegionalAgriData(state="Andhra Pradesh", district="Guntur", crop_name="Chilli", total_estimated_production=420.0, demand_index=1.4, surplus_status="Surplus", price_trend="Increasing"),
            RegionalAgriData(state="Andhra Pradesh", district="Guntur", crop_name="Cotton", total_estimated_production=310.0, demand_index=1.1, surplus_status="Balanced", price_trend="Stable"),
            RegionalAgriData(state="Andhra Pradesh", district="Guntur", crop_name="Paddy", total_estimated_production=520.0, demand_index=1.0, surplus_status="Balanced", price_trend="Stable"),
            RegionalAgriData(state="Andhra Pradesh", district="Anantapur", crop_name="Groundnut", total_estimated_production=580.0, demand_index=1.3, surplus_status="Surplus", price_trend="Increasing"),
            RegionalAgriData(state="Andhra Pradesh", district="Anantapur", crop_name="Bengal Gram", total_estimated_production=140.0, demand_index=0.95, surplus_status="Balanced", price_trend="Stable"),
            RegionalAgriData(state="Andhra Pradesh", district="Anantapur", crop_name="Red Gram", total_estimated_production=65.0, demand_index=1.6, surplus_status="Shortage", price_trend="Increasing"),
            RegionalAgriData(state="Andhra Pradesh", district="Krishna", crop_name="Paddy", total_estimated_production=890.0, demand_index=1.15, surplus_status="Surplus", price_trend="Stable"),
            RegionalAgriData(state="Andhra Pradesh", district="Krishna", crop_name="Black Gram", total_estimated_production=45.0, demand_index=1.8, surplus_status="Shortage", price_trend="Increasing"),
            RegionalAgriData(state="Andhra Pradesh", district="Krishna", crop_name="Maize", total_estimated_production=260.0, demand_index=1.2, surplus_status="Balanced", price_trend="Increasing"),
            RegionalAgriData(state="Andhra Pradesh", district="Kurnool", crop_name="Cotton", total_estimated_production=280.0, demand_index=1.05, surplus_status="Balanced", price_trend="Stable"),
            RegionalAgriData(state="Andhra Pradesh", district="Kurnool", crop_name="Bengal Gram", total_estimated_production=220.0, demand_index=1.1, surplus_status="Balanced", price_trend="Stable"),
            RegionalAgriData(state="Andhra Pradesh", district="West Godavari", crop_name="Paddy", total_estimated_production=940.0, demand_index=1.2, surplus_status="Surplus", price_trend="Stable")
        ]
        db.add_all(regional_data)

    db.commit()
