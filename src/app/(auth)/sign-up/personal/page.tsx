'use client';

import { MARKADO_DOMAIN } from '@/app/constants';
import { Root as Button } from '@/components/align-ui/ui/button';
import * as Input from '@/components/align-ui/ui/input';
import { Asterisk, Root as Label } from '@/components/align-ui/ui/label';
import RoundedIconWrapper from '@/components/RoundedIconWrapper';
import { TimezoneSelectWithStyle } from '@/components/TimezoneSelectWithStyle';
import { useSignUp } from '@/contexts/SignUpContext';
import { RiAccountPinBoxFill } from '@remixicon/react';
import { useTranslations } from 'next-intl';
import { FormEvent } from 'react';

const PersonalForm = () => {
  const {form, nextStep} = useSignUp();

  const t = useTranslations('SignUpPage.PersonalForm');

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    nextStep();
  };

  const timeZone = form.watch('timeZone');

  return (
    <form
      action=""
      onSubmit={submit}
      className="flex flex-col gap-6 justify-center items-center max-w-[392px] w-full"
    >
      <div className="flex flex-col items-center">
        <RoundedIconWrapper>
          <RiAccountPinBoxFill size={32} color="var(--text-sub-600)" />
        </RoundedIconWrapper>

        <div className="flex flex-col gap-1 text-center">
          <h2 className="text-title-h5 text-text-strong-950">
            {t('personal_information')}
          </h2>
          <p className="text-paragraph-md text-text-sub-600">
            {t('provide_the_essential_informations')}
          </p>
        </div>
      </div>

      <div className="w-full h-[1px] bg-bg-soft-200" />

      <div className="flex flex-col gap-4 w-full">
        <div className="flex flex-col gap-1">
          <Label>
            {t('full_name')}
            <Asterisk />
          </Label>
          <Input.Root>
            <Input.Input
              type="text"
              placeholder="Marcus Dutra"
              {...form.register('name')}
            />
          </Input.Root>
        </div>
        <div className="flex flex-col gap-1">
          <Label>{t('username')}</Label>
          <Input.Root>
            <Input.Affix>{MARKADO_DOMAIN}/</Input.Affix>
            <Input.Input
              type="text"
              placeholder="marcusdutra"
              {...form.register('username')}
            />
          </Input.Root>
        </div>
        <div className="flex flex-col gap-1">
          <Label>{t('time_zone')}</Label>
          {/* <TimeZoneSelectComponent /> */}
          <TimezoneSelectWithStyle
            value={timeZone}
            onChange={(value) => form.setValue('timeZone', value)}
            placeholder="Choose your timezone"
          />
        </div>
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

export default PersonalForm;