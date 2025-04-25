'use client';

import {MARKADO_DOMAIN} from '@/app/constants';
import {Root as Button} from '@/components/align-ui/ui/button';
import * as Input from '@/components/align-ui/ui/input';
import {Asterisk, Root as Label} from '@/components/align-ui/ui/label';
import RoundedIconWrapper from '@/components/RoundedIconWrapper';
import {TimezoneSelectWithStyle} from '@/components/TimezoneSelectWithStyle';
import {useSignUp} from '@/contexts/SignUpContext';
import {useTRPC} from '@/utils/trpc';
import {RiAccountPinBoxFill} from '@remixicon/react';
import {useTranslations} from 'next-intl';
import {FormEvent, useEffect, useState, useRef} from 'react';
import {useMutation} from '@tanstack/react-query';
import {useRouter} from 'next/navigation';
import Cookies from 'js-cookie';

import {getMeByUserId} from '~/trpc/server/handlers/user.handler';
import {setStepComplete, clearEditMode, setNextStep, isEditMode} from '@/utils/cookie-utils';

interface PersonalFormProps {
  user: Awaited<ReturnType<typeof getMeByUserId>>;
}

const PersonalForm = ({user}: PersonalFormProps) => {
  const trpc = useTRPC();
  const router = useRouter();
  const {forms, goToStep} = useSignUp();
  const t = useTranslations('SignUpPage.PersonalForm');

  // New mutation to update onboarding progress
  const updateOnboardingProgressMutation = useMutation(
    trpc.profile.updateOnboardingProgress.mutationOptions({
      onSuccess: () => {
        // Set a specific cookie to bypass middleware on the next step ONLY
        console.log('[PersonalForm] Setting temporary next_step cookie');
        setNextStep('/sign-up/calendar');
        
        // Finally, navigate to next step
        console.log('[PersonalForm] Profile and progress updated, navigating to calendar step');
        goToStep('/sign-up/calendar');
      }
    })
  );

  const updateProfileMutation = useMutation(
    trpc.profile.update.mutationOptions({
      onSuccess: () => {
        console.log('[PersonalForm] Profile updated, updating onboarding progress');
        
        // Set the personal step completion cookie directly
        setStepComplete('personal');
        
        // Clear the edit_mode cookie if it exists
        clearEditMode();
        
        // Only set next_step cookie if we're not in edit mode
        if (!isEditMode()) {
          // Set a temporary one-time navigation cookie
          setNextStep('/sign-up/calendar');
        }
        
        console.log('[PersonalForm] Cookies set, navigating to next step');
        
        // After setting cookies, update progress in backend (even if we've set cookies directly)
        updateOnboardingProgressMutation.mutate({ 
          personalComplete: true 
        });
      }
    })
  );

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
      console.log('[PersonalForm] Submitting form with values:', formData);
      // Update the user profile
      await updateProfileMutation.mutateAsync({
        name: formData.name,
        username: formData.username,
        timeZone: formData.timeZone
      });
    } catch (error) {
      // Handle any errors from the mutation
      console.error('[PersonalForm] Error updating profile:', error);
    }
  };

  const timeZone = forms.personal.watch('timeZone');
  // const name = forms.personal.watch('name');
  // const username = forms.personal.watch('username');

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
            onChange={(value) => {
              forms.personal.setValue('timeZone', value);
              forms.personal.trigger();
            }}
            autoDetect={!user?.timeZone}
            defaultValue={user?.timeZone || 'America/Sao_Paulo'}
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
        variant="neutral"
        mode="filled"
        type="submit"
        disabled={updateProfileMutation.isPending || updateOnboardingProgressMutation.isPending}
      >
        <span className="text-label-sm">{t('continue')}</span>
      </Button>
    </form>
  );
};

export default PersonalForm;
