import i18next from "i18next";
import { i18n as nexti18next } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export const getTranslation = async (locale: string, ns: string) => {
  const create = async () => {
    const { _nextI18Next } = await serverSideTranslations(locale, [ns]);
    const _i18n = i18next.createInstance();
    _i18n.init({
      lng: locale,
      resources: _nextI18Next?.initialI18nStore,
      fallbackLng: _nextI18Next?.userConfig?.i18n.defaultLocale,
    });
    return _i18n;
  };
  const _i18n = nexti18next != null ? nexti18next : await create();
  return _i18n.getFixedT(locale, ns);
};

// // Implementação simples de tradução para o lado do servidor
// export const getTranslation = async (locale: string, ns: string) => {
//   try {
//     // Tenta carregar as mensagens do arquivo JSON
//     const messages = await import(`~/messages/${locale}.json`);
    
//     // Retorna uma função de tradução
//     return (key: string, params?: Record<string, any>) => {
//       const namespace = messages.default[ns];
//       if (!namespace) {
//         console.warn(`Namespace ${ns} not found for locale ${locale}`);
//         return key;
//       }
      
//       let translation = namespace[key] || key;
      
//       // Substitui parâmetros se fornecidos
//       if (params) {
//         Object.entries(params).forEach(([param, value]) => {
//           translation = translation.replace(new RegExp(`{${param}}`, 'g'), String(value));
//         });
//       }
      
//       return translation;
//     };
//   } catch (error) {
//     console.warn(`Failed to load translations for locale: ${locale}, namespace: ${ns}`, error);
    
//     // Fallback: retorna a chave como tradução
//     return (key: string, params?: Record<string, any>) => {
//       if (params) {
//         let result = key;
//         Object.entries(params).forEach(([param, value]) => {
//           result = result.replace(new RegExp(`{${param}}`, 'g'), String(value));
//         });
//         return result;
//       }
//       return key;
//     };
//   }
// };

