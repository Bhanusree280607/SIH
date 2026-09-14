import React, { createContext, useContext, useState, useEffect } from 'react';
import { LanguageCode } from '../types';
import { languages, defaultLanguage } from '../i18n';
import { en } from '../i18n/en';

type TranslationKeys = keyof typeof en;

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: TranslationKeys) => string;
  langMeta: typeof languages[LanguageCode];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLangState] = useState<LanguageCode>(() => {
    const saved = localStorage.getItem('rythu_lang') as LanguageCode;
    return saved && languages[saved] ? saved : defaultLanguage;
  });

  const setLanguage = (newLang: LanguageCode) => {
    setLangState(newLang);
    localStorage.setItem('rythu_lang', newLang);
  };

  const currentPack = languages[language] || languages[defaultLanguage];

  const t = (key: TranslationKeys): string => {
    const val = (currentPack.translations as any)[key];
    if (val) return val;
    return (en as any)[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, langMeta: currentPack }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
};
