import React, { useState } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { FloatingVoiceButton } from './components/FloatingVoiceButton';
import { VoiceAssistantModal } from './components/VoiceAssistantModal';
import { LandingPage } from './pages/LandingPage';
import { FarmerDashboard } from './pages/FarmerDashboard';
import { CropRecommendationPage } from './pages/CropRecommendationPage';
import { ProductionTrackingPage } from './pages/ProductionTrackingPage';
import { BuyersMarketPage } from './pages/BuyersMarketPage';
import { GovernmentSchemesPage } from './pages/GovernmentSchemesPage';
import { FarmerProfilePage } from './pages/FarmerProfilePage';
import { FarmerAuthPage } from './pages/FarmerAuthPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [voiceOpen, setVoiceOpen] = useState<boolean>(false);
  const [initialVoiceQuery, setInitialVoiceQuery] = useState<string>('');

  const { farmer, admin, role } = useAuth();

  const handleOpenVoice = (specificQuery?: string) => {
    if (specificQuery) {
      setInitialVoiceQuery(specificQuery);
    } else {
      setInitialVoiceQuery('');
    }
    setVoiceOpen(true);
  };

  const renderCurrentPage = () => {
    switch (activeTab) {
      case 'home':
        return <LandingPage onNavigate={(tab) => setActiveTab(tab)} openVoiceAssistant={() => handleOpenVoice()} />;
      
      case 'dashboard':
        if (!farmer && !admin) {
          return <FarmerAuthPage onSuccess={() => setActiveTab('dashboard')} />;
        }
        return (
          <FarmerDashboard
            onNavigate={(tab) => setActiveTab(tab)}
            openVoiceAssistant={() => handleOpenVoice()}
            onAskAiSpecific={(q) => handleOpenVoice(q)}
          />
        );

      case 'crops':
        return <CropRecommendationPage onAskAiSpecific={(q) => handleOpenVoice(q)} />;

      case 'production':
        if (!farmer) {
          return <FarmerAuthPage onSuccess={() => setActiveTab('production')} />;
        }
        return <ProductionTrackingPage />;

      case 'markets':
        return <BuyersMarketPage />;

      case 'schemes':
        return <GovernmentSchemesPage onAskAiSpecific={(q) => handleOpenVoice(q)} />;

      case 'profile':
        if (!farmer) {
          return <FarmerAuthPage onSuccess={() => setActiveTab('profile')} />;
        }
        return <FarmerProfilePage />;

      case 'auth':
        return <FarmerAuthPage onSuccess={() => setActiveTab('dashboard')} />;

      case 'admin':
        if (admin) {
          return <AdminDashboardPage />;
        }
        return <AdminLoginPage onSuccess={() => setActiveTab('admin')} />;

      default:
        return <LandingPage onNavigate={(tab) => setActiveTab(tab)} openVoiceAssistant={() => handleOpenVoice()} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8faf5] flex flex-col justify-between text-gray-900 font-sans selection:bg-emerald-200 selection:text-emerald-900">
      
      <div>
        {/* Navigation Bar */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          openVoiceAssistant={() => handleOpenVoice()}
        />

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-12">
          {renderCurrentPage()}
        </main>
      </div>

      {/* Ubiquitous Floating Voice Assistant Mic Button */}
      <FloatingVoiceButton onClick={() => handleOpenVoice()} />

      {/* Voice Assistant Interactive Modal */}
      <VoiceAssistantModal
        isOpen={voiceOpen}
        onClose={() => setVoiceOpen(false)}
        initialQuestion={initialVoiceQuery}
      />

      {/* Footer */}
      <Footer />

    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </LanguageProvider>
  );
}
