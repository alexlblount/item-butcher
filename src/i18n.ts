import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enJSON from './locale/en.json';
import esJSON from './locale/es.json';

// https://medium.com/@devpedrodias/how-to-use-i18n-in-your-react-app-1f26deb2a3d8

i18n.use(initReactI18next).init({
  resources: {
    en: { ...enJSON },
    es: { ...esJSON },
  },
  lng: 'en',
  fallbackLng: 'en',
});
