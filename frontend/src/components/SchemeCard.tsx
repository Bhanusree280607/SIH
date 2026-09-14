import React, { useState } from 'react';
import { GovernmentScheme } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { Landmark, ExternalLink, CheckCircle, FileText, Phone, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface SchemeCardProps {
  scheme: GovernmentScheme;
  onAskAi: (schemeName: string) => void;
}

export const SchemeCard: React.FC<SchemeCardProps> = ({ scheme, onAskAi }) => {
  const { language, t } = useLanguage();
  const [expanded, setExpanded] = useState(false);

  const isTelugu = language === 'te';
  const name = isTelugu ? scheme.telugu_name : scheme.scheme_name;
  const benefits = isTelugu && scheme.telugu_benefits ? scheme.telugu_benefits : scheme.benefits;
  const eligibility = isTelugu && scheme.telugu_eligibility ? scheme.telugu_eligibility : scheme.eligibility;

  return (
    <div className="bg-white rounded-3xl shadow-md hover:shadow-xl transition-all duration-200 border-2 border-emerald-100 overflow-hidden flex flex-col justify-between">
      
      <div className="p-5 sm:p-6 pb-4">
        {/* Category & State Tag */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
            {scheme.category}
          </span>
          <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-md">
            {scheme.state}
          </span>
        </div>

        {/* Title */}
        <div className="flex items-start gap-2.5 mb-2">
          <Landmark className="w-5 h-5 text-emerald-700 shrink-0 mt-1" />
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              {name}
            </h3>
            {isTelugu && (
              <p className="text-xs text-gray-500 font-medium">{scheme.scheme_name}</p>
            )}
          </div>
        </div>

        {/* Benefits Highlight */}
        <div className="my-3 bg-emerald-50/60 p-3 rounded-2xl border border-emerald-100">
          <p className="text-xs font-bold text-emerald-900 uppercase tracking-wide mb-1 flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            {t('benefits')}:
          </p>
          <p className="text-xs sm:text-sm font-semibold text-gray-800 leading-relaxed">
            {benefits}
          </p>
        </div>

        {/* Eligibility summary */}
        <div className="text-xs sm:text-sm text-gray-600 space-y-1 my-2">
          <p><strong className="text-gray-900">{t('eligibility')}:</strong> {eligibility}</p>
        </div>

        {/* Expandable Details: Documents & Application Process */}
        {expanded && (
          <div className="mt-4 pt-3 border-t border-gray-100 space-y-3 text-xs sm:text-sm animate-in fade-in duration-150">
            <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200">
              <p className="font-bold text-amber-900 text-xs uppercase flex items-center gap-1 mb-1">
                <FileText className="w-3.5 h-3.5 text-amber-700" />
                {t('documentsRequired')}:
              </p>
              <p className="text-gray-700">{scheme.documents_required}</p>
            </div>

            <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200">
              <p className="font-bold text-blue-900 text-xs uppercase mb-1">దరఖాస్తు విధానం (Application Process):</p>
              <p className="text-gray-700">{scheme.application_process}</p>
            </div>

            <div className="flex items-center gap-1 text-xs text-emerald-800 font-bold">
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t('helpline')}: {scheme.helpline}</span>
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="p-4 sm:p-5 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs sm:text-sm font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
        >
          {expanded ? (
            <><span>తక్కువ సమాచారం</span><ChevronUp className="w-4 h-4" /></>
          ) : (
            <><span>కావలసిన పత్రాలు & విధానం</span><ChevronDown className="w-4 h-4" /></>
          )}
        </button>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Ask AI Button */}
          <button
            onClick={() => onAskAi(scheme.scheme_name)}
            className="p-2.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-900 text-xs font-bold flex items-center justify-center transition-colors"
            title="Ask AI about this scheme"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Verified Official Portal Link */}
          <a
            href={scheme.official_url}
            target="_blank"
            rel="noreferrer"
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-1.5 transition-all"
          >
            <span>{t('applyOfficialBtn')}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

    </div>
  );
};
