'use client';

import Logo from '@/../public/images/logoMarkado.svg';
import VerticalStripesPattern from '@/../public/patterns/vertical_stripes.svg';
import {
  Root as Button,
  Icon as ButtonIcon
} from '@/components/align-ui/ui/button';
import LocaleSwitcher from '@/components/LocaleSwitcher';
import { RiHeadphoneLine } from '@remixicon/react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { PropsWithChildren } from 'react';

const Header = () => {
  const t = useTranslations('SignInHeader');

  return (
    <header className="w-full py-6 px-11 gap-6 border-b border-b-bg-soft-200 border-b-soft flex justify-between items-center">
      <Link href={'/'}>
        <Image src={Logo} width={141} height={40} alt={t('markado')} />
      </Link>

      <div className="flex items-center gap-3">
        <p className="text-paragraph-sm text-sub-600">{t('need_help')}</p>
        <Button variant="neutral" mode="stroke">
          <ButtonIcon>
            <RiHeadphoneLine size={20} color="var(--text-sub-600)" />
          </ButtonIcon>
          <span className="text-label-sm text-sub-600">
            {t('speak_with_us')}
          </span>
        </Button>
      </div>
    </header>
  );
};

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const t = useTranslations('SignInPage');

  return (
    <div className="relative w-full">
      <div className="absolute -bottom-6 -z-10 flex justify-center items-center min-w-full">
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

export default function AuthLayout({children}: PropsWithChildren) {
  return (
    <>
      <Header />

      <div className="w-full h-full px-11 py-6 flex flex-col justify-between">
        <div className="flex justify-center relative">{children}</div>

        <Footer />
      </div>
    </>
  );
}
