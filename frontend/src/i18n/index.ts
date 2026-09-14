import { te } from './te';
import { en } from './en';
import { hi } from './hi';
import { ta } from './ta';
import { kn } from './kn';
import { ml } from './ml';
import { mr } from './mr';
import { LanguageCode } from '../types';

export const languages: Record<LanguageCode, { name: string; nativeName: string; bcp47: string; translations: typeof en }> = {
  te: {
    name: "Telugu",
    nativeName: "తెలుగు",
    bcp47: "te-IN",
    translations: te as unknown as typeof en,
  },
  en: {
    name: "English",
    nativeName: "English",
    bcp47: "en-IN",
    translations: en,
  },
  hi: {
    name: "Hindi",
    nativeName: "हिन्दी",
    bcp47: "hi-IN",
    translations: hi as unknown as typeof en,
  },
  ta: {
    name: "Tamil",
    nativeName: "தமிழ்",
    bcp47: "ta-IN",
    translations: ta as unknown as typeof en,
  },
  kn: {
    name: "Kannada",
    nativeName: "ಕನ್ನಡ",
    bcp47: "kn-IN",
    translations: kn as unknown as typeof en,
  },
  ml: {
    name: "Malayalam",
    nativeName: "മലയാളം",
    bcp47: "ml-IN",
    translations: ml as unknown as typeof en,
  },
  mr: {
    name: "Marathi",
    nativeName: "मराठी",
    bcp47: "mr-IN",
    translations: mr as unknown as typeof en,
  }
};

export const defaultLanguage: LanguageCode = 'te'; // Telugu prioritized for AP SIH presentation
