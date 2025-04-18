'use client';

import { MARKADO_DOMAIN } from '@/app/constants';
import { Root as Button } from '@/components/align-ui/ui/button';
import * as Input from '@/components/align-ui/ui/input';
import { Asterisk, Root as Label } from '@/components/align-ui/ui/label';
import RoundedIconWrapper from '@/components/RoundedIconWrapper';
import { TimezoneSelectWithStyle } from '@/components/TimezoneSelectWithStyle';
import { useSignUp } from '@/contexts/SignUpContext';
import { useTRPC } from '@/utils/trpc';
import { RiAccountPinBoxFill } from '@remixicon/react';
import { useTranslations } from 'next-intl';
import { FormEvent, useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';

const PersonalForm = () => {
  const trpc = useTRPC();
  const updateProfileMutation = useMutation(trpc.updateProfile.mutationOptions());
  const { forms, nextStep, queries } = useSignUp();
  const { user } = queries;
  const [hasUserTimezone, setHasUserTimezone] = useState(false);

  const t = useTranslations('SignUpPage.PersonalForm');

  useEffect(() => {
    if (user.data) {
      // Prefill form with user data if available
      forms.personal.setValue('name', user.data.name || '');
      forms.personal.setValue('username', user.data.username || '');
      
      // Set timezone if available
      if (user.data.timeZone) {
        forms.personal.setValue('timeZone', user.data.timeZone);
        setHasUserTimezone(true);
      }
    }
  }, [user.data, forms.personal]);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate the form using react-hook-form's handleSubmit
    const isValid = await forms.personal.trigger();
    
    if (!isValid) {
      return;
    }

    // Get the form values
    const formData = forms.personal.getValues();
    
    try {
      // Update the user profile
      await updateProfileMutation.mutateAsync({
        name: formData.name,
        username: formData.username,
        timeZone: formData.timeZone,
      });

      // Move to the next step
      nextStep();
    } catch (error) {
      // Handle any errors from the mutation
      console.error('Error updating profile:', error);
    }
  };

  const timeZone = forms.personal.watch('timeZone');

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
              {...forms.personal.register('name')}
            />
          </Input.Root>
          {forms.personal.formState.errors.name && (
            <span className="text-paragraph-xs text-red-500">
              {t('name_required')}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <Label>{t('username')}</Label>
          <Input.Root>
            <Input.Affix>{MARKADO_DOMAIN}/</Input.Affix>
            <Input.Input
              type="text"
              placeholder="marcusdutra"
              {...forms.personal.register('username')}
            />
          </Input.Root>
          {forms.personal.formState.errors.username && (
            <span className="text-paragraph-xs text-red-500">
              {t('username_required')}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <Label>{t('time_zone')}</Label>
          <TimezoneSelectWithStyle
            value={timeZone}
            onChange={(value) => forms.personal.setValue('timeZone', value)}
            autoDetect={!hasUserTimezone}
          />
          {forms.personal.formState.errors.timeZone && (
            <span className="text-paragraph-xs text-red-500">
              {t('timezone_required')}
            </span>
          )}
        </div>
      </div>

      <Button
        className="w-full"
        variant={'primary'}
        mode="filled"
        type="submit"
        disabled={updateProfileMutation.isPending}
      >
        <span className="text-label-sm">{t('continue')}</span>
      </Button>
    </form>
  );
};

export default PersonalForm;