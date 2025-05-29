'use client';

import * as Switch from '@/components/align-ui/ui/switch';
import * as Button from '@/components/align-ui/ui/button';
import * as Divider from '@/components/align-ui/ui/divider';
import * as RadioGroup from '@/components/align-ui/ui/radio';
import * as Input from '@/components/align-ui/ui/input';
import * as Select from '@/components/align-ui/ui/select';
import * as Label from '@/components/align-ui/ui/label';
import * as Hint from '@/components/align-ui/ui/hint';

type Props = {
  slug: string;
};
import {RiErrorWarningFill} from '@remixicon/react';
// import * as RadioGroup from '@radix-ui/react-radio-group';
import type {UnitTypeLongPlural} from 'dayjs';
// import {Trans} from 'next-i18next';
import type {Dispatch, SetStateAction} from 'react';
import {useEffect, useState} from 'react';
import {Controller, useFormContext} from 'react-hook-form';
import type z from 'zod';

// import useLockedFieldsManager from '@/features/core/managed-event-types/hooks/useLockedFieldsManager';
import type {EventTypeSetup} from '@/features/eventtypes/lib/types';
import type {FormValues} from '@/features/eventtypes/lib/types';
import {cn as classNames} from '@/utils/cn';
import {useLocale} from '@/hooks/use-locale';
import type {EventTypeMetaDataSchema} from '~/prisma/zod-utils';
import {CheckboxField} from '@/packages/features/form-builder/FormBuilder';
import {SettingsToggle} from '@/packages/ui';
import {useServicesDetails} from '@/contexts/services/servicesDetails/ServicesContext';
// import {
//   Input,
//   SettingsToggle,
//   RadioField,
//   Select,
//   CheckboxField
// } from '@/ui';

type RequiresConfirmationControllerProps = {
  metadata: z.infer<typeof EventTypeMetaDataSchema>;
  requiresConfirmation: boolean;
  requiresConfirmationWillBlockSlot: boolean;
  onRequiresConfirmation: Dispatch<SetStateAction<boolean>>;
  seatsEnabled: boolean;
  eventType: EventTypeSetup;
};

