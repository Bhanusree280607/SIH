import React, { useState } from 'react';
import { CropRecommendation } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { CheckCircle2, TrendingUp, Droplets, Mountain, Calendar, Sparkles, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';

interface CropCardProps {
  crop: CropRecommendation;
  rank: number;
  onAskAiWhy: (cropName: string) => void;
}

export const CropCard: React.FC<CropCardProps> = ({ crop, rank, onAskAiWhy }) => {
  const { language, t } = useLanguage();
  const [showDetails, setShowDetails] = useState(false);

  // Score color badge
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'bg-emerald-600 text-white border-emerald-700';
    if (score >= 75) return 'bg-lime-600 text-white border-lime-700';
    return 'bg-amber-600 text-white border-amber-700';
  };

  const isTelugu = language === 'te';
  const displayName = isTelugu ? crop.telugu_name : crop.crop_name;
  const secondaryName = isTelugu ? crop.crop_name : crop.telugu_name;
  const reasons = isTelugu && crop.telugu_reasons?.length ? crop.telugu_reasons : crop.reasons;
  const considerations = isTelugu && crop.telugu_considerations ? crop.telugu_considerations : crop.important_considerations;

  return (
    <div className="bg-white rounded-3xl shadow-md hover:shadow-xl transition-all duration-200 border-2 border-emerald-100 overflow-hidden flex flex-col justify-between">
      
      {/* Top Banner */}
      <div className="p-5 sm:p-6 pb-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black flex items-center justify-center">
                #{rank}
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                {displayName}
              </h3>
            </div>
            <p className="text-sm text-gray-500 font-semibold ml-9">
              {secondaryName} {crop.hindi_name ? `• ${crop.hindi_name}` : ''}
            </p>
          </div>

          {/* Large Suitability Score Badge */}
          <div className={`px-4 py-2 rounded-2xl border-2 font-black text-center shadow-sm shrink-0 ${getScoreColor(crop.suitability_score)}`}>
            <div className="text-2xl sm:text-3xl leading-none font-black">{crop.suitability_score}%</div>
            <div className="text-[10px] uppercase font-bold tracking-wider opacity-90 mt-0.5">{t('suitabilityScore')}</div>
          </div>
        </div>

        {/* Quick Requirement Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-4">
          <div className="bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-100">
            <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-800 uppercase">
              <Mountain className="w-3.5 h-3.5" />
              <span>{t('soilReq')}</span>
            </div>
            <p className="text-xs font-bold text-gray-800 mt-1 truncate">{crop.soil_requirement}</p>
          </div>

          <div className="bg-blue-50/70 p-2.5 rounded-xl border border-blue-100">
            <div className="flex items-center gap-1 text-[11px] font-bold text-blue-800 uppercase">
              <Droplets className="w-3.5 h-3.5" />
              <span>{t('waterReq')}</span>
            </div>
            <p className="text-xs font-bold text-gray-800 mt-1">{crop.water_requirement}</p>
          </div>

          <div className="bg-amber-50/70 p-2.5 rounded-xl border border-amber-100">
            <div className="flex items-center gap-1 text-[11px] font-bold text-amber-800 uppercase">
              <Calendar className="w-3.5 h-3.5" />
              <span>{t('selectSeason')}</span>
            </div>
            <p className="text-xs font-bold text-gray-800 mt-1">{crop.season}</p>
          </div>

          <div className="bg-purple-50/70 p-2.5 rounded-xl border border-purple-100">
            <div className="flex items-center gap-1 text-[11px] font-bold text-purple-800 uppercase">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{t('marketDemand')}</span>
            </div>
            <p className="text-xs font-bold text-gray-800 mt-1">₹{crop.market_price_per_quintal.toLocaleString()}/Qtl</p>
          </div>
        </div>

        {/* Reasons Why Recommended */}
        <div className="mt-3 bg-gray-50/90 p-3.5 rounded-2xl border border-gray-200">
          <p className="text-xs font-bold text-emerald-900 uppercase tracking-wide mb-2 flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            {t('whyRecommended')}
          </p>
          <ul className="space-y-1.5 text-xs sm:text-sm text-gray-700">
            {reasons.slice(0, 3).map((r, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-emerald-600 font-bold">•</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Detailed Expandable Section */}
        {showDetails && (
          <div className="mt-4 pt-4 border-t border-gray-200 space-y-3 text-xs sm:text-sm animate-in fade-in duration-150">
            
            {/* Score Breakdown Bars */}
            <div className="bg-white p-3 rounded-xl border border-gray-200 space-y-2">
              <p className="font-bold text-gray-800 text-xs uppercase">స్కోరింగ్ విశ్లేషణ (Score Breakdown):</p>
              
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span>మట్టి అనుకూలత (Soil Match):</span>
                  <span className="font-bold">{crop.breakdown.soil_match_score}/25</span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-600 h-full" style={{ width: `${(crop.breakdown.soil_match_score / 25) * 100}%` }}></div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span>నీటి లభ్యత (Water Match):</span>
                  <span className="font-bold">{crop.breakdown.water_match_score}/20</span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full" style={{ width: `${(crop.breakdown.water_match_score / 20) * 100}%` }}></div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span>మార్కెట్ డిమాండ్ & లాభం (Market & Profit):</span>
                  <span className="font-bold">{crop.breakdown.market_demand_score + crop.breakdown.profitability_score}/20</span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-600 h-full" style={{ width: `${((crop.breakdown.market_demand_score + crop.breakdown.profitability_score) / 20) * 100}%` }}></div>
                </div>
              </div>
            </div>

            {/* Important Farming Considerations */}
            <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200 text-amber-900 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
              <div>
                <span className="font-bold block text-xs uppercase mb-0.5">{t('importantNotes')}:</span>
                <p className="text-xs leading-relaxed">{considerations}</p>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* Action Footer */}
      <div className="p-4 sm:p-5 bg-emerald-50/50 border-t border-emerald-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-xs sm:text-sm font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 transition-colors"
        >
          {showDetails ? (
            <><span>తక్కువ వివరాలు</span><ChevronUp className="w-4 h-4" /></>
          ) : (
            <><span>పూర్తి వివరాలు & స్కోర్</span><ChevronDown className="w-4 h-4" /></>
          )}
        </button>

        {/* Ask AI Why Button */}
        <button
          onClick={() => onAskAiWhy(displayName)}
          className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black text-xs sm:text-sm shadow-md flex items-center justify-center gap-1.5 transition-all transform active:scale-95"
        >
          <Sparkles className="w-4 h-4 text-emerald-950" />
          <span>{t('askAiWhyBtn')}</span>
        </button>
      </div>

    </div>
  );
};
