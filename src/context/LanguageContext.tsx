import React, { createContext, useContext, useEffect, useState } from 'react';
import { Language, TRANSLATIONS, Translations } from '../data/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('axiom_language') as Language;
    if (saved === 'en' || saved === 'ru' || saved === 'hy') return saved;
    return 'en';
  });

  useEffect(() => {
    localStorage.setItem('axiom_language', language);
    document.documentElement.lang = language;
    document.title = `${TRANSLATIONS[language].appName} — Interactive Mathematics`;
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = TRANSLATIONS[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
