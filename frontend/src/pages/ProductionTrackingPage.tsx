import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import { ProductionRecord } from '../types';
import {
  TrendingUp,
  Plus,
  Calendar,
  Package,
  Clock,
  Sparkles,
  CheckCircle,
  Trash2,
  Edit2,
  X,
  AlertCircle
} from 'lucide-react';

export const ProductionTrackingPage: React.FC = () => {
  const { farmer } = useAuth();
  const { t } = useLanguage();

  const [productions, setProductions] = useState<ProductionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Modal Form State
  const [cropName, setCropName] = useState('Paddy (వరి)');
  const [season, setSeason] = useState('Kharif');
  const [areaAcres, setAreaAcres] = useState(3.0);
  const [expectedQtl, setExpectedQtl] = useState(45.0);
  const [currentHarvested, setCurrentHarvested] = useState(10.0);
  const [plantingDate, setPlantingDate] = useState('2026-06-15');
  const [harvestDate, setHarvestDate] = useState('2026-11-20');
  const [status, setStatus] = useState('Growing');

  const popularCrops = [
    'Paddy (వరి)', 'Groundnut (వేరుశనగ)', 'Cotton (పత్తి)',
    'Chilli (మిరప)', 'Red Gram (కందులు)', 'Maize (మొక్కజొన్న)', 'Bengal Gram (శనగలు)'
  ];

  const statusOptions = ['Sown (విత్తబడింది)', 'Growing (పెరుగుతోంది)', 'Flowering (పూత దశ)', 'Harvesting (కోత దశ)', 'Completed (ముగిసింది)'];

  useEffect(() => {
    loadProductions();
  }, [farmer]);

  const loadProductions = async () => {
    setIsLoading(true);
    try {
      const data = await api.getProductions();
      setProductions(data);
    } catch (e) {
      // fallback
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createProduction({
        crop_name: cropName,
        season,
        area_acres: Number(areaAcres),
        expected_quantity_quintals: Number(expectedQtl),
        current_harvested_quintals: Number(currentHarvested),
        planting_date: plantingDate,
        expected_harvest_date: harvestDate,
        status: status.split(' (')[0]
      });
      setShowModal(false);
      loadProductions();
    } catch (e) {
      alert('నమోదు చేయడంలో సమస్య ఏర్పడింది.');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('ఈ రికార్డును తొలగించాలనుకుంటున్నారా?')) {
      await api.deleteProduction(id);
      loadProductions();
    }
  };

  // Aggregated farmer metrics
  const totalExpected = productions.reduce((acc, p) => acc + p.expected_quantity_quintals, 0);
  const totalHarvested = productions.reduce((acc, p) => acc + p.current_harvested_quintals, 0);
  const totalSurplus = productions.reduce((acc, p) => acc + p.surplus_predicted, 0);

  return (
    <div className="space-y-8 py-4">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white p-6 sm:p-8 rounded-3xl shadow-lg border-2 border-blue-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-400/20 text-blue-300 font-black text-xs uppercase tracking-wider border border-blue-400/30">
            <TrendingUp className="w-4 h-4" />
            దిగుబడి నిర్వహణ వేదిక
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            {t('prodHeader')}
          </h1>
          <p className="text-xs sm:text-sm text-blue-200">
            {t('prodSub')}
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black text-sm shadow-xl flex items-center justify-center gap-2 transition-transform active:scale-95 shrink-0"
        >
          <Plus className="w-5 h-5" />
          <span>{t('logNewCropBtn')}</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border-2 border-blue-100 shadow-sm">
          <span className="text-xs font-bold text-gray-500 uppercase block mb-1">
            మొత్తం అంచనా దిగుబడి (Expected)
          </span>
          <span className="text-3xl font-black text-gray-900">
            {totalExpected.toLocaleString()} <span className="text-sm font-semibold text-gray-500">క్వింటాళ్ళు</span>
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border-2 border-emerald-100 shadow-sm">
          <span className="text-xs font-bold text-gray-500 uppercase block mb-1">
            కోసిన దిగుబడి (Harvested so far)
          </span>
          <span className="text-3xl font-black text-emerald-700">
            {totalHarvested.toLocaleString()} <span className="text-sm font-semibold text-gray-500">క్వింటాళ్ళు</span>
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border-2 border-amber-100 shadow-sm">
          <span className="text-xs font-bold text-gray-500 uppercase block mb-1">
            విక్రయించదగిన మిగులు (Marketable Surplus)
          </span>
          <span className="text-3xl font-black text-amber-700">
            {totalSurplus.toLocaleString()} <span className="text-sm font-semibold text-gray-500">క్వింటాళ్ళు</span>
          </span>
        </div>
      </div>

      {/* Productions List */}
      <div className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-black text-gray-900">
          సాగులో ఉన్న పంటల వివరాలు ({productions.length})
        </h2>

        {productions.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border-2 border-dashed border-gray-300 p-6 space-y-3">
            <Package className="w-12 h-12 text-gray-400 mx-auto" />
            <p className="text-base font-bold text-gray-700">ఇంతవరకు పంటలు నమోదు కాలేదు.</p>
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 rounded-xl bg-emerald-700 text-white font-bold text-sm"
            >
              + మొదటి పంటను నమోదు చేయండి
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {productions.map((p) => {
              const harvestProgress = Math.min(100, Math.round((p.current_harvested_quintals / (p.expected_quantity_quintals || 1)) * 100));

              return (
                <div key={p.id} className="bg-white rounded-3xl p-6 border-2 border-gray-200 shadow-sm hover:shadow-md transition-all space-y-4">
                  
                  {/* Top Bar */}
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full">
                        {p.season} సీజన్ • {p.area_acres} ఎకరాలు
                      </span>
                      <h3 className="text-2xl font-black text-gray-900 mt-1">
                        {p.crop_name}
                      </h3>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="px-3 py-1 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-black">
                        {p.status}
                      </span>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Harvest Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-gray-700">
                      <span>కోత పురోగతి (Harvest Progress):</span>
                      <span>{harvestProgress}% ({p.current_harvested_quintals} / {p.expected_quantity_quintals} Qtl)</span>
                    </div>
                    <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
                      <div className="bg-emerald-600 h-full transition-all duration-500" style={{ width: `${harvestProgress}%` }}></div>
                    </div>
                  </div>

                  {/* Dates & Surplus Stats */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 text-xs">
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
                      <span>అంచనా కోత: <strong>{p.expected_harvest_date || 'N/A'}</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5 text-amber-900 font-bold bg-amber-50 p-2 rounded-xl border border-amber-200">
                      <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>మార్కెట్ మిగులు: {p.surplus_predicted} Qtl</span>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border-2 border-gray-300 overflow-hidden">
            <div className="p-5 bg-blue-900 text-white flex items-center justify-between">
              <h3 className="text-lg font-black">{t('logNewCropBtn')}</h3>
              <button onClick={() => setShowModal(false)} className="text-blue-200 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">{t('cropNameLabel')}</label>
                <select
                  value={cropName}
                  onChange={(e) => setCropName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 focus:border-blue-600 focus:outline-none text-sm font-bold bg-white"
                >
                  {popularCrops.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">{t('areaAcresLabel')}</label>
                  <input
                    type="number"
                    step="0.5"
                    value={areaAcres}
                    onChange={(e) => setAreaAcres(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">{t('expectedQtlLabel')}</label>
                  <input
                    type="number"
                    value={expectedQtl}
                    onChange={(e) => setExpectedQtl(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">{t('plantingDateLabel')}</label>
                  <input
                    type="date"
                    value={plantingDate}
                    onChange={(e) => setPlantingDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border-2 border-gray-200 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">{t('harvestDateLabel')}</label>
                  <input
                    type="date"
                    value={harvestDate}
                    onChange={(e) => setHarvestDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border-2 border-gray-200 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">{t('statusLabel')}</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-bold bg-white"
                >
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white font-black text-sm shadow-md"
                >
                  {t('saveProductionBtn')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
