import {createInstance} from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import {initReactI18next} from 'react-i18next/initReactI18next';
import {getOptions} from './settings';

const initI18next = async (lng: string, ns: string) => {
  const i18nInstance = createInstance();
  await i18nInstance
    .use(initReactI18next)
    .use(
      resourcesToBackend((language: string) =>
        import(`~/messages/${language}.json`).then((mod) => mod.default)
      )
    )
    .init(getOptions(lng, ns));
  return i18nInstance;
};

export async function useTranslation(lng: string, ns: string) {
  const i18nextInstance = await initI18next(lng, ns);
  return {
    t: i18nextInstance.getFixedT(lng, ns),
    i18n: i18nextInstance
  };
}

// export const getTranslation = async (locale: string, ns: string) => {
//   const create = async () => {
//     const {_nextI18Next} = await serverSideTranslations(locale, [ns]);
//     const _i18n = i18next.createInstance();
//     _i18n.init({
//       lng: locale,
//       resources: _nextI18Next?.initialI18nStore,
//       fallbackLng: _nextI18Next?.userConfig?.i18n.defaultLocale
//     });
//     return _i18n;
//   };
//   const _i18n = nexti18next != null ? nexti18next : await create();
//   return _i18n.getFixedT(locale, ns);
// };

export const getTranslation = async (lng: string, ns: string) => {
  const {t} = await useTranslation(lng, ns);
  return t;
};