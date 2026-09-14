import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Sprout, PhoneCall, ShieldCheck, ExternalLink, Heart } from 'lucide-react';

export const Footer: React.FC<{ onOpenPrivacy?: () => void }> = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-emerald-950 text-emerald-100 border-t-4 border-amber-500 pt-12 pb-8 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          
          {/* Brand & Purpose */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-amber-400 flex items-center justify-center text-emerald-950">
                <Sprout className="w-5 h-5 text-emerald-950" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">{t('platformName')}</span>
            </div>
            <p className="text-sm text-emerald-300 leading-relaxed mb-4">
              {t('heroSubtitle')}
            </p>
            <div className="flex items-center gap-2 text-xs text-amber-300 bg-emerald-900/60 p-2.5 rounded-lg border border-emerald-800">
              <ShieldCheck className="w-4 h-4 shrink-0 text-amber-400" />
              <span>{t('feature6Desc')}</span>
            </div>
          </div>

          {/* Kisan Helplines */}
          <div>
            <h4 className="text-base font-bold text-white mb-3 flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-amber-400" />
              రైతు సహాయవాణి (Helplines)
            </h4>
            <ul className="space-y-2 text-sm text-emerald-200">
              <li className="flex flex-col">
                <span className="text-xs text-emerald-400">Kisan Call Centre (All India)</span>
                <span className="font-bold text-white text-base">1800-180-1551</span>
              </li>
              <li className="flex flex-col">
                <span className="text-xs text-emerald-400">Andhra Pradesh Rythu Helpline</span>
                <span className="font-bold text-white text-base">1902 / 0863-2340500</span>
              </li>
              <li className="flex flex-col">
                <span className="text-xs text-emerald-400">e-NAM National Agri Market Helpdesk</span>
                <span className="font-bold text-white text-base">1800-270-0224</span>
              </li>
            </ul>
          </div>

          {/* Official Portals */}
          <div>
            <h4 className="text-base font-bold text-white mb-3">అధికారిక పోర్టల్స్ (Official Portals)</h4>
            <ul className="space-y-2 text-sm text-emerald-200">
              <li>
                <a 
                  href="https://pmkisan.gov.in" 
                  target="_blank" 
                  rel="noreferrer"
                  className="hover:text-amber-300 flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                  PM-KISAN Samman Nidhi
                </a>
              </li>
              <li>
                <a 
                  href="https://ysrrythubharosa.ap.gov.in" 
                  target="_blank" 
                  rel="noreferrer"
                  className="hover:text-amber-300 flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                  AP Rythu Bharosa Portal
                </a>
              </li>
              <li>
                <a 
                  href="https://pmfby.gov.in" 
                  target="_blank" 
                  rel="noreferrer"
                  className="hover:text-amber-300 flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                  Pradhan Mantri Fasal Bima
                </a>
              </li>
              <li>
                <a 
                  href="https://enam.gov.in" 
                  target="_blank" 
                  rel="noreferrer"
                  className="hover:text-amber-300 flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                  e-NAM National Agri Market
                </a>
              </li>
            </ul>
          </div>

          {/* SIH Hackathon & Technical Info */}
          <div>
            <h4 className="text-base font-bold text-white mb-3">Smart India Hackathon</h4>
            <div className="bg-emerald-900/50 p-3 rounded-lg border border-emerald-800 text-xs text-emerald-300 space-y-1.5">
              <p><strong className="text-white">Problem ID:</strong> 26193</p>
              <p><strong className="text-white">Title:</strong> AI-Powered Farmer Support Platform</p>
              <p><strong className="text-white">Focus State:</strong> Andhra Pradesh (with Pan-India expansion)</p>
              <p><strong className="text-white">Architecture:</strong> Privacy-by-design, Transparent AI, Multi-lingual Voice</p>
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-emerald-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-emerald-400 gap-4">
          <p>© 2026 RythuMithra – Built with <Heart className="w-3.5 h-3.5 inline text-red-400 fill-red-400" /> for Indian Farmers | Smart India Hackathon</p>
          <p className="text-emerald-300">Privacy Guaranteed: Zero GPS farm coordinates saved.</p>
        </div>
      </div>
    </footer>
  );
};
