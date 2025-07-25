import { getTranslation } from "@/packages/lib/server/i18n";

export const getFixedT = async (locale: string, ns = "common") => {
  return await getTranslation(locale, ns);
};

export const generateMetadata = async (
  getTitle: (t: any) => string,
  getDescription: (t: any) => string,
  locale: string = "pt" 
) => {
  const t = await getFixedT(locale, "common");

  return {
    title: getTitle(t),
    description: getDescription(t),
  };
};
