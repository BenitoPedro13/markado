'use client';

import type {Prisma} from '~/prisma/app/generated/prisma/client';
import {z} from 'zod';
import * as Button from '@/components/align-ui/ui/button';
import {ServiceFormFields} from '@/types/service';
import RequiredFormItem from './RequiredFormItem';
import OptionalFormItem from './OptionalFormItem';
import {useLocale} from '@/hooks/use-locale';
import {FormBuilder} from '@/packages/features/form-builder/FormBuilder';
import {fieldSchema} from '@/packages/features/form-builder/schema';
import {useFormContext} from 'react-hook-form';
import {FormValues, EventTypeSetupProps} from '@/features/eventtypes/lib/types';
import getLocationsOptionsForSelect from '@/packages/features/bookings/lib/getLocationOptionsForSelect';

type Props = {
  slug: string;
};

type BookingField = z.infer<typeof fieldSchema>;

export default function ServiceForm({slug}: Props) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implementar atualização dos campos do formulário
  };

  const formMethods = useFormContext<FormValues>();

  const bookingFields: Prisma.JsonObject = {};

  const {t} = useLocale();

  return (
    <>
      <FormBuilder
        title={t('booking_questions_title')}
        description={t('booking_questions_description')}
        addFieldLabel={t('add_a_booking_question')}
        formProp="bookingFields"
        // {...shouldLockDisableProps('bookingFields')}
        // dataStore={{
        //   options: {
        //     locations: {
        //       // FormBuilder doesn't handle plural for non-english languages. So, use english(Location) only. This is similar to 'Workflow'
        //       source: {label: 'Location'},
        //       value: getLocationsOptionsForSelect(
        //         formMethods.getValues('locations') ?? [],
        //         t
        //       )
        //     }
        //   }
        // }}
        disabled={false}
        LockedIcon={false}
        shouldConsiderRequired={(field: BookingField) => {
          // Location field has a default value at backend so API can send no location but we don't allow it in UI and thus we want to show it as required to user
          return field.name === 'location' ? true : field.required;
        }}
      />
    </>
  );
}
