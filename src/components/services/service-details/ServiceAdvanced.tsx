'use client';

import * as Switch from '@/components/align-ui/ui/switch';
import * as Button from '@/components/align-ui/ui/button';
import * as Divider from '@/components/align-ui/ui/divider';

type Props = {
  slug: string;
};

import * as RadioGroup from '@radix-ui/react-radio-group';
import type {UnitTypeLongPlural} from 'dayjs';
// import {Trans} from 'next-i18next';
import type {Dispatch, SetStateAction} from 'react';
import {useEffect, useState} from 'react';
import {Controller, useFormContext} from 'react-hook-form';
import type z from 'zod';

import useLockedFieldsManager from '@/features/core/managed-event-types/hooks/useLockedFieldsManager';
import type {EventTypeSetup} from '@/features/eventtypes/lib/types';
import type {FormValues} from '@/features/eventtypes/lib/types';
import {cn as classNames} from '@/utils/cn';
import {useLocale} from '@/hooks/use-locale';
import type {EventTypeMetaDataSchema} from '~/prisma/zod-utils';
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
  const formMethods = useFormContext<FormValues>();

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

  const {shouldLockDisableProps} = useLockedFieldsManager({
    eventType,
    translate: t,
    formMethods
  });
  const requiresConfirmationLockedProps = shouldLockDisableProps(
    'requiresConfirmation'
  );

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
              labelClassName="text-sm"
              toggleSwitchAtTheEnd={true}
              switchContainerClassName={classNames(
                // "py-6 px-4 sm:px-6",
                requiresConfirmation && 'rounded-b-none'
              )}
              childrenClassName="lg:ml-0"
              title={t('requires_confirmation')}
              data-testid="requires-confirmation"
              disabled={
                seatsEnabled || requiresConfirmationLockedProps.disabled
              }
              tooltip={
                seatsEnabled
                  ? t('seat_options_doesnt_support_confirmation')
                  : undefined
              }
              description={t('requires_confirmation_description')}
              checked={requiresConfirmation}
              LockedIcon={requiresConfirmationLockedProps.LockedIcon}
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
                <RadioGroup.Root
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
                    {(requiresConfirmationSetup === undefined ||
                      !requiresConfirmationLockedProps.disabled) && (
                      <RadioField
                        label={t('always_requires_confirmation')}
                        disabled={requiresConfirmationLockedProps.disabled}
                        id="always"
                        value="always"
                      />
                    )}
                    {(requiresConfirmationSetup !== undefined ||
                      !requiresConfirmationLockedProps.disabled) && (
                      <>
                        <RadioField
                          disabled={requiresConfirmationLockedProps.disabled}
                          className="items-center"
                          label={
                            <>
                              <Trans
                                i18nKey="when_booked_with_less_than_notice"
                                defaults="When booked with less than <time></time> notice"
                                components={{
                                  time: (
                                    <div className="mx-2 inline-flex">
                                      <Input
                                        type="number"
                                        min={1}
                                        disabled={
                                          requiresConfirmationLockedProps.disabled
                                        }
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
                                        className="border-default !m-0 block w-16 rounded-r-none border-r-0 text-sm [appearance:textfield] focus:z-10 focus:border-r"
                                        defaultValue={
                                          metadata
                                            ?.requiresConfirmationThreshold
                                            ?.time || 30
                                        }
                                      />
                                      <label
                                        className={classNames(
                                          requiresConfirmationLockedProps.disabled &&
                                            'cursor-not-allowed'
                                        )}
                                      >
                                        <Select
                                          inputId="notice"
                                          options={options}
                                          isSearchable={false}
                                          isDisabled={
                                            requiresConfirmationLockedProps.disabled
                                          }
                                          innerClassNames={{
                                            control: 'rounded-l-none bg-subtle'
                                          }}
                                          onChange={(opt) => {
                                            setRequiresConfirmationSetup({
                                              time:
                                                requiresConfirmationSetup?.time ??
                                                defaultRequiresConfirmationSetup.time,
                                              unit: opt?.value as UnitTypeLongPlural
                                            });
                                            formMethods.setValue(
                                              'metadata.requiresConfirmationThreshold.unit',
                                              opt?.value as UnitTypeLongPlural,
                                              {shouldDirty: true}
                                            );
                                          }}
                                          defaultValue={defaultValue}
                                        />
                                      </label>
                                    </div>
                                  )
                                }}
                              />
                            </>
                          }
                          id="notice"
                          value="notice"
                        />
                        <CheckboxField
                          checked={requiresConfirmationWillBlockSlot}
                          descriptionAsLabel
                          description={t(
                            'requires_confirmation_will_block_slot_description'
                          )}
                          onChange={(e) => {
                            // We set should dirty to properly detect when we can submit the form
                            formMethods.setValue(
                              'requiresConfirmationWillBlockSlot',
                              e.target.checked,
                              {
                                shouldDirty: true
                              }
                            );
                          }}
                        />
                      </>
                    )}
                  </div>
                </RadioGroup.Root>
              </div>
            </SettingsToggle>
          )}
        />
      </div>
    </div>
  );
}


export default function ServiceAdvanced({slug}: Props) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implementar atualização das configurações avançadas
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="space-y-4">
        <div className="flex flex-col">
          <div className="text-title-h6">Configurações Avançadas</div>
          <div className="text-paragraph-sm text-text-sub-600">
            Personalize as configurações avançadas do serviço
          </div>
        </div>
        <div className="border border-stroke-soft-200 rounded-lg ">
          
          <div className="p-4 flex items-center justify-between">
            <div>
              <h3 className="font-medium">Necessita de Confirmação Manual</h3>
              <p className="text-paragraph-sm text-text-sub-600">
                A reserva exige uma confirmação manual antes de ser enviada para integrações e para o envio de um e-mail de confirmação ao usuário.
              </p>
            </div>
            <Switch.Root />
          </div>

          <Divider.Root />
          <div className="p-4 flex items-center justify-between">
            <div>
              <h3 className="font-medium">Redirecionamento pós-reserva</h3>
              <p className="text-paragraph-sm text-text-sub-600">
                Defina uma URL específica para a qual o usuário será direcionado logo após concluir uma reserva
              </p>
            </div>
            <Switch.Root defaultChecked />
          </div>
          <Divider.Root />
          <div className="p-4 flex items-center justify-between">
            <div>
              <h3 className="font-medium">Fixar Fuso Horário na Página de Reservas</h3>
              <p className="text-paragraph-sm text-text-sub-600">
                Manter o fuso horário fixo na página de reservas, ideal para eventos que exigem a presença física.
              </p>
            </div>
            <Switch.Root defaultChecked />
          </div>
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
      </div>

      
    </form>
  );
}
