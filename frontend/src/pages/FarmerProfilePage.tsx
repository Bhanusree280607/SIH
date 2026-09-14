import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import { languages } from '../i18n';
import { LanguageCode } from '../types';
import { User, Phone, MapPin, Mountain, Droplets, Globe, ShieldCheck, Save, LogOut } from 'lucide-react';

export const FarmerProfilePage: React.FC = () => {
  const { farmer, updateFarmerLocal, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const [name, setName] = useState(farmer?.name || '');
  const [district, setDistrict] = useState(farmer?.district || 'Guntur');
  const [soilType, setSoilType] = useState(farmer?.soil_type || 'Black Soil');
  const [waterAvail, setWaterAvail] = useState(farmer?.water_availability || 'Canal & Borewell');
  const [experience, setExperience] = useState(farmer?.farming_experience || '10+ years');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const updated = await api.updateFarmerProfile({
        name,
        district,
        soil_type: soilType,
        water_availability: waterAvail,
        farming_experience: experience,
        preferred_language: language
      });
      updateFarmerLocal(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (e) {
      alert('ప్రొఫైల్ సేవ్ చేయడంలో సమస్య ఏర్పడింది.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-6 px-4 space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-100 shadow-md flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-black text-2xl shadow-md">
            {farmer?.name.charAt(0) || 'R'}
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900">{farmer?.name}</h2>
            <p className="text-xs font-bold text-gray-500 flex items-center gap-1 mt-0.5">
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              {farmer?.mobile}
            </p>
          </div>
        </div>

        <button
          onClick={logout}
          className="px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>{t('logout')}</span>
        </button>
      </div>

      {/* Profile Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-100 shadow-md space-y-6">
        <h3 className="text-lg font-black text-gray-900 border-b border-gray-100 pb-3">
          వ్యవసాయ సమాచారం & ప్రాధాన్యతలు (Farming Profile)
        </h3>

        {saveSuccess && (
          <div className="p-3.5 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-200 text-xs font-bold">
            ✓ మీ వ్యవసాయ వివరాలు విజయవంతంగా అప్‌డేట్ చేయబడ్డాయి!
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">రైతు పేరు</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border-2 border-gray-200 font-bold text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1 flex items-center gap-1">
              <Globe className="w-4 h-4 text-emerald-600" />
              ప్రాధాన్య భాష (Preferred Language)
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as LanguageCode)}
              className="w-full px-3.5 py-2.5 rounded-xl border-2 border-gray-200 font-bold text-sm bg-white"
            >
              {Object.entries(languages).map(([code, meta]) => (
                <option key={code} value={code}>{meta.nativeName} ({meta.name})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1 flex items-center gap-1">
                <MapPin className="w-4 h-4 text-emerald-600" />
                జిల్లా (District)
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border-2 border-gray-200 font-bold text-sm bg-white"
              >
                {apDistricts.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1 flex items-center gap-1">
                <Mountain className="w-4 h-4 text-emerald-600" />
                నేల రకం (Soil Type)
              </label>
              <select
                value={soilType}
                onChange={(e) => setSoilType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border-2 border-gray-200 font-bold text-sm bg-white"
              >
                {soilTypes.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1 flex items-center gap-1">
              <Droplets className="w-4 h-4 text-emerald-600" />
              నీటి లభ్యత (Water Availability)
            </label>
            <select
              value={waterAvail}
              onChange={(e) => setWaterAvail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border-2 border-gray-200 font-bold text-sm bg-white"
            >
              {waterOptions.map((w) => (
                <option key={w} value={w}>{w}</option>
              ))}
            </select>
          </div>

          {/* Privacy statement */}
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>గోప్యత హామీ:</strong> మీ స్థానం కేవలం జిల్లా స్థాయికి మాత్రమే పరిమితం. మీ పొలం జీపీఎస్ వివరాలు ఎక్కడా నమోదు కావు.
            </span>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-sm shadow-md flex items-center justify-center gap-2 transition-transform active:scale-98"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'భద్రపరుస్తోంది...' : 'వివరాలు భద్రపరచండి (Save Profile)'}</span>
          </button>
        </form>
      </div>

    </div>
  );
};
