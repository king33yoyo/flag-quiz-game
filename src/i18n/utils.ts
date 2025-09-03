import { translations } from './translations';
import type { Language, TranslationKey } from './translations';

export const createTranslationFunction = (language: Language) => {
  const t = (key: TranslationKey): string => {
    const keys = key.split('.');
    let value: unknown = translations[language];
    
    for (const k of keys) {
      value = (value as Record<string, unknown>)?.[k];
    }
    
    return typeof value === 'string' ? value : key;
  };

  const tWithParams = (key: TranslationKey, params: Record<string, string>): string => {
    let text = t(key);
    
    Object.entries(params).forEach(([param, value]) => {
      text = text.replace(new RegExp(`{${param}}`, 'g'), value);
    });
    
    return text;
  };

  return { t, tWithParams };
};