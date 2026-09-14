import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import { GovernmentScheme } from '../types';
import { SchemeCard } from '../components/SchemeCard';
import { Landmark, Search, Filter, ShieldCheck } from 'lucide-react';

interface GovernmentSchemesPageProps {
  onAskAiSpecific: (query: string) => void;
}

export const GovernmentSchemesPage: React.FC<GovernmentSchemesPageProps> = ({ onAskAiSpecific }) => {
  const { farmer } = useAuth();
  const { t } = useLanguage();

  const [schemes, setSchemes] = useState<GovernmentScheme[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const categories = [
    'All',
    'Financial Support',
    'Crop Insurance',
    'Irrigation',
    'Machinery',
    'Soil Fertility',
    'Market Linkage'
  ];

  useEffect(() => {
    loadSchemes();
  }, [selectedCategory, searchQuery]);

  const loadSchemes = async () => {
    setIsLoading(true);
    try {
      const data = await api.getSchemes({
        category: selectedCategory === 'All' ? undefined : selectedCategory,
        search: searchQuery || undefined
      });
      setSchemes(data);
    } catch (e) {
      // fallback
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 py-4">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-purple-950 to-indigo-950 text-white p-6 sm:p-8 rounded-3xl shadow-lg border-2 border-purple-800">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-400/20 text-purple-200 font-black text-xs uppercase tracking-wider border border-purple-400/30">
            <Landmark className="w-4 h-4" />
            ప్రభుత్వ రైతు సంక్షేమ పథకాలు
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            {t('schemesHeader')}
          </h1>
          <p className="text-xs sm:text-sm text-purple-200">
            {t('schemesSub')}
          </p>
        </div>
      </div>

      {/* Verified Notice Banner */}
      <div className="bg-purple-50 p-4 rounded-2xl border border-purple-200 flex items-center gap-3 text-xs sm:text-sm text-purple-950">
        <ShieldCheck className="w-5 h-5 text-purple-700 shrink-0" />
        <span>
          <strong>ప్రామాణిక హామీ:</strong> ఇక్కడ ప్రదర్శించబడిన పథకాలు, రాయితీలు మరియు అర్హతలు కేవలం అధికారిక ప్రభుత్వ పోర్టల్స్ (pmkisan.gov.in, ysrrythubharosa.ap.gov.in మొదలైనవి) నుండి మాత్రమే ధృవీకరించబడ్డాయి.
        </span>
      </div>

      {/* Search & Category Filter */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-md border-2 border-purple-100 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="పథకం పేరు లేదా లబ్ధిదారుని వివరాలతో శోధించండి (ఉదా. రైతు భరోసా లేదా డ్రిప్)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-purple-600 focus:outline-none text-sm font-medium"
            />
          </div>

          <div className="sm:w-64">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-purple-600 focus:outline-none text-sm font-bold bg-white"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c === 'All' ? 'అన్ని వర్గాలు (All Categories)' : c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Category Badges */}
        <div className="flex flex-wrap gap-2 pt-1">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                selectedCategory === c
                  ? 'bg-purple-800 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Schemes Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {schemes.map((scheme) => (
          <SchemeCard
            key={scheme.id}
            scheme={scheme}
            onAskAi={(schemeName) => {
              onAskAiSpecific(`Explain the eligibility and application process for ${schemeName} in simple Telugu.`);
            }}
          />
        ))}
      </div>

    </div>
  );
};
