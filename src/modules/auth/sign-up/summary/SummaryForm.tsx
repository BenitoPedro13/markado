'use client';

import { Root as Button } from '@/components/align-ui/ui/button';
import RoundedIconWrapper from '@/components/RoundedIconWrapper';
import { useSignUp } from '@/contexts/SignUpContext';
import { RiCheckFill, RiCheckboxCircleFill, RiPencilFill } from '@remixicon/react';
import { useTranslations } from 'next-intl';
import { FormEvent } from 'react';
import { Calendar } from '~/prisma/app/generated/prisma/client';
import { getMeByUserId } from '~/trpc/server/handlers/user.handler';

type SummaryItemProps = {
  label: string;
  value: string;
  onEdit: () => void;
};

const SummaryItem = ({ label, value, onEdit }: SummaryItemProps) => {
  return (
    <div className="flex items-center justify-between p-4 border rounded-md border-bg-soft-200">
      <div className="flex flex-col">
        <span className="text-xs text-text-sub-600 uppercase">{label}</span>
        <span className="text-sm font-medium text-text-strong-950">{value}</span>
      </div>
      <Button 
        className='w-[32px] h-[32px]' 
        variant={'primary'} 
        mode="filled" 
        size="xxsmall"
        onClick={onEdit}
      >
        <RiPencilFill size={16} />
      </Button>
    </div>
  );
};

interface SummaryFormProps {
  user: Awaited<ReturnType<typeof getMeByUserId>>;
  calendars: Calendar[];
}

const SummaryForm = ({user, calendars }: SummaryFormProps) => {
  const { forms, nextStep, goToStep } = useSignUp();
  const emailForm = forms.email;
  const personalForm = forms.personal;
  const availabilityForm = forms.availability;

  const t = useTranslations('SignUpPage.SummaryForm');

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    nextStep();
  };

  const schedules = availabilityForm.getValues().schedules;
  const enabledDays = Object.entries(schedules)
    .filter(([_, value]) => value.enabled)
    .map(([key]) => t(key))
    .join(', ');

  const availabilityText = enabledDays || t('no_availability_set');

  return (
    <form
      action=""
      onSubmit={submit}
      className="flex flex-col gap-6 justify-center items-center w-[480px]"
    >
      <div className="flex flex-col items-center">
        <RoundedIconWrapper>
          <RiCheckboxCircleFill size={32} color="var(--text-sub-600)" />
        </RoundedIconWrapper>

        <div className="flex flex-col gap-1 text-center">
          <h2 className="text-title-h5 text-text-strong-950">
            {t('summary')}
          </h2>
          <p className="text-paragraph-md text-text-sub-600">
            {t('summary_description')}
          </p>
        </div>
      </div>

      <div className="w-full h-[1px] bg-bg-soft-200" />

      <div className="flex flex-col gap-4 w-full">
        <SummaryItem 
          label={t('name_complete')}
          value={personalForm.getValues().name || t('not_provided')}
          onEdit={() => goToStep('/sign-up/personal')}
        />
        
        <SummaryItem 
          label={t('company_name')}
          value={t('company_placeholder')}
          onEdit={() => goToStep('/sign-up/personal')}
        />

        <SummaryItem 
          label={t('availability')}
          value={availabilityText}
          onEdit={() => goToStep('/sign-up/availability')}
        />

        <SummaryItem 
          label={t('address')}
          value={t('address_placeholder')}
          onEdit={() => goToStep('/sign-up/personal')}
        />
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

export default SummaryForm; 