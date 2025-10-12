import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from '../locales/en/common.json';
import ko from '../locales/ko/common.json';
import uz from '../locales/uz/common.json';

export const fallbackLng = 'en';
export const supportedLngs = ['en', 'ko', 'uz'] as const;

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { common: en },
      ko: { common: ko },
      uz: { common: uz },
    },
    ns: ['common'],
    defaultNS: 'common',
    fallbackLng,
    supportedLngs: Array.from(supportedLngs),
    load: 'languageOnly',
    debug: false,
    detection: {
      order: ['localStorage', 'querystring', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'lng',
    },
    interpolation: { escapeValue: false },
  });

export default i18n;
