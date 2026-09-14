import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ShieldCheck, MapPin, EyeOff, Lock } from 'lucide-react';

interface PrivacyNoticeProps {
  onDetectRegion?: () => void;
  isDetecting?: boolean;
}

export const PrivacyNotice: React.FC<PrivacyNoticeProps> = ({ onDetectRegion, isDetecting }) => {
  const { t } = useLanguage();

  return (
    <div className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg border-2 border-emerald-600/40 relative overflow-hidden">
      
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2 text-amber-300 font-bold text-xs sm:text-sm uppercase tracking-wider">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <span>{t('privacyNoticeTitle')}</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white">
            మీ పొలం ఖచ్చితమైన స్థానం మరియు సరిహద్దులు ఎల్లప్పుడూ సురక్షితం
          </h3>

          <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
            {t('privacyNoticeDesc')}
          </p>

          {/* Privacy Guarantees */}
          <div className="flex flex-wrap gap-3 pt-2 text-xs font-semibold text-emerald-200">
            <span className="flex items-center gap-1 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-700/60">
              <EyeOff className="w-3.5 h-3.5 text-amber-300" />
              జీపీఎస్ కోఆర్డినేట్లు సేవ్ కావు
            </span>
            <span className="flex items-center gap-1 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-700/60">
              <Lock className="w-3.5 h-3.5 text-amber-300" />
              డేటా గోప్యత హామీ
            </span>
          </div>
        </div>

        {onDetectRegion && (
          <button
            onClick={onDetectRegion}
            disabled={isDetecting}
            className="shrink-0 px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 disabled:opacity-60 text-emerald-950 font-black text-sm shadow-xl flex items-center gap-2 transition-all transform active:scale-95"
          >
            <MapPin className="w-5 h-5 text-emerald-950" />
            <span>{isDetecting ? 'ప్రాంతం గుర్తిస్తోంది...' : t('detectMyRegionBtn')}</span>
          </button>
        )}

      </div>

    </div>
  );
};
