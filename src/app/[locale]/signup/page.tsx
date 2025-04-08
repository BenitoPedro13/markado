'use client';

import Logo from '@/../public/images/logoMarkado.svg';
import {
  Root as Button,
  Icon as ButtonIcon
} from '@/components/align-ui/ui/button';
import { RiCloseLine, RiHeadphoneLine } from '@remixicon/react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';

const SignUpHeader = () => {
  const t = useTranslations("SignUpHeader");

  return (
    <header className="py-6 px-11 gap-6 border-b border-b-bg-soft-200 border-b-soft flex justify-between items-center">
      <Link href={'/'}>
        <Image src={Logo} width={141} height={40} alt={t("markado")} />
      </Link>

      <div className="flex items-center gap-3">
        <p className="text-paragraph-sm">{t("need_help")}</p>
        <Button variant="primary">
          <ButtonIcon>
            <RiHeadphoneLine size={20} />
          </ButtonIcon>
          <span className='text-label-sm'>{t("speak_with_us")}</span>
        </Button>

        <button>
          <ButtonIcon>
            <RiCloseLine size={20} />
          </ButtonIcon>
        </button>
      </div>
    </header>
  );
};

const SignUpForm = () => {
  return <></>;
};

const SignUpPage = () => {
  return (
    <div className="">
      <SignUpHeader />

      <main className="">
        <SignUpForm />
      </main>
    </div>
  );
};

export default SignUpPage;
