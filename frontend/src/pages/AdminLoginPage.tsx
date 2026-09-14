import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Shield, Lock, User, Zap, ArrowRight, ShieldCheck } from 'lucide-react';

export const AdminLoginPage: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const { loginAdmin, loginDemoAdmin, isLoading } = useAuth();
  const { t } = useLanguage();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    try {
      await loginAdmin(username, password);
      onSuccess();
    } catch (err: any) {
      setErrorMsg(err.message || 'అధికారిక లాగిన్ విఫలమైంది.');
    }
  };

  const handleDemoAdmin = async () => {
    setErrorMsg(null);
    try {
      await loginDemoAdmin();
      onSuccess();
    } catch (err: any) {
      setErrorMsg('డెమో లాగిన్ విఫలమైంది: ' + err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto py-10 px-4">
      <div className="bg-white rounded-3xl shadow-2xl border-2 border-purple-300 overflow-hidden">
        
        {/* Banner */}
        <div className="bg-gradient-to-r from-purple-900 to-indigo-950 text-white p-6 sm:p-8 text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-purple-500 text-white flex items-center justify-center mx-auto shadow-md">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black">
            ప్రభుత్వ వ్యవసాయ పర్యవేక్షణ
          </h2>
          <p className="text-xs text-purple-200">
            వ్యవసాయ శాఖ అధికారులు & విధాన నిర్ణేతల పోర్టల్
          </p>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Quick Demo Pill */}
          <div className="bg-purple-50 p-3.5 rounded-2xl border border-purple-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <span className="text-xs font-black text-purple-900 uppercase flex items-center gap-1">
                <Zap className="w-4 h-4 text-purple-600 fill-purple-500" />
                హ్యాకథాన్ అధికారి డెమో (Quick Demo)
              </span>
              <p className="text-[11px] text-purple-700 mt-0.5">
                Dr. K. Seshadri (Joint Director of Agriculture) లాగిన్
              </p>
            </div>
            <button
              type="button"
              onClick={handleDemoAdmin}
              disabled={isLoading}
              className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-black text-xs shadow-md shrink-0 transition-transform active:scale-95"
            >
              ⚡ డెమో లాగిన్
            </button>
          </div>

          {errorMsg && (
            <div className="p-3.5 bg-red-50 text-red-800 rounded-2xl border border-red-200 text-xs font-bold">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">యూజర్‌నేమ్ (Username)</label>
              <div className="relative">
                <User className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-purple-600 font-bold text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">పాస్‌వర్డ్ (Password)</label>
              <div className="relative">
                <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-purple-600 font-medium text-sm"
                />
              </div>
            </div>

            <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-100 text-xs text-purple-900 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
              <span>
                <strong>గోప్యత నియమం:</strong> ఈ డాష్‌బోర్డ్ కేవలం జిల్లా వారీగా సేకరించిన సమగ్ర గణాంకాలను మాత్రమే చూపుతుంది. రైతుల వ్యక్తిగత వివరాలు ఎప్పుడూ వెల్లడించబడవు.
              </span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-2xl bg-purple-800 hover:bg-purple-900 text-white font-black text-sm shadow-md flex items-center justify-center gap-2 transition-transform active:scale-98"
            >
              <span>ప్రవేశించండి (Officer Login)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

        </div>

      </div>
    </div>
  );
};
