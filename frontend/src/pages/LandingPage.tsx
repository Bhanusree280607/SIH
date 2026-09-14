import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { languages } from '../i18n';
import { LanguageCode } from '../types';
import {
  Sprout,
  Mic,
  TrendingUp,
  Landmark,
  ShieldCheck,
  Store,
  ArrowRight,
  Sparkles,
  MapPin,
  CheckCircle2,
  Users
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (tab: string) => void;
  openVoiceAssistant: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, openVoiceAssistant }) => {
  const { language, setLanguage, t } = useLanguage();
  const { farmer, admin, loginDemoFarmer, loginDemoAdmin } = useAuth();

  return (
    <div className="space-y-16 py-4">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-emerald-800 via-emerald-900 to-emerald-950 text-white p-6 sm:p-12 lg:p-16 shadow-2xl border-4 border-amber-400/40">
        
        {/* Background decorative agricultural patterns */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          
          {/* SIH Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400 text-emerald-950 font-black text-xs sm:text-sm uppercase tracking-wider shadow-md">
            <Sparkles className="w-4 h-4" />
            Smart India Hackathon • Problem Statement 26193
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight drop-shadow-md">
            {t('heroTitle')}
          </h1>

          <p className="text-base sm:text-xl text-emerald-100 font-medium leading-relaxed max-w-3xl mx-auto">
            {t('heroSubtitle')}
          </p>

          {/* Language Selector Banner */}
          <div className="pt-2">
            <p className="text-xs sm:text-sm font-bold text-amber-300 uppercase tracking-wider mb-3">
              {t('selectLangPrompt')}
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {Object.entries(languages).map(([code, meta]) => (
                <button
                  key={code}
                  onClick={() => setLanguage(code as LanguageCode)}
                  className={`px-3.5 py-1.5 rounded-xl font-bold text-xs sm:text-sm transition-all transform active:scale-95 ${
                    language === code
                      ? 'bg-amber-400 text-emerald-950 shadow-lg scale-105 border-2 border-amber-300'
                      : 'bg-emerald-800/80 hover:bg-emerald-700 text-white border border-emerald-600'
                  }`}
                >
                  {meta.nativeName}
                </button>
              ))}
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            
            {/* Big Mic Button */}
            <button
              onClick={openVoiceAssistant}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black text-base sm:text-lg shadow-xl flex items-center justify-center gap-3 transition-transform transform hover:scale-105 active:scale-95"
            >
              <Mic className="w-6 h-6 animate-bounce text-emerald-950" />
              <span>{t('tapToSpeak')}</span>
            </button>

            {/* Dashboard / Register Button */}
            {farmer ? (
              <button
                onClick={() => onNavigate('dashboard')}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white hover:bg-emerald-50 text-emerald-900 font-black text-base sm:text-lg shadow-xl flex items-center justify-center gap-2 transition-transform transform hover:scale-105"
              >
                <span>{t('navDashboard')}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={() => onNavigate('auth')}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white hover:bg-emerald-50 text-emerald-900 font-black text-base sm:text-lg shadow-xl flex items-center justify-center gap-2 transition-transform transform hover:scale-105"
              >
                <span>{t('register')} / {t('login')}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            )}

          </div>

          {/* Quick Demo Launchers for Judges */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3 text-xs">
            <span className="text-emerald-300 font-bold uppercase">{t('sihJudgeDemo')}</span>
            <button
              onClick={async () => {
                await loginDemoFarmer();
                onNavigate('dashboard');
              }}
              className="px-3 py-1 rounded-lg bg-emerald-700/80 hover:bg-emerald-700 text-amber-300 font-bold border border-emerald-500 underline"
            >
              {t('farmerDemoBtn')}
            </button>
            <button
              onClick={async () => {
                await loginDemoAdmin();
                onNavigate('admin');
              }}
              className="px-3 py-1 rounded-lg bg-purple-900/80 hover:bg-purple-800 text-purple-200 font-bold border border-purple-500 underline"
            >
              {t('adminDemoBtn')}
            </button>
          </div>

        </div>
      </section>

      {/* Core Features Grid */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
            {t('exploreFeatures')}
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-gray-900">
            {t('farmerEmpowerTitle')}
          </h2>
          <p className="text-sm sm:text-base text-gray-600 font-medium">
            {t('farmerEmpowerSub')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card 1: Crop Rec */}
          <div 
            onClick={() => onNavigate('crops')}
            className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-emerald-100 shadow-sm hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Sprout className="w-8 h-8 text-emerald-700" />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-2 group-hover:text-emerald-700 transition-colors">
                {t('feature1Title')}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {t('feature1Desc')}
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-emerald-800">
              <span>{t('getRecAction')}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Production Tracking */}
          <div 
            onClick={() => onNavigate('production')}
            className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-emerald-100 shadow-sm hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-8 h-8 text-blue-700" />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">
                {t('feature2Title')}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {t('feature2Desc')}
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-blue-800">
              <span>{t('logProdAction')}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Direct Buyers */}
          <div 
            onClick={() => onNavigate('markets')}
            className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-emerald-100 shadow-sm hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Store className="w-8 h-8 text-amber-700" />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-2 group-hover:text-amber-700 transition-colors">
                {t('feature3Title')}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {t('feature3Desc')}
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-amber-800">
              <span>{t('viewRatesAction')}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: Govt Schemes */}
          <div 
            onClick={() => onNavigate('schemes')}
            className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-emerald-100 shadow-sm hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Landmark className="w-8 h-8 text-purple-700" />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-2 group-hover:text-purple-700 transition-colors">
                {t('feature4Title')}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {t('feature4Desc')}
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-purple-800">
              <span>{t('applySchemesAction')}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 5: AI Voice Assistant */}
          <div 
            onClick={openVoiceAssistant}
            className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-emerald-100 shadow-sm hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-800 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Mic className="w-8 h-8 text-red-700" />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-2 group-hover:text-red-700 transition-colors">
                {t('feature5Title')}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {t('feature5Desc')}
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-red-800">
              <span>{t('talkToAiAction')}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 6: Privacy by Design */}
          <div 
            className="bg-gradient-to-br from-emerald-900 to-teal-900 p-6 sm:p-8 rounded-3xl text-white shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-amber-400 text-emerald-950 flex items-center justify-center mb-5">
                <ShieldCheck className="w-8 h-8 text-emerald-950" />
              </div>
              <h3 className="text-xl font-black text-white mb-2">
                {t('feature6Title')}
              </h3>
              <p className="text-sm text-emerald-100 leading-relaxed">
                {t('feature6Desc')}
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-emerald-800/80 text-xs font-bold text-amber-300">
              {t('privacyGuaranteedAction')}
            </div>
          </div>

        </div>
      </section>

      {/* Demo Flow Preview Banner for Hackathon Presentation */}
      <section className="bg-amber-50 rounded-3xl p-6 sm:p-10 border-2 border-amber-200">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4 text-amber-600" />
            SIH 26193 (Presentation Walkthrough)
          </div>
          <h3 className="text-2xl font-black text-amber-950 mb-4">
            {t('demoWalkthroughTitle')}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-medium text-amber-900">
            <div className="p-3 bg-white rounded-xl border border-amber-200 shadow-2xs">
              <span className="font-bold text-amber-700 block mb-1">{t('demoStep1Title')}</span>
              {t('demoStep1Desc')}
            </div>
            <div className="p-3 bg-white rounded-xl border border-amber-200 shadow-2xs">
              <span className="font-bold text-amber-700 block mb-1">{t('demoStep2Title')}</span>
              {t('demoStep2Desc')}
            </div>
            <div className="p-3 bg-white rounded-xl border border-amber-200 shadow-2xs">
              <span className="font-bold text-amber-700 block mb-1">{t('demoStep3Title')}</span>
              {t('demoStep3Desc')}
            </div>
            <div className="p-3 bg-white rounded-xl border border-amber-200 shadow-2xs">
              <span className="font-bold text-amber-700 block mb-1">{t('demoStep4Title')}</span>
              {t('demoStep4Desc')}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
