import React from 'react';
import { Buyer } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { Store, ShieldCheck, MapPin, Phone, Send, TrendingUp, Package } from 'lucide-react';

interface BuyerCardProps {
  buyer: Buyer;
  onContact: (buyer: Buyer) => void;
}

export const BuyerCard: React.FC<BuyerCardProps> = ({ buyer, onContact }) => {
  const { t } = useLanguage();

  return (
    <div className="bg-white rounded-3xl shadow-md hover:shadow-xl transition-all duration-200 border-2 border-emerald-100 overflow-hidden flex flex-col justify-between">
      
      <div className="p-5 sm:p-6 pb-4">
        {/* Type & Verified Badge */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-900 font-bold text-xs">
            {buyer.buyer_type}
          </span>
          {buyer.verified_badge && (
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              {t('verifiedBadge')}
            </span>
          )}
        </div>

        {/* Buyer Name */}
        <div className="flex items-start gap-2.5 mb-2">
          <Store className="w-5 h-5 text-emerald-700 shrink-0 mt-1" />
          <div>
            <h3 className="text-xl font-black text-gray-900 tracking-tight">
              {buyer.name}
            </h3>
            <p className="text-xs text-gray-500 font-semibold flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-gray-400" />
              {buyer.district}, {buyer.region}
            </p>
          </div>
        </div>

        {/* Crops Required */}
        <div className="my-3 bg-emerald-50/60 p-3 rounded-2xl border border-emerald-100">
          <span className="text-[11px] font-bold text-emerald-800 uppercase block mb-1">
            కొనుగోలు చేస్తున్న పంటలు (Crops Procured):
          </span>
          <div className="flex flex-wrap gap-1.5">
            {buyer.crops_required.split(',').map((crop, idx) => (
              <span key={idx} className="px-2.5 py-0.5 rounded-lg bg-white border border-emerald-200 text-xs font-bold text-emerald-950 shadow-2xs">
                {crop.trim()}
              </span>
            ))}
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-2 my-3">
          <div className="p-2.5 bg-amber-50/70 rounded-xl border border-amber-200">
            <span className="text-[10px] uppercase font-bold text-amber-800 block">
              {t('priceOffered')}
            </span>
            <span className="text-base font-black text-gray-900">
              ₹{buyer.indicative_price_per_quintal.toLocaleString()}/Qtl
            </span>
          </div>

          <div className="p-2.5 bg-purple-50/70 rounded-xl border border-purple-200">
            <span className="text-[10px] uppercase font-bold text-purple-800 block">
              {t('qtyRequired')}
            </span>
            <span className="text-base font-black text-gray-900 flex items-center gap-1">
              <Package className="w-3.5 h-3.5 text-purple-600" />
              {buyer.quantity_required_quintals.toLocaleString()} Qtls
            </span>
          </div>
        </div>

      </div>

      {/* Action Footer */}
      <div className="p-4 sm:p-5 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-3">
        <a
          href={`tel:${buyer.contact_phone}`}
          className="p-2.5 rounded-2xl bg-white hover:bg-emerald-50 text-emerald-800 border border-gray-200 text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
          title="Direct Call"
        >
          <Phone className="w-4 h-4 text-emerald-600" />
          <span className="hidden sm:inline">కాల్ చేయండి</span>
        </a>

        <button
          onClick={() => onContact(buyer)}
          className="flex-1 px-4 py-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs sm:text-sm shadow-md flex items-center justify-center gap-1.5 transition-all transform active:scale-95"
        >
          <Send className="w-3.5 h-3.5" />
          <span>{t('contactBuyerBtn')}</span>
        </button>
      </div>

    </div>
  );
};
