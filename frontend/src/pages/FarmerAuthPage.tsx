import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Sprout, Phone, Lock, User, MapPin, Droplets, Mountain, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export const FarmerAuthPage: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const { t, language } = useLanguage();
  const { loginFarmer, registerFarmer, loginDemoFarmer, isLoading } = useAuth();

  const [isRegister, setIsRegister] = useState(false);
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [district, setDistrict] = useState('Guntur');
  const [soilType, setSoilType] = useState('Black Soil');
  const [waterAvail, setWaterAvail] = useState('Canal & Borewell');
  const [experience, setExperience] = useState('5-10 years');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const apDistricts = [
    'Guntur', 'Anantapur', 'Kurnool', 'Krishna', 'West Godavari',
    'East Godavari', 'Prakasam', 'Chittoor', 'Visakhapatnam', 'Kadapa', 'Nellore'
  ];

  const soilTypes = [
    'Black Soil (నల్లరేగడి నేలలు)',
    'Red Soil (ఎర్ర నేలలు)',
    'Sandy Loam (ఇసుకతో కూడిన నేలలు)',
    'Alluvial Soil (ఒండ్రు నేలలు)',
    'Clay Loam (బంకమట్టి నేలలు)'
  ];

  const waterOptions = [
    'Canal & Borewell (కాలువ & బోరుబావి)',
    'Borewell Only (బోరుబావి మాత్రమే)',
    'Canal Irrigation (కాలువ ఆయకట్టు)',
    'Rainfed / Scarce (వర్షాధారం / తక్కువ నీరు)',
    'Drip / Micro-Irrigation (డ్రిప్ లేదా తుంపర)'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!mobile || mobile.length < 10) {
      setErrorMsg('దయచేసి సరైన 10 అంకెల మొబైల్ నంబర్ నమోదు చేయండి.');
      return;
    }
    if (!password || password.length < 4) {
      setErrorMsg('దయచేసి కనీసం 4 అక్షరాల పాస్‌వర్డ్ నమోదు చేయండి.');
      return;
    }

    try {
      if (isRegister) {
        if (!name.trim()) {
          setErrorMsg('దయచేసి మీ పేరును నమోదు చేయండి.');
          return;
        }
        await registerFarmer({
          name,
          mobile,
          password,
          preferred_language: language,
          state: 'Andhra Pradesh',
          district,
          soil_type: soilType.split(' (')[0],
          water_availability: waterAvail.split(' (')[0],
          farming_experience: experience
        });
      } else {
        await loginFarmer(mobile, password);
      }
      onSuccess();
    } catch (err: any) {
      setErrorMsg(err.message || 'ల్యాగిన్ లేదా నమోదులో సమస్య ఏర్పడింది.');
    }
  };

  const handleDemoClick = async () => {
    setErrorMsg(null);
    try {
      await loginDemoFarmer();
      onSuccess();
    } catch (err: any) {
      setErrorMsg('డెమో లాగిన్ విఫలమైంది: ' + err.message);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-8 px-4">
      <div className="bg-white rounded-3xl shadow-xl border-2 border-emerald-200 overflow-hidden">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-emerald-800 to-emerald-950 text-white p-6 sm:p-8 text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-amber-400 text-emerald-950 flex items-center justify-center mx-auto shadow-md">
            <Sprout className="w-8 h-8 text-emerald-950" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black">
            {isRegister ? 'రైతు ఖాతా నమోదు (Farmer Registration)' : 'రైతు లాగిన్ (Farmer Login)'}
          </h2>
          <p className="text-xs sm:text-sm text-emerald-200">
            {isRegister ? 'సులభమైన విధానం • ఎటువంటి పత్రాలు అవసరం లేదు' : 'మీ మొబైల్ నంబర్‌తో ప్రవేశించండి'}
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Quick Demo Login Pill for Hackathon presentation */}
          <div className="bg-amber-50 p-3.5 rounded-2xl border-2 border-amber-300 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <span className="text-xs font-black text-amber-900 uppercase flex items-center gap-1">
                <Zap className="w-4 h-4 text-amber-600 fill-amber-500" />
                హ్యాకథాన్ త్వరిత లాగిన్ (One-Click Demo)
              </span>
              <p className="text-xs text-amber-800 mt-0.5">
                ఫారమ్ నింపకుండా నేరుగా రామేశ్ బాబు (గుంటూరు) ఖాతాలోకి ప్రవేశించండి.
              </p>
            </div>
            <button
              type="button"
              onClick={handleDemoClick}
              disabled={isLoading}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black text-xs shadow-md shrink-0 transition-transform active:scale-95"
            >
              ⚡ డెమో లాగిన్
            </button>
          </div>

          {errorMsg && (
            <div className="p-3.5 bg-red-50 text-red-800 rounded-2xl border border-red-200 text-xs sm:text-sm font-semibold">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {isRegister && (
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  రైతు పూర్తి పేరు (Farmer Name) *
                </label>
                <div className="relative">
                  <User className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="ఉదా. రాము లేదా Ramesh Babu"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-600 focus:outline-none text-sm text-gray-900 font-medium"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                మొబైల్ నంబర్ (Mobile Number) *
              </label>
              <div className="relative">
                <Phone className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="ఉదా. 9876543210"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-600 focus:outline-none text-sm text-gray-900 font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                పాస్‌వర్డ్ (Password) *
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="కనీసం 4 అక్షరాలు"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-600 focus:outline-none text-sm text-gray-900 font-medium"
                />
              </div>
            </div>

            {/* Registration Extra Fields: Region, Soil, Water (Strictly General - Zero Exact GPS) */}
            {isRegister && (
              <div className="space-y-4 pt-2 border-t border-gray-100">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1 flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    జిల్లా (District)
                  </label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 focus:border-emerald-600 focus:outline-none text-sm text-gray-900 font-medium bg-white"
                  >
                    {apDistricts.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1 flex items-center gap-1">
                    <Mountain className="w-4 h-4 text-emerald-600" />
                    మీ నేల రకం (Soil Type)
                  </label>
                  <select
                    value={soilType}
                    onChange={(e) => setSoilType(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 focus:border-emerald-600 focus:outline-none text-sm text-gray-900 font-medium bg-white"
                  >
                    {soilTypes.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1 flex items-center gap-1">
                    <Droplets className="w-4 h-4 text-emerald-600" />
                    నీటి లభ్యత (Water Availability)
                  </label>
                  <select
                    value={waterAvail}
                    onChange={(e) => setWaterAvail(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 focus:border-emerald-600 focus:outline-none text-sm text-gray-900 font-medium bg-white"
                  >
                    {waterOptions.map((w) => (
                      <option key={w} value={w}>{w}</option>
                    ))}
                  </select>
                </div>

                {/* Privacy disclaimer */}
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>గోప్యత రక్షణ:</strong> మీ ఖచ్చితమైన పొలం సరిహద్దులు లేదా భూమి యాజమాన్య పత్రాలు మేము అడగడం లేదు.
                  </span>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-60 text-white font-black text-base shadow-lg flex items-center justify-center gap-2 transition-transform transform active:scale-98"
            >
              <span>{isRegister ? 'నమోదు పూర్తి చేయండి' : 'ప్రవేశించండి (Login)'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>

          </form>

          {/* Toggle between Register and Login */}
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setErrorMsg(null);
              }}
              className="text-xs sm:text-sm font-bold text-emerald-800 hover:underline"
            >
              {isRegister ? 'ఇప్పటికే ఖాతా ఉందా? లాగిన్ అవ్వండి' : 'కొత్త రైతులా? ఇక్కడ నమోదు చేసుకోండి'}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
