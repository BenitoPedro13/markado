'use client';

import * as Button from '@/components/align-ui/ui/button';
import {Root as Divider} from '@/components/align-ui/ui/divider';
import RoundedIconWrapper from '@/components/RoundedIconWrapper';
import {SignUpStep, useSignUp} from '@/contexts/SignUpContext';
import {
  RiAccountPinBoxLine,
  RiCalendarLine,
  RiCheckFill,
  RiCheckboxCircleFill,
  RiMailLine,
  RiPencilFill,
  RiPencilLine,
  RiUserLine
} from '@remixicon/react';
import {useTranslations} from 'next-intl';
import {FormEvent, Fragment} from 'react';
import {Calendar} from '~/prisma/app/generated/prisma/client';
import {getMeByUserId} from '~/trpc/server/handlers/user.handler';
import {setEditMode, clearNextStep} from '@/utils/cookie-utils';

interface SummaryFormProps {
  user: Awaited<ReturnType<typeof getMeByUserId>>;
  calendars: Calendar[];
}

interface SummaryItemValueProps {
  user: Awaited<ReturnType<typeof getMeByUserId>>;
  calendars: Calendar[];
}

type SummaryItem = {
  label: string;
  value: (value: SummaryItemValueProps) => string;
  onEdit: () => void;
  icon?: React.ReactNode;
};

const SummaryIconWrapper = ({icon}: {icon: React.ReactNode}) => {
  return (
    <div className="flex p-[10px] bg-faded-lighter rounded-full items-center justify-center text-text-sub-600">
      {icon}
    </div>
  );
};

type SummaryItemProps = {
  label: string;
  value: string;
  onEdit: () => void;
  icon: React.ReactNode;
};

const SummaryItem = ({label, value, onEdit, icon}: SummaryItemProps) => {
  return (
    <div className="flex items-center gap-3 self-stretch">
      {/* Icon */}
      <SummaryIconWrapper icon={icon} />

      {/* Text */}
      <div className="flex flex-col items-start gap-1 flex-grow">
        <span className="uppercase text-subheading-xs text-text-sub-600">
          {label}
        </span>
        <p className="text-label-sm text-text-strong-950">{value}</p>
      </div>

      {/* Edit Button */}
      <Button.Root
        variant="neutral"
        mode="ghost"
        size="xsmall"
        onClick={onEdit}
        className="flex items-center justify-center p-1.5 rounded-md text-text-sub-600"
      >
        <RiPencilLine size={20} />
      </Button.Root>
      {/* <Button.Icon variant="neutral" mode="ghost" size="xsmall" onClick={onEdit} className='flex items-center justify-center p-1.5 rounded-md text-text-sub-600'> */}
      {/* </Button.Icon> */}
    </div>
  );
};

const SummaryForm = ({user, calendars}: SummaryFormProps) => {
  const {forms, nextStep, goToStep} = useSignUp();
  const emailForm = forms.email;
  const personalForm = forms.personal;
  const availabilityForm = forms.availability;

  const t = useTranslations('SignUpPage.SummaryForm');

  // Function to handle edit button clicks
  const handleEdit = (targetStep: SignUpStep) => {
    // Set the edit_mode cookie to allow navigation to previous steps
    setEditMode();
    
    // Clear the next_step cookie to prevent navigation override
    clearNextStep();

    // Navigate to the target step
    goToStep(targetStep);
  };

  const summaryItems: SummaryItem[] = [
    {
      label: 'name_complete',
      value: ({user}) => user?.name || t('name_complete_placeholder'),
      onEdit: () => handleEdit('/sign-up/personal'),
      icon: <RiAccountPinBoxLine size={20} />
    },
    {
      label: 'email',
      value: ({user}) => user?.email || t('email_placeholder'),
      onEdit: () => handleEdit('/sign-up/personal'),
      icon: <RiMailLine size={20} />
    },
    {
      label: 'username',
      value: ({user}) => user?.username || t('username_placeholder'),
      onEdit: () => handleEdit('/sign-up/personal'),
      icon: <RiUserLine size={20} />
    },
    {
      label: 'selected_calendar',
      value: ({calendars}) =>
        calendars.length > 0
          ? calendars[0].name
          : t('selected_calendar_placeholder'),
      onEdit: () => handleEdit('/sign-up/calendar'),
      icon: <RiCalendarLine size={20} />
    }
  ];

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
      onSubmit={submit}
      className="flex flex-col gap-6 justify-center items-center w-[480px]"
    >
      <div className="flex flex-col items-center">
        <RoundedIconWrapper>
          <RiCheckboxCircleFill size={32} color="var(--text-sub-600)" />
        </RoundedIconWrapper>

        <div className="flex flex-col gap-1 text-center">
          <h2 className="text-title-h5 text-text-strong-950">{t('summary')}</h2>
          <p className="text-paragraph-md text-text-sub-600">
            {t('summary_description')}
          </p>
        </div>
      </div>

      <div className="w-full h-[1px] bg-bg-soft-200" />

      <div className="flex py-[15px] px-4 flex-col items-start gap-4 self-stretch rounded-2xl border border-stroke-soft-200 bg-bg-white-0 shadow-regular-xs">
        {summaryItems.map((item, index) => (
          <Fragment key={item.label}>
            <SummaryItem
              key={item.label}
              label={t(item.label)}
              value={item.value({user, calendars})}
              onEdit={item.onEdit}
              icon={item.icon}
            />
            {index < summaryItems.length - 1 && <Divider />}
          </Fragment>
        ))}
        {/* <SummaryItem
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
        /> */}
      </div>

      <Button.Root
        className="w-full"
        variant="neutral"
        mode="filled"
        type="submit"
      >
        <span className="text-label-sm">{t('continue')}</span>
      </Button.Root>
    </form>
  );
};

export default SummaryForm;
