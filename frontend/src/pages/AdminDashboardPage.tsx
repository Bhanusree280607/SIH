import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import { AdminAnalyticsResponse } from '../types';
import {
  Shield,
  Users,
  TrendingUp,
  Package,
  Store,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  BarChart3,
  PieChart as PieIcon,
  ShieldCheck,
  RefreshCw,
  LogOut
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export const AdminDashboardPage: React.FC = () => {
  const { admin, logout } = useAuth();
  const { t } = useLanguage();

  const [data, setData] = useState<AdminAnalyticsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setIsLoading(true);
    try {
      const res = await api.getAdminAnalytics();
      setData(res);
    } catch (e) {
      console.warn('Analytics fallback', e);
    } finally {
      setIsLoading(false);
    }
  };

  const COLORS = ['#15803d', '#d97706', '#2563eb', '#dc2626', '#9333ea', '#0891b2'];

  const chartData = data?.top_produced_crops?.map((c) => ({
    name: c.crop_name,
    production: Math.round(c.total_production_quintals / 1000), // in thousand quintals
    share: c.percentage_share
  })) || [];

  return (
    <div className="space-y-8 py-4">
      
      {/* Officer Header Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-purple-900 to-indigo-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl border-2 border-purple-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-400/20 text-purple-200 font-black text-xs uppercase tracking-wider border border-purple-400/30">
            <Shield className="w-4 h-4 text-purple-300" />
            ప్రభుత్వ వ్యవసాయ పర్యవేక్షణ వేదిక
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            {admin?.full_name || 'Dr. K. Seshadri, Joint Director of Agriculture'}
          </h1>
          <p className="text-xs sm:text-sm text-purple-200">
            {admin?.department || 'Department of Agriculture, Government of Andhra Pradesh'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadAnalytics}
            className="p-3 rounded-2xl bg-purple-900 hover:bg-purple-800 text-purple-200 border border-purple-700 transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={logout}
            className="px-4 py-2.5 rounded-2xl bg-red-600/80 hover:bg-red-600 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>లాగౌట్</span>
          </button>
        </div>
      </div>

      {/* Strict Privacy & Aggregation Guarantee Banner */}
      <div className="bg-emerald-950 text-emerald-100 p-4 rounded-2xl border border-emerald-700 flex items-center gap-3 text-xs sm:text-sm shadow-sm">
        <ShieldCheck className="w-6 h-6 text-amber-400 shrink-0" />
        <div>
          <strong className="text-white">రైతుల గోప్యత రక్షణ (Zero PII Exposure):</strong> ఈ డాష్‌బోర్డ్ కేవలం మండలం మరియు జిల్లా వారీగా సమగ్ర గణాంకాలను మాత్రమే ప్రతిబింబిస్తుంది. రైతుల వ్యక్తిగత పేర్లు, ఫోన్ నంబర్లు లేదా పొలం సరిహద్దులను అధికారులకు కూడా వెల్లడించదు.
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border-2 border-purple-100 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 mb-1">
            <span className="text-xs font-bold uppercase">{t('totalFarmers')}</span>
            <Users className="w-4 h-4 text-purple-600" />
          </div>
          <span className="text-3xl font-black text-gray-900">
            {data?.total_registered_farmers?.toLocaleString() || '1,420+'}
          </span>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">ఆంధ్రప్రదేశ్ జిల్లాల వ్యాప్తంగా</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border-2 border-emerald-100 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 mb-1">
            <span className="text-xs font-bold uppercase">{t('totalProduction')}</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-3xl font-black text-gray-900">
            {Math.round((data?.total_expected_production_quintals || 3820000) / 1000).toLocaleString()}K
          </span>
          <p className="text-[11px] text-gray-500 font-semibold mt-1">క్వింటాళ్ళు (ఖరీఫ్ సీజన్)</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border-2 border-amber-100 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 mb-1">
            <span className="text-xs font-bold uppercase">సాగులో ఉన్న పంటలు</span>
            <Package className="w-4 h-4 text-amber-600" />
          </div>
          <span className="text-3xl font-black text-gray-900">
            {data?.total_active_crops_cultivated || 8}
          </span>
          <p className="text-[11px] text-amber-700 font-semibold mt-1">ప్రధాన ఆహార & వాణిజ్య పంటలు</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border-2 border-blue-100 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 mb-1">
            <span className="text-xs font-bold uppercase">{t('activeBuyers')}</span>
            <Store className="w-4 h-4 text-blue-600" />
          </div>
          <span className="text-3xl font-black text-gray-900">
            {data?.total_verified_buyers || 6}
          </span>
          <p className="text-[11px] text-blue-700 font-semibold mt-1">ధృవీకరించిన ప్రాసెసర్లు & ఈ-నామ్</p>
        </div>
      </div>

      {/* Production Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Bar Chart: Production by Crop */}
        <div className="bg-white p-6 rounded-3xl border-2 border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-purple-700" />
              {t('chartProductionByCrop')} (వేల క్వింటాళ్ళలో)
            </h3>
            <span className="text-xs font-bold text-gray-500">Kharif 2026</span>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" angle={-25} textAnchor="end" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(val: any) => [`${val}K Quintals`, 'ఉత్పత్తి']}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
                <Bar dataKey="production" fill="#15803d" radius={[8, 8, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart: Crop Production Share */}
        <div className="bg-white p-6 rounded-3xl border-2 border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
              <PieIcon className="w-5 h-5 text-emerald-700" />
              పంటల ఉత్పత్తి శాతం (Market Share %)
            </h3>
            <span className="text-xs font-bold text-gray-500">రాష్ట్ర సగటు</span>
          </div>

          <div className="h-64 sm:h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={3}
                  label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [`${val}%`, 'వాటా']}
                  contentStyle={{ borderRadius: '12px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Surplus vs Shortage Regional Matrix (Section 15 Specification) */}
      <div className="bg-white rounded-3xl p-6 border-2 border-gray-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-gray-900">
              జిల్లా వారీగా మిగులు మరియు కొరత బ్యాలెన్స్ (Surplus vs Deficit Matrix)
            </h3>
            <p className="text-xs text-gray-500">
              మార్కెట్ ధరలు స్థిరీకరించడానికి మరియు కొనుగోలు కేంద్రాలను కేటాయించడానికి అవసరమైన సమాచారం
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {data?.surplus_shortage_records?.map((rec, idx) => {
            const isSurplus = rec.status === 'Surplus';
            const isShortage = rec.status === 'Shortage';

            return (
              <div
                key={idx}
                className={`p-4 rounded-2xl border-2 flex items-start justify-between gap-3 ${
                  isSurplus
                    ? 'bg-emerald-50/70 border-emerald-200'
                    : isShortage
                    ? 'bg-amber-50/70 border-amber-200'
                    : 'bg-blue-50/70 border-blue-200'
                }`}
              >
                <div>
                  <span className="text-[11px] font-bold text-gray-500 uppercase block">
                    {rec.district} జిల్లా
                  </span>
                  <h4 className="text-lg font-black text-gray-900 mt-0.5">
                    {rec.crop}
                  </h4>
                  <p className="text-xs font-semibold text-gray-600 mt-1">
                    {isSurplus ? 'మార్కెట్ మిగులు ఉంది' : isShortage ? 'స్థానిక కొరత డిమాండ్' : 'సమతుల్య సరఫరా'}
                  </p>
                </div>

                <div className="text-right">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-black ${
                    isSurplus
                      ? 'bg-emerald-600 text-white'
                      : isShortage
                      ? 'bg-amber-600 text-white'
                      : 'bg-blue-600 text-white'
                  }`}>
                    {rec.status}
                  </span>
                  <span className="block text-xs font-bold text-gray-700 mt-2">
                    {Math.abs(Math.round(rec.net_quintals / 1000))}K Qtl
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Strategic AI Agricultural Planning Insights (Section 15 Specification) */}
      <div className="bg-gradient-to-br from-indigo-900 to-purple-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-indigo-700 space-y-6">
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-amber-300" />
          <div>
            <h3 className="text-xl font-black text-white">{t('policyAdvisories')}</h3>
            <p className="text-xs text-indigo-200">
              రీజినల్ అగ్రికల్చరల్ ప్లానింగ్ & ప్రొక్యూర్మెంట్ అడ్వైజరీ నోట్స్
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data?.policy_planning_insights?.map((item, idx) => (
            <div key={idx} className="bg-indigo-950/60 p-4 sm:p-5 rounded-2xl border border-indigo-700/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-400 text-emerald-950">
                  {item.category}
                </span>
                <span className="text-xs text-indigo-300 font-semibold">పాలసీ నోట్ #{idx + 1}</span>
              </div>
              <h4 className="text-base font-bold text-white">
                {item.title}
              </h4>
              <p className="text-xs sm:text-sm text-indigo-100 leading-relaxed font-medium">
                {item.message}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
