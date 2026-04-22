import { createContext, useContext, useState, useCallback } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en'); // 'en', 'hi', or 'gu'

  const toggleLanguage = useCallback(() => {
    setLanguage((prev) => {
      if (prev === 'en') return 'hi';
      if (prev === 'hi') return 'gu';
      return 'en';
    });
  }, []);

  const setLang = useCallback((lang) => {
    setLanguage(lang);
  }, []);

  const t = useCallback(
    (translations) => {
      return translations[language] || translations['en'] || '';
    },
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
