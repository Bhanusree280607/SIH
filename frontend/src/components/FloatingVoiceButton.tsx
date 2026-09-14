import React from 'react';
import { Mic } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface FloatingVoiceButtonProps {
  onClick: () => void;
}

export const FloatingVoiceButton: React.FC<FloatingVoiceButtonProps> = ({ onClick }) => {
  const { t } = useLanguage();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      {/* Tooltip badge for low-digital literacy farmers */}
      <div className="hidden sm:flex items-center bg-white text-emerald-900 px-3.5 py-1.5 rounded-full shadow-lg border border-emerald-200 text-xs font-bold animate-pulse">
        <span>🎙 {t('tapToSpeak')}</span>
      </div>

      {/* Pulsing Voice Button */}
      <button
        onClick={onClick}
        className="voice-active-pulse relative w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-gradient-to-tr from-emerald-700 to-green-500 text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all duration-200 border-3 border-amber-300 group"
        aria-label="Ask Voice Assistant"
      >
        <Mic className="w-8 h-8 text-white group-hover:scale-110 transition-transform" />
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500"></span>
        </span>
      </button>
    </div>
  );
};
