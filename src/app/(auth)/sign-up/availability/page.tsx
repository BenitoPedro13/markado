'use client';

import {Root as Button} from '@/components/align-ui/ui/button';
import RoundedIconWrapper from '@/components/RoundedIconWrapper';
import {SignUpAvailabilityFormData, useSignUp} from '@/contexts/SignUpContext';
import {RiTimeFill} from '@remixicon/react';
import {useTranslations} from 'next-intl';
import {FormEvent, useState} from 'react';
import {z} from 'zod';
import dayjs from 'dayjs';

import {setStepComplete, clearEditMode} from '@/utils/cookie-utils';
import {useTRPC} from '@/utils/trpc';
import {useNotification} from '@/hooks/use-notification';
import {useMutation} from '@tanstack/react-query';
import Schedule from '@/components/schedules/components/Schedule';
import {FormProvider} from 'react-hook-form';

// Map day names to day numbers (0 = Sunday, 1 = Monday, etc.)
const dayMap: Record<string, number> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6
};

const AvailabilityPage = () => {
  const {forms, goToStep} = useSignUp();
  const availabilityForm = forms.availability;
  const scheduleForm = forms.schedule;
  const trpc = useTRPC();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {notification} = useNotification();
  const t = useTranslations('SignUpPage.AvailabilityForm');

  // Create schedule mutation
  const createScheduleMutation = useMutation(
    trpc.schedule.create.mutationOptions({
      onSuccess: () => {
        notification({
          title: t('schedule_created_success'),
          variant: 'stroke'
        });
      },
      onError: (error) => {
        notification({
          title: t('schedule_created_error'),
          description: error.message,
          variant: 'stroke'
        });
      }
    })
  );

  // Create availability mutation
  const createAvailabilityMutation = useMutation(
    trpc.availability.create.mutationOptions({
      onSuccess: () => {
        notification({
          title: t('availability_created_success'),
          variant: 'stroke'
        });
      },
      onError: (error) => {
        notification({
          title: t('availability_created_error'),
          description: error.message,
          variant: 'stroke'
        });
      }
    })
  );

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Get form values from the Schedule component
      const scheduleValues = scheduleForm.getValues();
      
      // Create a schedule first
      const scheduleResult = await createScheduleMutation.mutateAsync({
        name: t('default_schedule_name'),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      });

      // Convert the schedule format to availability format
      const schedule = scheduleValues.schedule;
      
      // Create availabilities for each day
      for (let dayIndex = 0; dayIndex < schedule.length; dayIndex++) {
        const timeRanges = schedule[dayIndex];
        if (timeRanges && timeRanges.length > 0) {
          for (const timeRange of timeRanges) {
            // Format the time values as HH:MM strings to match the schema requirements
            const startTime = dayjs(timeRange.start).format('HH:mm');
            const endTime = dayjs(timeRange.end).format('HH:mm');

            await createAvailabilityMutation.mutateAsync({
              days: [dayIndex],
              startTime,
              endTime,
              scheduleId: scheduleResult.id
            });
          }
        }
      }

      // Clear the edit_mode cookie if it exists
      clearEditMode();

      // Set the availability step completion cookie
      setStepComplete('availability');

      // Continue to the next step
      goToStep('/sign-up/summary');
    } catch (error) {
      console.error('Error submitting availability form:', error);
      notification({
        title: t('form_submission_error'),
        variant: 'stroke'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      action=""
      onSubmit={submit}
      className="flex flex-col gap-6 justify-center items-center w-fit max-w-[521px]"
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
        <div className="text-strong-950 font-jakarta w-full font-medium tracking-tighter">
          <FormProvider {...scheduleForm}>
            <Schedule 
              control={scheduleForm.control} 
              name="schedule" 
              weekStart={1} 
            />
          </FormProvider>
        </div>
      </div>

      <Button
        className="w-full"
        variant="neutral"
        mode="filled"
        type="submit"
        disabled={isSubmitting}
      >
        <span className="text-label-sm">
          {isSubmitting ? t('saving') : t('continue')}
        </span>
      </Button>
    </form>
  );
};

export default AvailabilityPage;
