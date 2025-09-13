import React, { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { I18nContext } from './I18nContext';
import { createTranslationFunction } from './utils';
import type { Language } from './translations';

interface I18nProviderProps {
  children: ReactNode;
}

export const I18nProvider: React.FC<I18nProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language') as Language;
    return saved || 'zh';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const { t, tWithParams } = createTranslationFunction(language);

  return (
    <I18nContext.Provider value={{ language, setLanguage, t, tWithParams }}>
      {children}
    </I18nContext.Provider>
  );
};

