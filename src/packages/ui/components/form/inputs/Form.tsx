import type {JSX, ReactElement, Ref} from 'react';
import React, {forwardRef} from 'react';
import type {FieldValues, SubmitHandler, UseFormReturn} from 'react-hook-form';
import {FormProvider} from 'react-hook-form';

import {getErrorFromUnknown} from '@/packages/lib/errors';

import {useNotification} from '@/hooks/use-notification';

type FormProps<T extends object> = {
  form: UseFormReturn<T>;
  handleSubmit: SubmitHandler<T>;
} & Omit<JSX.IntrinsicElements['form'], 'onSubmit'>;

const PlainForm = <T extends FieldValues>(
  props: FormProps<T>,
  ref: Ref<HTMLFormElement>
) => {
  const {form, handleSubmit, ...passThrough} = props;
  const {notification} = useNotification();

  return (
    <FormProvider {...form}>
      <form
        ref={ref}
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();

          form
            .handleSubmit(handleSubmit)(event)
            .catch((err) => {
              // FIXME: Booking Pages don't have toast, so this error is never shown
              notification({
                title: `${getErrorFromUnknown(err).message}`,
                variant: 'stroke',
                id: 'plain_form_error',
                status: 'error'
              });
            });
        }}
        {...passThrough}
      >
        {props.children}
      </form>
    </FormProvider>
  );
};

export const Form = forwardRef(PlainForm) as <T extends FieldValues>(
  p: FormProps<T> & {ref?: Ref<HTMLFormElement>}
) => ReactElement;
