import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { languages } from '../i18n';
import { LanguageCode } from '../types';
import { Sprout, Mic, User, Shield, Menu, X, LogOut, Globe } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openVoiceAssistant: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, openVoiceAssistant }) => {
  const { language, setLanguage, t, langMeta } = useLanguage();
  const { farmer, admin, role, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const navItems = [
    { id: 'home', label: t('navHome') },
    { id: 'dashboard', label: t('navDashboard') },
    { id: 'crops', label: t('navCropRec') },
    { id: 'production', label: t('navProduction') },
    { id: 'markets', label: t('navMarkets') },
    { id: 'schemes', label: t('navSchemes') },
  ];

  return (
    <header className="sticky top-0 z-40 bg-emerald-800 text-white shadow-md border-b-2 border-emerald-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => setActiveTab('home')} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-xl bg-amber-400 text-emerald-950 flex items-center justify-center font-bold shadow-md transform group-hover:scale-105 transition-transform">
              <Sprout className="w-7 h-7 text-emerald-900" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-white drop-shadow">
                  {t('platformName')}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-400 text-emerald-950">
                  SIH 26193
                </span>
              </div>
              <p className="text-xs text-emerald-200 font-medium hidden sm:block">
                {t('platformSub')}
              </p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-2 rounded-lg font-semibold text-sm lg:text-base transition-all ${
                  activeTab === item.id
                    ? 'bg-emerald-950 text-amber-300 shadow-inner'
                    : 'text-emerald-100 hover:bg-emerald-700/60 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right Action Tools: Voice AI, Language Switcher, User Auth */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Quick Voice Assistant Mic Header Button */}
            <button
              onClick={openVoiceAssistant}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs sm:text-sm shadow-md transition-transform transform active:scale-95"
              title="Voice Assistant"
            >
              <Mic className="w-4 h-4 animate-bounce" />
              <span className="hidden sm:inline">వాయిస్ AI</span>
            </button>

            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-700/80 hover:bg-emerald-700 text-white font-medium text-xs sm:text-sm border border-emerald-600 shadow-sm"
              >
                <Globe className="w-4 h-4 text-amber-300" />
                <span className="font-bold">{langMeta.nativeName}</span>
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 rounded-xl bg-white text-gray-800 shadow-2xl border border-gray-200 py-1 z-50">
                  <div className="px-3 py-1.5 text-xs font-semibold text-gray-500 border-b">
                    భాషను ఎంచుకోండి (Language)
                  </div>
                  {Object.entries(languages).map(([code, meta]) => (
                    <button
                      key={code}
                      onClick={() => {
                        setLanguage(code as LanguageCode);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between hover:bg-emerald-50 transition-colors ${
                        language === code ? 'font-bold text-emerald-800 bg-emerald-50/80' : ''
                      }`}
                    >
                      <span>{meta.nativeName}</span>
                      <span className="text-xs text-gray-400">({meta.name})</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Auth status & Profile */}
            {farmer ? (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setActiveTab('profile')}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-900/90 text-amber-300 hover:bg-emerald-950 font-medium text-xs sm:text-sm border border-emerald-700"
                >
                  <User className="w-4 h-4" />
                  <span className="max-w-[90px] truncate hidden sm:inline">{farmer.name.split(' ')[0]}</span>
                </button>
                <button
                  onClick={logout}
                  title="Logout"
                  className="p-1.5 text-emerald-200 hover:text-white hover:bg-emerald-700 rounded-lg"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : admin ? (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setActiveTab('admin')}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-900 text-purple-200 hover:bg-purple-950 font-medium text-xs sm:text-sm border border-purple-700"
                >
                  <Shield className="w-4 h-4 text-purple-300" />
                  <span>Admin</span>
                </button>
                <button
                  onClick={logout}
                  title="Logout"
                  className="p-1.5 text-emerald-200 hover:text-white hover:bg-emerald-700 rounded-lg"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setActiveTab('auth')}
                  className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs sm:text-sm transition-all"
                >
                  {t('login')}
                </button>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-emerald-100 hover:text-white hover:bg-emerald-700 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-emerald-900 border-t border-emerald-800 px-4 pt-2 pb-4 space-y-1 shadow-xl">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2.5 rounded-lg font-semibold text-base transition-colors ${
                activeTab === item.id
                  ? 'bg-emerald-950 text-amber-300'
                  : 'text-emerald-100 hover:bg-emerald-800'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-2 border-t border-emerald-800/80 flex items-center justify-between">
            <button
              onClick={() => {
                setActiveTab('admin');
                setMobileMenuOpen(false);
              }}
              className="text-xs font-semibold text-amber-300 hover:underline flex items-center gap-1"
            >
              <Shield className="w-3.5 h-3.5" />
              {t('navAdmin')}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
