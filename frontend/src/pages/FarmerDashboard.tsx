import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import { ProductionRecord, CropRecommendation, Buyer, GovernmentScheme } from '../types';
import {
  Sprout,
  TrendingUp,
  Store,
  Landmark,
  Mic,
  MapPin,
  Mountain,
  Droplets,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Calendar
} from 'lucide-react';

interface FarmerDashboardProps {
  onNavigate: (tab: string) => void;
  openVoiceAssistant: () => void;
  onAskAiSpecific: (query: string) => void;
}

export const FarmerDashboard: React.FC<FarmerDashboardProps> = ({
  onNavigate,
  openVoiceAssistant,
  onAskAiSpecific
}) => {
  const { farmer } = useAuth();
  const { t, language } = useLanguage();

  const [topRec, setTopRec] = useState<CropRecommendation | null>(null);
  const [currentCrop, setCurrentCrop] = useState<ProductionRecord | null>(null);
  const [buyerCount, setBuyerCount] = useState<number>(6);
  const [schemeCount, setSchemeCount] = useState<number>(7);
  const [isDetectingGps, setIsDetectingGps] = useState<boolean>(false);
  const [gpsMessage, setGpsMessage] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, [farmer]);

  const loadDashboardData = async () => {
    try {
      // 1. Fetch Crop Recommendations for Farmer's soil & district
      const recs = await api.getRecommendations({
        district: farmer?.district || 'Guntur',
        soil_type: farmer?.soil_type || 'Black Soil',
        water_availability: farmer?.water_availability || 'Canal & Borewell',
        season: 'Kharif'
      });
      if (recs && recs.length > 0) {
        setTopRec(recs[0]);
      }

      // 2. Fetch Farmer's active production
      if (farmer) {
        const prods = await api.getProductions();
        if (prods && prods.length > 0) {
          setCurrentCrop(prods[0]);
        }
      }

      // 3. Buyer & Scheme counts
      const buyers = await api.getBuyers();
      if (buyers) setBuyerCount(buyers.length);

      const schemes = await api.getSchemes();
      if (schemes) setSchemeCount(schemes.length);

    } catch (e) {
      console.warn('Dashboard load fallback', e);
    }
  };

  const handleDetectDistrict = () => {
    if (!navigator.geolocation) {
      setGpsMessage('బ్రౌజర్ లొకేషన్ అందుబాటులో లేదు. మీ జిల్లాను ప్రొఫైల్‌లో మాన్యువల్‌గా మార్చవచ్చు.');
      return;
    }

    setIsDetectingGps(true);
    setGpsMessage(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await api.detectRegion(pos.coords.latitude, pos.coords.longitude);
          setGpsMessage(`✓ మీ వ్యవసాయ జిల్లా విజయవంతంగా గుర్తించబడింది: ${res.district} (${res.agro_climatic_zone}). మీ ఖచ్చితమైన జీపీఎస్ కోఆర్డినేట్లు సేవ్ చేయబడలేదు.`);
        } catch (e) {
          setGpsMessage('లొకేషన్ గుర్తించడంలో సమస్య ఏర్పడింది.');
        } finally {
          setIsDetectingGps(false);
        }
      },
      (err) => {
        setIsDetectingGps(false);
        setGpsMessage('లొకేషన్ అనుమతి నిరాకరించబడింది. గోప్యత రక్షణలో భాగంగా సాధారణ ప్రాంతం ఎంచుకోబడింది.');
      }
    );
  };

  return (
    <div className="space-y-8 py-4">
      
      {/* 1. Welcome & Farmer Context Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-emerald-700 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <span className="text-xs uppercase font-black tracking-widest text-amber-300">
              రైతు డాష్‌బోర్డ్ • SIH 26193
            </span>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
              స్వాగతం, {farmer?.name || 'రైతు మిత్రమా'}!
            </h1>
            
            {/* General Location & Soil Badges (Zero Exact GPS) */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-bold text-emerald-100">
              <span className="flex items-center gap-1 bg-emerald-950/70 px-3 py-1 rounded-full border border-emerald-700">
                <MapPin className="w-3.5 h-3.5 text-amber-300" />
                {farmer?.district || 'Guntur'}, {farmer?.state || 'Andhra Pradesh'}
              </span>
              <span className="flex items-center gap-1 bg-emerald-950/70 px-3 py-1 rounded-full border border-emerald-700">
                <Mountain className="w-3.5 h-3.5 text-amber-300" />
                {farmer?.soil_type || 'Black Soil'}
              </span>
              <span className="flex items-center gap-1 bg-emerald-950/70 px-3 py-1 rounded-full border border-emerald-700">
                <Droplets className="w-3.5 h-3.5 text-blue-300" />
                {farmer?.water_availability || 'Canal & Borewell'}
              </span>
            </div>
          </div>

          {/* Quick Auto-Detect District Button with Privacy Reassurance */}
          <div className="shrink-0 flex flex-col items-start md:items-end gap-1.5">
            <button
              onClick={handleDetectDistrict}
              disabled={isDetectingGps}
              className="px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black text-xs sm:text-sm shadow-md flex items-center gap-1.5 transition-transform active:scale-95"
            >
              <MapPin className="w-4 h-4 text-emerald-950" />
              <span>{isDetectingGps ? 'గుర్తిస్తోంది...' : '📍 నా జిల్లాను గుర్తించండి'}</span>
            </button>
            <span className="text-[11px] text-emerald-300 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-amber-300" />
              జీపీఎస్ నిల్వ చేయబడదు
            </span>
          </div>
        </div>

        {gpsMessage && (
          <div className="mt-4 p-3 bg-emerald-950/90 text-amber-200 text-xs rounded-xl border border-amber-400/40">
            {gpsMessage}
          </div>
        )}
      </div>

      {/* 2. Central Big AI Voice Hero Card (Section 22 Specification) */}
      <div 
        onClick={openVoiceAssistant}
        className="bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 text-emerald-950 rounded-3xl p-6 sm:p-8 shadow-xl border-4 border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-6 cursor-pointer hover:scale-[1.01] transition-transform"
      >
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-800 text-white flex items-center justify-center shadow-lg shrink-0 voice-active-pulse">
            <Mic className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-emerald-900 bg-emerald-100/80 px-2.5 py-0.5 rounded-md">
              తెలుగు వాయిస్ సహాయకుడు
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-emerald-950 mt-1">
              {t('askAiTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-emerald-900 font-bold">
              మీ ప్రశ్నను నోటితో అడగండి: "ఏ పంట వేయాలి?", "రైతు భరోసా అర్హతలు ఏమిటి?", "పంట ఎక్కడ అమ్మాలి?"
            </p>
          </div>
        </div>

        <button className="px-6 py-3.5 rounded-2xl bg-emerald-900 hover:bg-emerald-950 text-white font-black text-sm sm:text-base shadow-xl shrink-0 flex items-center gap-2">
          <Mic className="w-5 h-5 text-amber-300 animate-pulse" />
          <span>[ 🎤 TAP TO SPEAK ]</span>
        </button>
      </div>

      {/* 3. Four Core Action Cards (Section 22 Layout) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1: Recommended Crop */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-200 shadow-md hover:shadow-xl transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                <Sprout className="w-4 h-4 text-emerald-600" />
                {t('recCropTitle')}
              </span>
              <span className="px-3 py-1 rounded-xl bg-emerald-600 text-white font-black text-sm shadow-2xs">
                {topRec ? `${topRec.suitability_score}% అనుకూలం` : '92% అనుకూలం'}
              </span>
            </div>

            <h3 className="text-3xl font-black text-gray-900 mb-1">
              {topRec ? (language === 'te' ? topRec.telugu_name : topRec.crop_name) : 'వేరుశనగ (Groundnut)'}
            </h3>
            <p className="text-xs text-gray-500 font-semibold mb-3">
              {topRec?.season || 'Kharif సీజన్'} • ఖర్చు తక్కువ, లాభం ఎక్కువ
            </p>

            <div className="p-3 bg-emerald-50/70 rounded-2xl border border-emerald-100 text-xs text-gray-700 mb-4 space-y-1">
              <span className="font-bold text-emerald-900 block">ముఖ్య కారణాలు:</span>
              <p>• {topRec?.reasons[0] || 'మీ ప్రాంత మట్టి స్వభావానికి అత్యుత్తమంగా సరిపోతుంది.'}</p>
              <p>• {topRec?.reasons[1] || 'తక్కువ నీటితో సమృద్ధిగా పెరుగుతుంది.'}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={() => onNavigate('crops')}
              className="flex-1 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-sm shadow-md flex items-center justify-center gap-1.5 transition-all"
            >
              <span>{t('viewRecommendation')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onAskAiSpecific(`Why was ${topRec?.crop_name || 'Groundnut'} recommended for my soil?`)}
              className="px-4 py-3 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-xs transition-colors"
              title="Ask AI Why"
            >
              <Sparkles className="w-4 h-4 text-amber-600" />
            </button>
          </div>
        </div>

        {/* Card 2: My Current Crop Production */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-200 shadow-md hover:shadow-xl transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-blue-800 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                {t('myCropTitle')}
              </span>
              <span className="px-3 py-1 rounded-xl bg-blue-100 text-blue-900 font-bold text-xs">
                {currentCrop?.status || 'Growing (పెరుగుతోంది)'}
              </span>
            </div>

            <h3 className="text-3xl font-black text-gray-900 mb-1">
              {currentCrop?.crop_name || 'వరి (Paddy)'}
            </h3>
            <p className="text-xs text-gray-500 font-semibold mb-3">
              సాగు విస్తీర్ణం: {currentCrop?.area_acres || 3.0} ఎకరాలు
            </p>

            <div className="grid grid-cols-2 gap-2 my-3">
              <div className="p-2.5 bg-blue-50/60 rounded-xl border border-blue-100">
                <span className="text-[10px] uppercase font-bold text-blue-800 block">అంచనా దిగుబడి</span>
                <span className="text-lg font-black text-gray-900">
                  {currentCrop?.expected_quantity_quintals || 45} క్వింటాళ్ళు
                </span>
              </div>
              <div className="p-2.5 bg-emerald-50/60 rounded-xl border border-emerald-100">
                <span className="text-[10px] uppercase font-bold text-emerald-800 block">విక్రయించదగిన మిగులు</span>
                <span className="text-lg font-black text-emerald-900">
                  {currentCrop?.surplus_predicted || 12} క్వింటాళ్ళు
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('production')}
            className="w-full py-3 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white font-black text-sm shadow-md flex items-center justify-center gap-1.5 transition-all mt-2"
          >
            <span>{t('trackProduction')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Card 3: Market Opportunities */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-200 shadow-md hover:shadow-xl transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                <Store className="w-4 h-4 text-amber-600" />
                {t('marketOppTitle')}
              </span>
              <span className="px-3 py-1 rounded-xl bg-amber-400 text-emerald-950 font-black text-xs">
                {buyerCount} కొనుగోలుదారులు సిద్ధం
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-gray-900 mb-1">
              ప్రత్యక్ష మార్కెట్ ధరలు
            </h3>
            <p className="text-xs text-gray-500 font-semibold mb-3">
              ITC, ఆయిల్ మిల్లులు, ఈ-నామ్ మరియు ప్రాసెసర్లు
            </p>

            <div className="p-3 bg-amber-50/70 rounded-2xl border border-amber-200 text-xs text-amber-950 space-y-1 mb-4 font-medium">
              <p>• మధ్యవర్తులు లేకుండా మంచి గిట్టుబాటు ధర పొందండి.</p>
              <p>• కనీస మద్దతు ధర (MSP) కంటే ఎక్కువ చెల్లింపులు.</p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('markets')}
            className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-emerald-950 font-black text-sm shadow-md flex items-center justify-center gap-1.5 transition-all"
          >
            <span>{t('findBuyers')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Card 4: Government Schemes */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-200 shadow-md hover:shadow-xl transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-purple-800 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                <Landmark className="w-4 h-4 text-purple-600" />
                {t('govtSupportTitle')}
              </span>
              <span className="px-3 py-1 rounded-xl bg-purple-100 text-purple-900 font-bold text-xs">
                {schemeCount} ధృవీకరించిన పథకాలు
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-gray-900 mb-1">
              రైతు భరోసా & రాయితీలు
            </h3>
            <p className="text-xs text-gray-500 font-semibold mb-3">
              పీఎం కిసాన్, ఉచిత పంట బీమా మరియు సూక్ష్మ సేద్యం
            </p>

            <div className="p-3 bg-purple-50/70 rounded-2xl border border-purple-200 text-xs text-purple-950 space-y-1 mb-4 font-medium">
              <p>• ఏటా ₹13,500 పెట్టుబడి సాయం.</p>
              <p>• డ్రిప్ & స్ప్రింక్లర్లపై 90% వరకు భారీ రాయితీ.</p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('schemes')}
            className="w-full py-3 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white font-black text-sm shadow-md flex items-center justify-center gap-1.5 transition-all"
          >
            <span>{t('viewSchemes')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Quick Navigation Tiles (Section 6 Specification) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
        <button
          onClick={() => onNavigate('crops')}
          className="p-4 bg-white rounded-2xl border border-gray-200 hover:border-emerald-500 shadow-2xs hover:shadow-md transition-all text-center flex flex-col items-center gap-2 group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Sprout className="w-5 h-5 text-emerald-700" />
          </div>
          <span className="font-bold text-xs sm:text-sm text-gray-900">🌱 పంట సిఫార్సు</span>
        </button>

        <button
          onClick={() => onNavigate('production')}
          className="p-4 bg-white rounded-2xl border border-gray-200 hover:border-blue-500 shadow-2xs hover:shadow-md transition-all text-center flex flex-col items-center gap-2 group"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center group-hover:scale-110 transition-transform">
            <TrendingUp className="w-5 h-5 text-blue-700" />
          </div>
          <span className="font-bold text-xs sm:text-sm text-gray-900">📊 ఉత్పత్తి ట్రాకింగ్</span>
        </button>

        <button
          onClick={() => onNavigate('markets')}
          className="p-4 bg-white rounded-2xl border border-gray-200 hover:border-amber-500 shadow-2xs hover:shadow-md transition-all text-center flex flex-col items-center gap-2 group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Store className="w-5 h-5 text-amber-700" />
          </div>
          <span className="font-bold text-xs sm:text-sm text-gray-900">🛒 కొనుగోలుదారులు</span>
        </button>

        <button
          onClick={() => onNavigate('schemes')}
          className="p-4 bg-white rounded-2xl border border-gray-200 hover:border-purple-500 shadow-2xs hover:shadow-md transition-all text-center flex flex-col items-center gap-2 group"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Landmark className="w-5 h-5 text-purple-700" />
          </div>
          <span className="font-bold text-xs sm:text-sm text-gray-900">🏛 ప్రభుత్వ పథకాలు</span>
        </button>
      </div>

    </div>
  );
};
