import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { speechService } from '../services/speech';
import { AIAnswerResponse } from '../types';
import { Mic, MicOff, Volume2, VolumeX, Send, X, Sparkles, BookOpen, MessageSquare } from 'lucide-react';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuestion?: string;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  initialQuestion
}) => {
  const { language, langMeta, t } = useLanguage();
  const { farmer } = useAuth();

  const [question, setQuestion] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [response, setResponse] = useState<AIAnswerResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Multi-lingual default suggestion chips for Indian farmers
  const suggestionsMap: Record<string, string[]> = {
    te: [
      'ఈ సీజన్‌లో ఏ పంట వేయాలి?',
      'వేరుశనగ పంట ఎందుకు సిఫార్సు చేయబడింది?',
      'నాకు వర్తించే ప్రభుత్వ పథకాలు ఏమిటి?',
      'వరి ధాన్యాన్ని మంచి ధరకు ఎక్కడ అమ్మాలి?'
    ],
    en: [
      'Which crop should I grow this season?',
      'Why is Groundnut recommended for me?',
      'What government schemes can I apply for?',
      'Where can I sell my Paddy at best price?'
    ],
    hi: [
      'इस मौसम में कौन सी फसल बोनी चाहिए?',
      'मेरे लिए मूंगफली की सिफारिश क्यों की गई?',
      'मैं किन सरकारी योजनाओं का लाभ ले सकता हूँ?',
      'धान की फसल अच्छे भाव में कहाँ बेचें?'
    ],
    ta: [
      'இந்த பருவத்தில் என்ன பயிர் நடவு செய்ய வேண்டும்?',
      'நிலக்கடலை ஏன் எனக்கு பரிந்துரைக்கப்பட்டது?',
      'எனக்கு என்ன அரசு நலத்திட்டங்கள் உள்ளன?',
      'நெற்பயிரை நல்ல விலைக்கு எங்கு விற்பனை செய்வது?'
    ],
    kn: [
      'ಈ ಋತುವಿನಲ್ಲಿ ಯಾವ ಬೆಳೆಯನ್ನು ಬೆಳೆಯಬೇಕು?',
      'ನನಗೆ ಕಡಲೆಕಾಯಿ ಬೆಳೆಯನ್ನು ಏಕೆ ಶಿಫಾರಸು ಮಾಡಲಾಗಿದೆ?',
      'ನನಗೆ ಲಭ್ಯವಿರುವ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು ಯಾವುವು?',
      'ಭತ್ತವನ್ನು ಉತ್ತಮ ಬೆಲೆಗೆ ಎಲ್ಲಿ ಮಾರಾಟ ಮಾಡಬಹುದು?'
    ],
    ml: [
      'ഈ സീസണിൽ ഞാൻ ഏത് വിളയാണ് കൃഷി ചെയ്യേണ്ടത്?',
      'നിലക്കടല എനിക്ക് എന്തിനാണ് നിർദ്ദേശിച്ചത്?',
      'എനിക്ക് ലഭ്യമായ സർക്കാർ പദ്ധതികൾ ഏതെല്ലാമാണ്?',
      'നെല്ല് നല്ല വിലയ്ക്ക് എവിടെ വിൽക്കാൻ സാധിക്കും?'
    ],
    mr: [
      'या हंगामात कोणते पीक घ्यावे?',
      'माझ्यासाठी भुईमूग पिकाची शिफारस का केली गेली?',
      'मला कोणत्या सरकारी योजनांचा लाभ मिळू शकतो?',
      'भात पिकाला चांगला भाव कुठे मिळेल?'
    ]
  };

  const defaultSuggestions = suggestionsMap[language] || suggestionsMap['en'];

  useEffect(() => {
    if (isOpen && initialQuestion) {
      handleAsk(initialQuestion);
    }
  }, [isOpen, initialQuestion]);

  useEffect(() => {
    if (!isOpen) {
      speechService.stopListening();
      speechService.stopSpeaking();
      setIsListening(false);
      setIsSpeaking(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const startVoiceInput = () => {
    setErrorMsg(null);
    speechService.stopSpeaking();
    setIsSpeaking(false);

    speechService.startListening(langMeta.bcp47, {
      onStart: () => {
        setIsListening(true);
      },
      onResult: (transcript, isFinal) => {
        setQuestion(transcript);
        if (isFinal && transcript.trim().length > 2) {
          setIsListening(false);
          handleAsk(transcript);
        }
      },
      onError: (err) => {
        setIsListening(false);
        setErrorMsg('వాయిస్ ఇన్‌పుట్ అందుబాటులో లేదు (Voice recognition note: ' + err + '). మీరు కింద టైప్ చేయవచ్చు.');
      },
      onEnd: () => {
        setIsListening(false);
      }
    });
  };

  const stopVoiceInput = () => {
    speechService.stopListening();
    setIsListening(false);
    if (question.trim().length > 2) {
      handleAsk(question);
    }
  };

  const handleAsk = async (queryToAsk?: string) => {
    const q = (queryToAsk || question).trim();
    if (!q) return;

    speechService.stopListening();
    setIsListening(false);
    setIsProcessing(true);
    setErrorMsg(null);

    const context = farmer ? {
      district: farmer.district,
      state: farmer.state,
      soil_type: farmer.soil_type,
      water_availability: farmer.water_availability,
      name: farmer.name
    } : {
      district: 'Guntur',
      state: 'Andhra Pradesh',
      soil_type: 'Black Soil',
      water_availability: 'Canal & Borewell'
    };

    try {
      const res = await api.askAI(q, language, context);
      setResponse(res);
      setQuestion('');

      // Auto-read aloud in regional language for low-literacy farmers
      playSpeech(res.voice_friendly_text);
    } catch (err: any) {
      setErrorMsg('సమాచారం అందించడంలో అంతరాయం కలిగింది. దయచేసి మళ్లీ ప్రయత్నించండి.');
    } finally {
      setIsProcessing(false);
    }
  };

  const playSpeech = (text: string) => {
    setIsSpeaking(true);
    speechService.speakText(text, langMeta.bcp47, () => {
      setIsSpeaking(false);
    });
  };

  const stopSpeech = () => {
    speechService.stopSpeaking();
    setIsSpeaking(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border-4 border-emerald-600 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-emerald-800 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-emerald-950 flex items-center justify-center font-black">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black">{t('aiModalTitle')}</h3>
              <p className="text-xs text-emerald-200">{langMeta.nativeName} ({langMeta.name}) Voice Enabled</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-emerald-200 hover:text-white hover:bg-emerald-700 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          
          {/* Big Voice Action Center */}
          <div className="text-center py-3 bg-emerald-50 rounded-2xl border-2 border-dashed border-emerald-300">
            <div className="flex justify-center mb-3">
              <button
                onClick={isListening ? stopVoiceInput : startVoiceInput}
                className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl ${
                  isListening
                    ? 'bg-red-600 text-white animate-pulse scale-110'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white hover:scale-105 active:scale-95'
                }`}
                title={isListening ? "స్టాప్ చేయండి" : "మాట్లాడటానికి నొక్కండి"}
              >
                {isListening ? (
                  <MicOff className="w-10 h-10 sm:w-12 sm:h-12" />
                ) : (
                  <Mic className="w-10 h-10 sm:w-12 sm:h-12" />
                )}
              </button>
            </div>

            <p className="text-base sm:text-lg font-bold text-emerald-950">
              {isListening ? (
                <span className="text-red-600 animate-pulse">🎙 {t('aiListening')}</span>
              ) : isProcessing ? (
                <span className="text-amber-700 animate-pulse">⚙️ {t('aiProcessing')}</span>
              ) : (
                <span>{t('aiSpeakPrompt')}</span>
              )}
            </p>
            {isListening && (
              <p className="text-xs text-emerald-600 mt-1 font-semibold">
                మీరు మాట్లాడినది రికార్డ్ అవుతోంది... ముగిసిన తర్వాత ఆటోమేటిక్‌గా సమాధానం వస్తుంది
              </p>
            )}
          </div>

          {/* Realtime Spoken Question Preview */}
          {question && (
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-300 text-amber-900 text-sm flex items-start gap-2">
              <MessageSquare className="w-4 h-4 mt-0.5 shrink-0 text-amber-600" />
              <div>
                <span className="font-bold text-xs uppercase text-amber-700">మీ ప్రశ్న: </span>
                <span className="font-medium text-base">{question}</span>
              </div>
            </div>
          )}

          {/* AI Response Display */}
          {response && (
            <div className="p-4 sm:p-5 bg-white rounded-2xl border-2 border-emerald-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-emerald-100">
                <span className="font-black text-emerald-900 text-sm flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  AI సమాధానం (Explanation)
                </span>
                
                {/* Text-to-speech audio control */}
                {isSpeaking ? (
                  <button
                    onClick={stopSpeech}
                    className="flex items-center gap-1 px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-full text-xs font-bold transition-colors"
                  >
                    <VolumeX className="w-3.5 h-3.5" />
                    ఆపండి (Stop)
                  </button>
                ) : (
                  <button
                    onClick={() => playSpeech(response.voice_friendly_text)}
                    className="flex items-center gap-1 px-3 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-full text-xs font-bold transition-colors"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    {t('listenAnswerBtn')}
                  </button>
                )}
              </div>

              <div className="text-gray-800 text-sm sm:text-base leading-relaxed whitespace-pre-line font-medium">
                {response.answer}
              </div>

              {response.grounded_source && (
                <div className="pt-2 text-xs text-gray-500 flex items-center gap-1 border-t border-gray-100">
                  <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                  <span><strong>{t('verifiedSource')}:</strong> {response.grounded_source}</span>
                </div>
              )}
            </div>
          )}

          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-700 rounded-xl border border-red-200 text-xs sm:text-sm">
              {errorMsg}
            </div>
          )}

          {/* Suggested Prompts */}
          <div>
            <p className="text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">
              {t('suggestedQuestions')}
            </p>
            <div className="flex flex-wrap gap-2">
              {(response?.suggestions?.length ? response.suggestions : defaultSuggestions).map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAsk(chip)}
                  className="text-left px-3 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-xs sm:text-sm font-semibold transition-colors"
                >
                  💡 {chip}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Fallback Typing Footer */}
        <div className="p-3 sm:p-4 bg-gray-50 border-t border-gray-200 flex items-center gap-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
            placeholder={t('typeQuestionPlaceholder')}
            className="flex-1 px-4 py-2.5 rounded-xl border-2 border-gray-300 focus:border-emerald-600 focus:outline-none text-sm text-gray-900"
          />
          <button
            onClick={() => handleAsk()}
            disabled={!question.trim() || isProcessing}
            className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-sm flex items-center gap-1 transition-all"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">{t('sendQuestionBtn')}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
