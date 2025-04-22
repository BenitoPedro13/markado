'use client';

import {Root as Button} from '@/components/align-ui/ui/button';
import {Input} from '@/components/align-ui/ui/input';
import {Root as Switch} from '@/components/align-ui/ui/switch';
import RoundedIconWrapper from '@/components/RoundedIconWrapper';
import {SignUpAvailabilityFormData, useSignUp} from '@/contexts/SignUpContext';
import {
  RiAddFill,
  RiFileCopyFill,
  RiTimeFill,
  RiDeleteBinLine
} from '@remixicon/react';
import {useTranslations} from 'next-intl';
import {FormEvent, useState} from 'react';
import {z} from 'zod';

import {setStepComplete, clearEditMode} from '@/utils/cookie-utils';
import {useTRPC} from '@/utils/trpc';
import {useNotification} from '@/hooks/use-notification';
import {useMutation} from '@tanstack/react-query';

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

// Default time window
const DEFAULT_TIME_WINDOW = {startTime: '09:00', endTime: '17:00'};

// Enhanced Availability component with Cal.com-inspired UI
const Availability = (props: SignUpAvailabilityFormData) => {
  const {schedules} = props;
  const t = useTranslations('SignUpPage.AvailabilityForm');
  const {forms} = useSignUp();
  const availabilityForm = forms.availability;

  // Handle adding a new time window for a specific day
  const handleAddTimeWindow = (day: string) => {
    const currentSchedules = availabilityForm.getValues().schedules;
    const currentTimeWindows =
      currentSchedules[day as keyof typeof currentSchedules]?.timeWindows || [];

    // Use type assertion to handle the dynamic path
    availabilityForm.setValue(`schedules.${day}.timeWindows` as any, [
      ...currentTimeWindows,
      {...DEFAULT_TIME_WINDOW}
    ]);
  };

  // Handle removing a time window
  const handleRemoveTimeWindow = (day: string, index: number) => {
    const currentSchedules = availabilityForm.getValues().schedules;
    const timeWindows = [
      ...(currentSchedules[day as keyof typeof currentSchedules]?.timeWindows ||
        [])
    ];

    // Remove the time window at the specified index
    timeWindows.splice(index, 1);

    // Use type assertion to handle the dynamic path
    availabilityForm.setValue(
      `schedules.${day}.timeWindows` as any,
      timeWindows
    );
  };

  // Handle copying time windows from one day to another
  const handleCopyTimeWindows = (fromDay: string, toDay: string) => {
    const currentSchedules = availabilityForm.getValues().schedules;
    const timeWindows =
      currentSchedules[fromDay as keyof typeof currentSchedules]?.timeWindows ||
      [];

    // Use type assertion to handle the dynamic path
    availabilityForm.setValue(`schedules.${toDay}.timeWindows` as any, [
      ...timeWindows
    ]);
    availabilityForm.setValue(`schedules.${toDay}.enabled` as any, true);
  };

  // Handle time input change
  const handleTimeChange = (
    day: string,
    index: number,
    field: 'startTime' | 'endTime',
    value: string
  ) => {
    const currentSchedules = availabilityForm.getValues().schedules;
    const timeWindows = [
      ...(currentSchedules[day as keyof typeof currentSchedules]?.timeWindows ||
        [])
    ];

    if (timeWindows[index]) {
      timeWindows[index] = {...timeWindows[index], [field]: value};
      // Use type assertion to handle the dynamic path
      availabilityForm.setValue(
        `schedules.${day}.timeWindows` as any,
        timeWindows
      );
    }
  };

  // Handle switch toggle
  const handleSwitchToggle = (day: string, checked: boolean) => {
    // Get the current form values
    const currentSchedules = {...availabilityForm.getValues().schedules};
    
    // Create a new schedule object for the day
    const updatedDaySchedule = {
      ...currentSchedules[day as keyof typeof currentSchedules],
      enabled: checked,
      timeWindows: currentSchedules[day as keyof typeof currentSchedules]?.timeWindows || []
    };
    
    // If enabling a day and it has no time windows, add a default one
    if (checked && (!updatedDaySchedule.timeWindows || updatedDaySchedule.timeWindows.length === 0)) {
      updatedDaySchedule.timeWindows = [{ startTime: '09:00', endTime: '17:00' }];
    }
    
    // Update the schedules object with the new day schedule
    const updatedSchedules = {
      ...currentSchedules,
      [day]: updatedDaySchedule
    };
    
    // Update the entire schedules object at once
    availabilityForm.setValue('schedules', updatedSchedules, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true
    });
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {Object.entries(schedules).map(([key, value]) => (
        <div
          key={key}
          className="flex flex-col gap-2 w-full p-4 border border-bg-soft-200 rounded-lg"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Switch
                id={key}
                checked={value.enabled}
                onCheckedChange={(checked) => handleSwitchToggle(key, checked)}
              />
              <span className="text-label-md font-medium capitalize">
                {t(key)}
              </span>
            </div>

            {value.enabled && (
              <div className="flex items-center gap-2">
                <Button
                  className="w-[32px] h-[32px]"
                  variant={'neutral'}
                  mode="filled"
                  size="xxsmall"
                  onClick={() => handleAddTimeWindow(key)}
                  title={t('add_time')}
                >
                  <RiAddFill size={16} />
                </Button>
                <Button
                  className="w-[32px] h-[32px]"
                  variant={'neutral'}
                  mode="filled"
                  size="xxsmall"
                  onClick={() => {
                    // Copy to next day (or first day if it's the last day)
                    const days = Object.keys(schedules);
                    const currentIndex = days.indexOf(key);
                    const nextIndex = (currentIndex + 1) % days.length;
                    handleCopyTimeWindows(key, days[nextIndex]);
                  }}
                  title={t('copy_time')}
                >
                  <RiFileCopyFill size={16} />
                </Button>
              </div>
            )}
          </div>

          {value.enabled && (
            <div className="flex flex-col gap-2 mt-2">
              {value.timeWindows &&
                value.timeWindows.map((window, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex items-center gap-2 flex-1">
                      <Input
                        className="border border-bg-soft-200 rounded-10 min-w-[84px]"
                        type="text"
                        placeholder="09:00"
                        value={window.startTime}
                        onChange={(e) =>
                          handleTimeChange(
                            key,
                            index,
                            'startTime',
                            e.target.value
                          )
                        }
                      />
                      <span className="text-text-sub-600">-</span>
                      <Input
                        className="border border-bg-soft-200 rounded-10 min-w-[84px]"
                        type="text"
                        placeholder="17:00"
                        value={window.endTime}
                        onChange={(e) =>
                          handleTimeChange(
                            key,
                            index,
                            'endTime',
                            e.target.value
                          )
                        }
                      />
                    </div>

                    {value.timeWindows.length > 1 && (
                      <Button
                        className="w-[32px] h-[32px]"
                        variant={'neutral'}
                        mode="filled"
                        size="xxsmall"
                        onClick={() => handleRemoveTimeWindow(key, index)}
                        title={t('delete_time')}
                      >
                        <RiDeleteBinLine size={16} />
                      </Button>
                    )}
                  </div>
                ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const AvailabilityPage = () => {
  const {forms, goToStep} = useSignUp();
  const availabilityForm = forms.availability;
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
      // Get form values
      const formValues = availabilityForm.getValues();

      // Create a schedule first
      const scheduleResult = await createScheduleMutation.mutateAsync({
        name: t('default_schedule_name'),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      });

      // Then create availabilities for each day
      for (const [day, value] of Object.entries(formValues.schedules)) {
        if (
          value.enabled &&
          value.timeWindows &&
          value.timeWindows.length > 0
        ) {
          for (const timeWindow of value.timeWindows) {
            await createAvailabilityMutation.mutateAsync({
              days: [dayMap[day]],
              startTime: timeWindow.startTime,
              endTime: timeWindow.endTime,
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

// Sign up availability form schema
const signUpAvailabilityFormSchema = z.object({
  schedules: z.record(
    z.enum([
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday'
    ]),
    z.object({
      enabled: z.boolean(),
      timeWindows: z.array(
        z.object({
          startTime: z
            .string()
            .regex(
              /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
              'SignUpPage.AvailabilityForm.invalid_time_format'
            ),
          endTime: z
            .string()
            .regex(
              /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
              'SignUpPage.AvailabilityForm.invalid_time_format'
            )
        })
      )
    })
  )
});
