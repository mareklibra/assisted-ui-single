import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from '../node_modules/openshift-assisted-ui-lib/dist/locales/en/translation.json';
import jaTranslation from '../node_modules/openshift-assisted-ui-lib/dist/locales/ja/translation.json';
import koTranslation from '../node_modules/openshift-assisted-ui-lib/dist/locales/ko/translation.json';
import zhTranslation from '../node_modules/openshift-assisted-ui-lib/dist/locales/zh/translation.json';

const dateTimeFormatter = new Intl.DateTimeFormat('default', {
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  year: 'numeric',
});

void i18n.use(initReactI18next).init({
  lng: 'en',
  resources: {
    en: {
      translation: enTranslation,
    },
    ja: {
      translation: jaTranslation,
    },
    ko: {
      translation: koTranslation,
    },
    zh: {
      translation: zhTranslation,
    },
  },
  supportedLngs: ['en', 'ja', 'ko', 'zh'],
  fallbackLng: 'en',
  load: 'languageOnly',
  detection: { caches: [] },
  defaultNS: 'translation',
  nsSeparator: '~',
  keySeparator: false,
  debug: false,
  interpolation: {
    format(value, format, lng) {
      if (format === 'number') {
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat#Browser_compatibility
        return new Intl.NumberFormat(lng).format(value as number);
      }
      if (value instanceof Date) {
        return dateTimeFormatter.format(value);
      }
      return value as string;
    },
    escapeValue: false, // not needed for react as it escapes by default
  },
  react: {
    useSuspense: true,
    transSupportBasicHtmlNodes: true, // allow <br/> and simple html elements in translations
  },
  missingKeyHandler(lng, ns, key) {
    console.error(
      `Missing i18n key '${key}' in namespace '${ns}' and language '${lng.toString()}.'`,
    );
  },
});

export default i18n;
