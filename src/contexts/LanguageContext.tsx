import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import {
  SupportedLanguage,
  LanguageInfo,
  SUPPORTED_LANGUAGES,
  TRANSLATIONS,
} from '../i18n/translations';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  dir: 'rtl' | 'ltr';
  isRtl: boolean;
  t: (key: string, fallback?: string) => string;
  currentLanguageInfo: LanguageInfo;
  languages: LanguageInfo[];
  formatCurrency: (amount: number) => string;
}

const LANGUAGE_STORAGE_KEY = 'dzpay_language';

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY) as SupportedLanguage | null;
      if (saved === 'ar' || saved === 'fr' || saved === 'en') {
        return saved;
      }
    }
    return 'ar'; // Default to Arabic
  });

  const currentLanguageInfo = useMemo(() => {
    return (
      SUPPORTED_LANGUAGES.find((lang) => lang.code === language) ||
      SUPPORTED_LANGUAGES[0]
    );
  }, [language]);

  const dir = currentLanguageInfo.dir;
  const isRtl = dir === 'rtl';

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      root.lang = language;
      root.dir = dir;
      root.setAttribute('data-lang', language);
      root.setAttribute('dir', dir);

      // Adjust font class if needed
      if (language === 'ar') {
        root.classList.add('lang-ar');
        root.classList.remove('lang-fr', 'lang-en');
      } else if (language === 'fr') {
        root.classList.add('lang-fr');
        root.classList.remove('lang-ar', 'lang-en');
      } else {
        root.classList.add('lang-en');
        root.classList.remove('lang-ar', 'lang-fr');
      }
    }

    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch {
      // Ignore storage errors if disabled
    }
  }, [language, dir]);

  const setLanguage = (newLang: SupportedLanguage) => {
    setLanguageState(newLang);
  };

  const t = (key: string, fallback?: string): string => {
    const langDict = TRANSLATIONS[language];
    if (langDict && key in langDict) {
      return langDict[key];
    }
    // Fallback to Arabic if missing in current language
    if (TRANSLATIONS.ar && key in TRANSLATIONS.ar) {
      return TRANSLATIONS.ar[key];
    }
    return fallback || key;
  };

  const formatCurrency = (amount: number): string => {
    if (language === 'ar') {
      return `${amount.toLocaleString('ar-DZ')} د.ج`;
    } else if (language === 'fr') {
      return `${amount.toLocaleString('fr-FR')} DZD`;
    }
    return `${amount.toLocaleString('en-US')} DZD`;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        dir,
        isRtl,
        t,
        currentLanguageInfo,
        languages: SUPPORTED_LANGUAGES,
        formatCurrency,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