export function RequiresConfirmationController({
  metadata,
  eventType,
  requiresConfirmation,
  onRequiresConfirmation,
  seatsEnabled
}: RequiresConfirmationControllerProps) {
  const {t} = useLocale();
  const [requiresConfirmationSetup, setRequiresConfirmationSetup] = useState(
    metadata?.requiresConfirmationThreshold
  );
  const defaultRequiresConfirmationSetup = {
    time: 30,
    unit: 'minutes' as UnitTypeLongPlural
  };
  const {ServicesDetailsForm: formMethods} = useServicesDetails();

  useEffect(() => {
    if (!requiresConfirmation) {
      formMethods.setValue(
        'metadata.requiresConfirmationThreshold',
        undefined,
        {shouldDirty: true}
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requiresConfirmation]);

  // const {shouldLockDisableProps} = useLockedFieldsManager({
  //   eventType,
  //   translate: t,
  //   formMethods
  // });
  // const requiresConfirmationLockedProps = shouldLockDisableProps(
  //   'requiresConfirmation'
  // );

  const options = [
    {label: t('minute_timeUnit'), value: 'minutes'},
    {label: t('hour_timeUnit'), value: 'hours'}
  ];

  const defaultValue = options.find(
    (opt) =>
      opt.value ===
      (metadata?.requiresConfirmationThreshold?.unit ??
        defaultRequiresConfirmationSetup.unit)
  );

  const requiresConfirmationWillBlockSlot = formMethods.getValues(
    'requiresConfirmationWillBlockSlot'
  );

  return (
    <div className="block items-start sm:flex">
      <div className="w-full">
        <Controller
          name="requiresConfirmation"
          control={formMethods.control}
          render={() => (
            <SettingsToggle
              labelClassName="text-text-strong-950 font-medium text-label-md"
              toggleSwitchAtTheEnd={true}
              switchContainerClassName={classNames(
                // "py-6 px-4 sm:px-6",
                requiresConfirmation && 'rounded-b-none'
              )}
              childrenClassName="lg:ml-0"
              title={t('requires_confirmation')}
              data-testid="requires-confirmation"
              disabled={
                seatsEnabled || false
                //  || requiresConfirmationLockedProps.disabled
              }
              tooltip={
                seatsEnabled
                  ? t('seat_options_doesnt_support_confirmation')
                  : undefined
              }
              description={t('requires_confirmation_description')}
              checked={requiresConfirmation}
              // LockedIcon={requiresConfirmationLockedProps.LockedIcon}
              LockedIcon={false}
              onCheckedChange={(val) => {
                formMethods.setValue('requiresConfirmation', val, {
                  shouldDirty: true
                });
                // If we uncheck requires confirmation, we also uncheck the "will block slot" checkbox
                if (!val) {
                  formMethods.setValue(
                    'requiresConfirmationWillBlockSlot',
                    false,
                    {shouldDirty: true}
                  );
                }
                onRequiresConfirmation(val);
              }}
            >
              <div className="border-subtle rounded-b-lg border-t-0 pt-4">
                <RadioGroup.Group
                  defaultValue={
                    requiresConfirmation
                      ? requiresConfirmationSetup === undefined
                        ? 'always'
                        : 'notice'
                      : undefined
                  }
                  onValueChange={(val) => {
                    if (val === 'always') {
                      formMethods.setValue('requiresConfirmation', true, {
                        shouldDirty: true
                      });
                      onRequiresConfirmation(true);
                      formMethods.setValue(
                        'metadata.requiresConfirmationThreshold',
                        undefined,
                        {
                          shouldDirty: true
                        }
                      );
                      setRequiresConfirmationSetup(undefined);
                    } else if (val === 'notice') {
                      formMethods.setValue('requiresConfirmation', true, {
                        shouldDirty: true
                      });
                      onRequiresConfirmation(true);
                      formMethods.setValue(
                        'metadata.requiresConfirmationThreshold',
                        requiresConfirmationSetup ||
                          defaultRequiresConfirmationSetup,
                        {shouldDirty: true}
                      );
                    }
                  }}
                >
                  <div className="flex flex-col flex-wrap justify-start gap-y-2">
                    {(requiresConfirmationSetup === undefined || true) && (
                      // || !requiresConfirmationLockedProps.disabled

                      <div className="inline-flex gap-1">
                        <RadioGroup.Item
                          // label={t('always_requires_confirmation')}
                          // disabled={requiresConfirmationLockedProps.disabled}
                          disabled={false}
                          id="always"
                          value="always"
                        ></RadioGroup.Item>
                        <Label.Root className="text-text-sub-600 text-label-sm peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          {t('always_requires_confirmation')}
                        </Label.Root>
                      </div>
                    )}
                    {(requiresConfirmationSetup !== undefined || true) && (
                      // || !requiresConfirmationLockedProps.disabled
                      <>
                        <div className="inline-flex gap-1">
                          <RadioGroup.Item
                            disabled={false}
                            className="items-center"
                            id="notice"
                            value="notice"
                          ></RadioGroup.Item>
                          <Label.Root className="text-text-sub-600 text-label-sm peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            {t('when_booked_with_less_than')}{' '}
                            <div className="mx-2 inline-flex items-center">
                              <Input.Root
                                // size="xsmall"
                                className="!m-0 block w-16 h-5 rounded-r-none border-r-0 text-sm [appearance:textfield] focus:z-10 focus:border-r"
                              >
                                <Input.Input
                                  type="number"
                                  min={1}
                                  // disabled={requiresConfirmationLockedProps.disabled}
                                  disabled={false}
                                  onChange={(evt) => {
                                    const val = Number(evt.target?.value);
                                    setRequiresConfirmationSetup({
                                      unit:
                                        requiresConfirmationSetup?.unit ??
                                        defaultRequiresConfirmationSetup.unit,
                                      time: val
                                    });
                                    formMethods.setValue(
                                      'metadata.requiresConfirmationThreshold.time',
                                      val,
                                      {shouldDirty: true}
                                    );
                                  }}
                                  className=" py-0 h-fit"
                                  defaultValue={
                                    metadata?.requiresConfirmationThreshold
                                      ?.time || 30
                                  }
                                />
                              </Input.Root>

                              {/* <label
                                className={classNames(
                                  // requiresConfirmationLockedProps.disabled
                                  false && 'cursor-not-allowed'
                                )}
                              > */}
                              <Select.Root
                                // options={options}
                                // isSearchable={false}
                                // isDisabled={
                                //   requiresConfirmationLockedProps.disabled
                                // }
                                // isDisabled={false}
                                // innerClassNames={{
                                //   control: 'rounded-l-none bg-subtle'
                                // }}
                                size="xsmall"
                                onValueChange={(opt: string) => {
                                  setRequiresConfirmationSetup({
                                    time:
                                      requiresConfirmationSetup?.time ??
                                      defaultRequiresConfirmationSetup.time,
                                    unit: opt as UnitTypeLongPlural
                                  });
                                  formMethods.setValue(
                                    'metadata.requiresConfirmationThreshold.unit',
                                    opt as UnitTypeLongPlural,
                                    {shouldDirty: true}
                                  );
                                }}
                                defaultValue={defaultValue?.value ?? 'minutes'}
                                // className=" "
                              >
                                <Select.Trigger
                                  className="flex w-[90px] sm:w-[100px] rounded-l-none"
                                  // disabled=
                                  id="notice"
                                >
                                  <Select.Value
                                    className=" "
                                    placeholder="Selecione uma unidade"
                                  />
                                </Select.Trigger>
                                <Select.Content>
                                  {options.map((opt) => (
                                    <Select.Item
                                      key={opt.value}
                                      value={opt.value}
                                    >
                                      {opt.label}
                                    </Select.Item>
                                  ))}
                                </Select.Content>
                              </Select.Root>
                              {/* </label> */}
                            </div>{' '}
                            {t('notice')}
                          </Label.Root>
                        </div>

                        <CheckboxField
                          defaultChecked={requiresConfirmationWillBlockSlot}
                          // descriptionAsLabel
                          label={t(
                            'requires_confirmation_will_block_slot_description'
                          )}
                          onCheckedChange={(checked) => {
                            // We set should dirty to properly detect when we can submit the form
                            formMethods.setValue(
                              'requiresConfirmationWillBlockSlot',
                              checked,
                              {
                                shouldDirty: true
                              }
                            );
                          }}
                        />
                      </>
                    )}
                  </div>
                </RadioGroup.Group>
              </div>
            </SettingsToggle>
          )}
        />
      </div>
    </div>
  );
}

export default function ServiceAdvanced({slug}: Props) {
  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   // TODO: Implementar atualização das configurações avançadas
  // };

  const {
    queries: {serviceDetails},
    ServicesDetailsForm: {register, handleSubmit, watch, getValues, setValue}
  } = useServicesDetails();

  const seatsEnabled = watch('seatsPerTimeSlotEnabled');

  const [requiresConfirmation, setRequiresConfirmation] = useState(
    getValues('requiresConfirmation')
  );

  const [redirectUrlVisible, setRedirectUrlVisible] = useState(
    !!getValues('successRedirectUrl')
  );

  const {t} = useLocale();

  return (
    <div
      //  onSubmit={handleSubmit}
      className="space-y-6 max-w-2xl"
    >
      {/* <div className="space-y-4"> */}
      {/* <div className="flex flex-col">
          <div className="text-title-h6">Configurações Avançadas</div>
          <div className="text-paragraph-sm text-text-sub-600">
            Personalize as configurações avançadas do serviço
          </div>
        </div> */}
      <div className="space-y-6">
        {/* <div className="p-4 flex items-center justify-between">
            <div>
              <h3 className="font-medium">Necessita de Confirmação Manual</h3>
              <p className="text-paragraph-sm text-text-sub-600">
                A reserva exige uma confirmação manual antes de ser enviada para
                integrações e para o envio de um e-mail de confirmação ao
                usuário.
              </p>
            </div>
            <Switch.Root />
          </div> */}
        <RequiresConfirmationController
          eventType={serviceDetails}
          seatsEnabled={seatsEnabled}
          metadata={getValues('metadata')}
          requiresConfirmation={requiresConfirmation}
          requiresConfirmationWillBlockSlot={getValues(
            'requiresConfirmationWillBlockSlot'
          )}
          onRequiresConfirmation={setRequiresConfirmation}
        />

        <Divider.Root />
        {/* <div className="p-4 flex items-center justify-between">
          <div>
            <h3 className="font-medium">Redirecionamento pós-reserva</h3>
            <p className="text-paragraph-sm text-text-sub-600">
              Defina uma URL específica para a qual o usuário será direcionado
              logo após concluir uma reserva
            </p>
          </div>
          <Switch.Root defaultChecked />
        </div> */}
        <Controller
          name="successRedirectUrl"
          render={({field: {value, onChange}}) => (
            <>
              <SettingsToggle
                labelClassName="text-text-strong-950 font-medium text-label-md"
                toggleSwitchAtTheEnd={true}
                switchContainerClassName={classNames(
                  'border-subtle rounded-lg',
                  redirectUrlVisible && 'rounded-b-none'
                )}
                childrenClassName="lg:ml-0"
                title={t('redirect_success_booking')}
                data-testid="redirect-success-booking"
                // {...successRedirectUrlLocked}
                description={t('redirect_url_description')}
                checked={redirectUrlVisible}
                onCheckedChange={(e) => {
                  setRedirectUrlVisible(e);
                  onChange(e ? value : '');
                }}
              >
                <div className="border-subtle border-t-0 pt-4">
                  <Label.Root className="mb-1">{t('redirect_success_booking')}</Label.Root>
                  <Input.Root>
                    <Input.Input
                      className="w-full"
                      // label={t('redirect_success_booking')}
                      // labelSrOnly
                      // disabled={successRedirectUrlLocked.disabled}
                      disabled={false}
                      placeholder={t('external_redirect_url')}
                      // data-testid="external-redirect-url"
                      required={redirectUrlVisible}
                      type="text"
                      {...register('successRedirectUrl')}
                    />
                  </Input.Root>
                  {/* <TextField
                    className="w-full"
                    label={t('redirect_success_booking')}
                    labelSrOnly
                    // disabled={successRedirectUrlLocked.disabled}
                    disabled={false}
                    placeholder={t('external_redirect_url')}
                    data-testid="external-redirect-url"
                    required={redirectUrlVisible}
                    type="text"
                    {...register('successRedirectUrl')}
                  /> */}

                  {/* <div className="mt-4">
                    <Controller
                      name="forwardParamsSuccessRedirect"
                      render={({field: {value, onChange}}) => (
                        <CheckboxField
                          description={t('forward_params_redirect')}
                          disabled={successRedirectUrlLocked.disabled}
                          onChange={(e) => onChange(e)}
                          checked={value}
                        />
                      )}
                    />
                  </div> */}
                  <Hint.Root
                    className={classNames(
                      'text-error-base  gap-1 mt-1',
                      getValues('successRedirectUrl') ? 'flex' : 'hidden'
                    )}
                  >
                    <Hint.Icon
                      as={RiErrorWarningFill}
                      className="text-error-base"
                    />

                    {t('redirect_url_warning')}
                  </Hint.Root>
                </div>
              </SettingsToggle>
            </>
          )}
        />
        <Divider.Root />
        {/* <div className="p-4 flex items-center justify-between">
          <div>
            <h3 className="font-medium">
              Fixar Fuso Horário na Página de Reservas
            </h3>
            <p className="text-paragraph-sm text-text-sub-600">
              Manter o fuso horário fixo na página de reservas, ideal para
              eventos que exigem a presença física.
            </p>
          </div>
          <Switch.Root defaultChecked />
        </div> */}
        <Controller
          name="lockTimeZoneToggleOnBookingPage"
          render={({field: {value, onChange}}) => (
            <SettingsToggle
              labelClassName="text-text-strong-950 font-medium text-label-md"
              toggleSwitchAtTheEnd={true}
              // switchContainerClassName="border-subtle rounded-lg"
              title={t('lock_timezone_toggle_on_booking_page')}
              // {...lockTimeZoneToggleOnBookingPageLocked}
              description={t(
                'description_lock_timezone_toggle_on_booking_page'
              )}
              checked={value}
              onCheckedChange={(e) => onChange(e)}
              data-testid="lock-timezone-toggle"
            />
          )}
        />
        <Divider.Root />
        {/* <div className="p-4 flex items-center justify-between">
            <div>
              <h3 className="font-medium">Diferenciação por Cor para Tipos de Serviço</h3>
              <p className="text-paragraph-sm text-text-sub-600">
                Essa opção serve apenas para distinguir visualmente os tipos de serviço e agendamentos no sistema, sem ser exibida para quem agenda.
              </p>
            </div>
            <Switch.Root />
          </div> */}
      </div>
      {/* </div> */}
    </div>
  );
}
