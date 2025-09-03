import { createContext } from 'react';
import type { Language, TranslationKey } from './translations';

export interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
  tWithParams: (key: TranslationKey, params: Record<string, string>) => string;
}

export const I18nContext = createContext<I18nContextType | undefined>(undefined);