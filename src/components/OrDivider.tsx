'use client';

import { useTranslations } from "next-intl";

const OrDivider = () => {
  const t = useTranslations("OrDivider");

  return (
    <div className="w-full flex flex-row gap-2.5 items-center">
      <span className="w-full h-[1px] bg-bg-soft-200" />
      <span className="uppercase text-bg-soft-200 text-subheading-2xs">{t("or")}</span>
      <span className="w-full h-[1px] bg-bg-soft-200" />
    </div>
  );
};

export default OrDivider;
