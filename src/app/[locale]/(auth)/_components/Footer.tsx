'use client';

import VerticalStripesPattern from '@/../public/patterns/vertical_stripes.svg';
import LocaleSwitcher from '@/components/LocaleSwitcher';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const t = useTranslations('SignInPage');

  return (
    <div className="relative w-full">
      <div className="absolute bottom-0 -z-10 flex justify-center items-center min-w-full">
        <Image
          
          draggable={false}
          alt=""
          src={VerticalStripesPattern}
          width={964}
        />
      </div>

      <footer className="self-end w-full flex justify-between items-center">
        <p className="text-paragraph-sm text-text-sub-600">
          &copy;{`${currentYear} ${t('markado')}`}
        </p>
        <LocaleSwitcher />
      </footer>
    </div>
  );
};

export default Footer;
