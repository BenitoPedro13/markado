'use client';

import { Root as Button } from '@/components/align-ui/ui/button';
import { Input } from '@/components/align-ui/ui/input';
import { Root as Switch } from '@/components/align-ui/ui/switch';
import RoundedIconWrapper from '@/components/RoundedIconWrapper';
import { SignUpAvailabilityFormData, useSignUp } from '@/contexts/SignUpContext';
import { RiAddFill, RiFileCopyFill, RiTimeFill } from '@remixicon/react';
import { useTranslations } from 'next-intl';
import { FormEvent } from 'react';

const Availability = (props: SignUpAvailabilityFormData) => {
  const {schedules} = props;
  const t = useTranslations();

  return (
    <div className="flex flex-col gap-4 w-full">
      {Object.entries(schedules).map(([key, value]) => (
        <div className="flex items-center gap-4">
          <Switch id={key} />
          <div className="grid grid-rows-1 grid-cols-3 items-center">
            <span className="text-label-sm whitespace-nowrap col-span-1">{t(key)}</span>
            <div className="flex items-center gap-4 col-span-2">
              <Input className='border border-bg-soft-200 rounded-10 min-w-[84px]' type="text" placeholder="09:00" min={0} max={24} value={''} />
              <Input className='border border-bg-soft-200 rounded-10 min-w-[84px]' type="text" placeholder="17:00" min={0} max={24} value={''} />
            </div>
          </div>

          <Button className='w-[32px] h-[32px]' variant={'primary'} mode="filled" size="xxsmall">
            <RiAddFill size={16} />
          </Button>
          <Button className='w-[32px] h-[32px]' variant={'primary'} mode="filled" size="xxsmall">
            <RiFileCopyFill size={16} />
          </Button>
        </div>
      ))}
    </div>
  );
};

const AvailabilityPage = () => {
  const {forms, nextStep} = useSignUp();
  const availabilityForm = forms.availability;

  const t = useTranslations('SignUpPage.AvailabilityForm');

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <form
      action=""
      onSubmit={submit}
      className="flex flex-col gap-6 justify-center items-center w-[480px]"
    >
      <div className="flex flex-col items-center">
        <RoundedIconWrapper>
          <RiTimeFill size={32} color="var(--text-sub-600)" />
        </RoundedIconWrapper>

        <div className="flex flex-col gap-1 text-center">
          <h2 className="text-title-h5 text-text-strong-950">
            {t('availability')}
          </h2>
          <p className="text-paragraph-md text-text-sub-600">
            {t('availability_description')}
          </p>
        </div>
      </div>

      <div className="w-full h-[1px] bg-bg-soft-200" />

      <div className="flex flex-col gap-4 w-full">
        {Object.entries(availabilityForm.getValues().schedules).map(
          ([key, value]) => (
            <Availability key={key} schedules={{[key]: value}} />
          )
        )}
      </div>

      <Button
        className="w-full"
        variant={'primary'}
        mode="filled"
        type="submit"
      >
        <span className="text-label-sm">{t('continue')}</span>
      </Button>
    </form>
  );
};

export default AvailabilityPage;
