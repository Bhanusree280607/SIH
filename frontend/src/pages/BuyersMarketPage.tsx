import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import { Buyer } from '../types';
import { BuyerCard } from '../components/BuyerCard';
import { Store, Filter, Search, Phone, Send, CheckCircle2, X } from 'lucide-react';

export const BuyersMarketPage: React.FC = () => {
  const { farmer } = useAuth();
  const { t } = useLanguage();

  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [selectedCrop, setSelectedCrop] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Contact Modal State
  const [contactingBuyer, setContactingBuyer] = useState<Buyer | null>(null);
  const [farmerName, setFarmerName] = useState(farmer?.name || '');
  const [farmerMobile, setFarmerMobile] = useState(farmer?.mobile || '');
  const [offerCrop, setOfferCrop] = useState('Groundnut');
  const [offerQty, setOfferQty] = useState(15.0);
  const [offerMsg, setOfferMsg] = useState('');
  const [contactSuccess, setContactSuccess] = useState<string | null>(null);

  const cropFilterOptions = ['All Crops', 'Groundnut', 'Paddy', 'Chilli', 'Cotton', 'Red Gram', 'Maize'];
  const buyerTypes = ['All Types', 'Food Processor', 'Oil Mill', 'Dal Mill', 'Rice Mill', 'APMC Mandi', 'Exporter'];

  useEffect(() => {
    loadBuyers();
  }, [selectedCrop, selectedRegion, selectedType]);

  const loadBuyers = async () => {
    setIsLoading(true);
    try {
      const data = await api.getBuyers({
        crop: selectedCrop === 'All Crops' ? undefined : selectedCrop,
        region: selectedRegion || undefined,
        buyer_type: selectedType === 'All Types' ? undefined : selectedType
      });
      setBuyers(data);
    } catch (e) {
      // fallback
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactingBuyer) return;

    try {
      const res = await api.contactBuyer({
        buyer_id: contactingBuyer.id,
        farmer_name: farmerName,
        farmer_mobile: farmerMobile,
        crop_name: offerCrop,
        quantity_offered_quintals: Number(offerQty),
        message: offerMsg
      });
      setContactSuccess(res.message);
      setTimeout(() => {
        setContactSuccess(null);
        setContactingBuyer(null);
      }, 3000);
    } catch (e) {
      alert('సందేశం పంపడంలో సమస్య ఏర్పడింది.');
    }
  };

  return (
    <div className="space-y-8 py-4">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-700 via-amber-800 to-yellow-950 text-white p-6 sm:p-8 rounded-3xl shadow-lg border-2 border-amber-600">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-emerald-950 font-black text-xs uppercase tracking-wider">
            <Store className="w-4 h-4" />
            మధ్యవర్తులు లేని మార్కెట్ వేదిక
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            {t('marketHeader')}
          </h1>
          <p className="text-xs sm:text-sm text-amber-100">
            {t('marketSub')}
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-md border-2 border-amber-100 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-black text-gray-900 flex items-center gap-2">
            <Filter className="w-5 h-5 text-amber-600" />
            కొనుగోలుదారులను ఫిల్టర్ చేయండి
          </h3>
          <span className="text-xs font-bold text-gray-500">
            {buyers.length} అవకాశాలు అందుబాటులో ఉన్నాయి
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase mb-1">{t('filterByCrop')}</label>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 focus:border-amber-600 text-sm font-bold bg-white"
            >
              {cropFilterOptions.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase mb-1">{t('filterByType')}</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 focus:border-amber-600 text-sm font-bold bg-white"
            >
              {buyerTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase mb-1">{t('filterByDistrict')}</label>
            <input
              type="text"
              placeholder="ఉదా. Guntur లేదా Anantapur"
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 focus:border-amber-600 text-sm font-bold"
            />
          </div>
        </div>
      </div>

      {/* Buyer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {buyers.map((buyer) => (
          <BuyerCard
            key={buyer.id}
            buyer={buyer}
            onContact={(b) => setContactingBuyer(b)}
          />
        ))}
      </div>

      {/* Contact Buyer Dialog Modal */}
      {contactingBuyer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border-2 border-amber-300 overflow-hidden">
            
            <div className="p-5 bg-amber-800 text-white flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black">{contactingBuyer.name}</h3>
                <p className="text-xs text-amber-200">{contactingBuyer.district} • సూచిక ధర: ₹{contactingBuyer.indicative_price_per_quintal}/Qtl</p>
              </div>
              <button onClick={() => setContactingBuyer(null)} className="text-amber-200 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            {contactSuccess ? (
              <div className="p-8 text-center space-y-3">
                <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto animate-bounce" />
                <h4 className="text-xl font-black text-gray-900">సందేశం పంపబడింది!</h4>
                <p className="text-xs text-gray-600">{contactSuccess}</p>
                <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold">
                  కొనుగోలుదారు ఫోన్ నంబర్: {contactingBuyer.contact_phone}
                </div>
              </div>
            ) : (
              <form onSubmit={handleSendOffer} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">మీ పేరు</label>
                  <input
                    type="text"
                    required
                    value={farmerName}
                    onChange={(e) => setFarmerName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">మీ మొబైల్ నంబర్</label>
                  <input
                    type="tel"
                    required
                    value={farmerMobile}
                    onChange={(e) => setFarmerMobile(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-bold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">పంట పేరు</label>
                    <input
                      type="text"
                      required
                      value={offerCrop}
                      onChange={(e) => setOfferCrop(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border-2 border-gray-200 text-sm font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">పరిమాణం (క్వింటాళ్ళు)</label>
                    <input
                      type="number"
                      required
                      value={offerQty}
                      onChange={(e) => setOfferQty(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border-2 border-gray-200 text-sm font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">అదనపు వివరాలు (ఐచ్ఛికం)</label>
                  <textarea
                    rows={2}
                    value={offerMsg}
                    onChange={(e) => setOfferMsg(e.target.value)}
                    placeholder="ఉదాహరణ: నాణ్యమైన క్వాలిటీ, తక్షణ లోడింగ్ సిద్ధంగా ఉంది..."
                    className="w-full px-3 py-2 rounded-xl border-2 border-gray-200 text-xs text-gray-800"
                  ></textarea>
                </div>

                <div className="pt-2 flex items-center justify-between gap-3">
                  <a
                    href={`tel:${contactingBuyer.contact_phone}`}
                    className="px-4 py-3 rounded-2xl bg-white border border-gray-300 text-gray-800 text-xs font-bold flex items-center gap-1.5"
                  >
                    <Phone className="w-4 h-4 text-emerald-600" />
                    <span>నేరుగా కాల్ చేయండి</span>
                  </a>

                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-emerald-950 font-black text-xs sm:text-sm shadow-md flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-4 h-4" />
                    <span>ప్రపోజల్ పంపండి</span>
                  </button>
                </div>

              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
