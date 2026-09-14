import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import { CropRecommendation } from '../types';
import { CropCard } from '../components/CropCard';
import { PrivacyNotice } from '../components/PrivacyNotice';
import { Sprout, MapPin, Mountain, Droplets, Calendar, Sparkles, Filter, RefreshCw } from 'lucide-react';

interface CropRecommendationPageProps {
  onAskAiSpecific: (query: string) => void;
}

export const CropRecommendationPage: React.FC<CropRecommendationPageProps> = ({ onAskAiSpecific }) => {
  const { farmer } = useAuth();
  const { t } = useLanguage();

  const [district, setDistrict] = useState(farmer?.district || 'Guntur');
  const [soilType, setSoilType] = useState(farmer?.soil_type || 'Black Soil');
  const [waterAvail, setWaterAvail] = useState(farmer?.water_availability || 'Canal & Borewell');
  const [season, setSeason] = useState('Kharif');
  const [previousCrop, setPreviousCrop] = useState('');
  const [expectedAcreage, setExpectedAcreage] = useState(2.0);

  const [recommendations, setRecommendations] = useState<CropRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const apDistricts = [
    'Guntur', 'Anantapur', 'Kurnool', 'Krishna', 'West Godavari',
    'East Godavari', 'Prakasam', 'Chittoor', 'Visakhapatnam', 'Kadapa', 'Nellore'
  ];

  const soilTypes = [
    'Black Soil', 'Red Soil', 'Sandy Loam', 'Alluvial Soil', 'Clay Loam'
  ];

  const waterOptions = [
    'Canal & Borewell', 'Borewell Only', 'Canal Irrigation', 'Rainfed / Scarce', 'Drip / Micro-Irrigation'
  ];

  const seasons = ['Kharif (వర్షాకాలం)', 'Rabi (శీతాకాలం)', 'Zaid / Summer (వేసవి)'];

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const recs = await api.getRecommendations({
        district,
        soil_type: soilType,
        water_availability: waterAvail,
        season: season.split(' ')[0],
        expected_acreage: expectedAcreage
      });
      setRecommendations(recs);
    } catch (e: any) {
      setErrorMsg('సిఫార్సులను పొందడంలో సమస్య ఏర్పడింది.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDetectGps = () => {
    if (!navigator.geolocation) {
      alert('బ్రౌజర్‌లో లొకేషన్ సదుపాయం లేదు.');
      return;
    }

    setIsDetectingGps(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await api.detectRegion(pos.coords.latitude, pos.coords.longitude);
          setDistrict(res.district);
          if (res.primary_soil_types?.length) {
            setSoilType(res.primary_soil_types[0]);
          }
          if (res.typical_water_source) {
            setWaterAvail(res.typical_water_source.split(' (')[0]);
          }
        } catch (e) {
          // ignore
        } finally {
          setIsDetectingGps(false);
        }
      },
      () => {
        setIsDetectingGps(false);
      }
    );
  };

  return (
    <div className="space-y-8 py-4">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-950 text-white p-6 sm:p-8 rounded-3xl shadow-lg border-2 border-emerald-700">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-emerald-950 font-black text-xs uppercase tracking-wider">
            <Sprout className="w-4 h-4" />
            శాస్త్రీయ పంట ఎంపిక వేదిక
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            {t('cropRecHeader')}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200 font-medium">
            {t('cropRecSub')}
          </p>
        </div>
      </div>

      {/* Privacy Notice Banner */}
      <PrivacyNotice onDetectRegion={handleDetectGps} isDetecting={isDetectingGps} />

      {/* Farming Conditions Selection Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border-2 border-emerald-100 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <h3 className="text-lg sm:text-xl font-black text-gray-900 flex items-center gap-2">
            <Filter className="w-5 h-5 text-emerald-700" />
            మీ వ్యవసాయ పరిస్థితులను ఎంచుకోండి (Farming Conditions)
          </h3>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
            పారదర్శక స్కోరింగ్ మోడల్
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* District */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5 flex items-center gap-1">
              <MapPin className="w-4 h-4 text-emerald-600" />
              {t('selectDistrict')}
            </label>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full px-3.5 py-3 rounded-2xl border-2 border-gray-200 focus:border-emerald-600 focus:outline-none text-sm font-bold text-gray-900 bg-white"
            >
              {apDistricts.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Soil Type */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5 flex items-center gap-1">
              <Mountain className="w-4 h-4 text-emerald-600" />
              {t('selectSoil')}
            </label>
            <select
              value={soilType}
              onChange={(e) => setSoilType(e.target.value)}
              className="w-full px-3.5 py-3 rounded-2xl border-2 border-gray-200 focus:border-emerald-600 focus:outline-none text-sm font-bold text-gray-900 bg-white"
            >
              {soilTypes.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Water Availability */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5 flex items-center gap-1">
              <Droplets className="w-4 h-4 text-emerald-600" />
              {t('selectWater')}
            </label>
            <select
              value={waterAvail}
              onChange={(e) => setWaterAvail(e.target.value)}
              className="w-full px-3.5 py-3 rounded-2xl border-2 border-gray-200 focus:border-emerald-600 focus:outline-none text-sm font-bold text-gray-900 bg-white"
            >
              {waterOptions.map((w) => (
                <option key={w} value={w}>{w}</option>
              ))}
            </select>
          </div>

          {/* Season */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5 flex items-center gap-1">
              <Calendar className="w-4 h-4 text-emerald-600" />
              {t('selectSeason')}
            </label>
            <select
              value={season}
              onChange={(e) => setSeason(e.target.value)}
              className="w-full px-3.5 py-3 rounded-2xl border-2 border-gray-200 focus:border-emerald-600 focus:outline-none text-sm font-bold text-gray-900 bg-white"
            >
              {seasons.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

        </div>

        {/* Generate Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <p className="text-xs text-gray-500 font-medium">
            * స్కోరింగ్ మోడల్: మట్టి (25%), నీరు (20%), సీజన్ (20%), ప్రాంతం (15%), డిమాండ్ (10%), లాభం (10%)
          </p>
          <button
            onClick={fetchRecommendations}
            disabled={isLoading}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-60 text-white font-black text-sm sm:text-base shadow-lg flex items-center justify-center gap-2 transition-transform transform active:scale-95"
          >
            {isLoading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5 text-amber-300" />}
            <span>{isLoading ? 'విశ్లేషిస్తోంది...' : t('getRecommendationsBtn')}</span>
          </button>
        </div>

      </div>

      {errorMsg && (
        <div className="p-4 bg-red-50 text-red-800 rounded-2xl border border-red-200 text-sm font-semibold">
          {errorMsg}
        </div>
      )}

      {/* Results Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900">
            మీ పరిస్థితులకు సరిపోయే సిఫార్సు చేసిన పంటలు ({recommendations.length})
          </h2>
          <span className="text-xs text-gray-500 font-semibold">
            అత్యధిక అనుకూలత క్రమంలో
          </span>
        </div>

        {isLoading ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 space-y-3">
            <RefreshCw className="w-10 h-10 text-emerald-600 animate-spin mx-auto" />
            <p className="text-base font-bold text-gray-700">మీ ప్రాంత వ్యవసాయ డేటాను విశ్లేషిస్తోంది...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {recommendations.map((crop, idx) => (
              <CropCard
                key={crop.crop_id}
                crop={crop}
                rank={idx + 1}
                onAskAiWhy={(cropName) => {
                  onAskAiSpecific(`Why is ${cropName} recommended for ${district} with ${soilType} and ${waterAvail}?`);
                }}
              />
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
