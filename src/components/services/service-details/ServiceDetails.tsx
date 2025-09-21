'use client';

import { Control, Controller, FormState, useForm, UseFormGetValues, UseFormSetValue } from 'react-hook-form';
import * as Input from '@/components/align-ui/ui/input';
import * as Textarea from '@/components/align-ui/ui/textarea';
import * as Button from '@/components/align-ui/ui/button';
import { Service, ServiceBadgeColor } from '@/types/service';
import * as Divider from '@/components/align-ui/ui/divider';
import { useCallback, useEffect, useRef, useState } from 'react';
import * as Select from '@/components/align-ui/ui/select';
import { useServicesDetails } from '@/contexts/services/servicesDetails/ServicesContext';
import { MARKADO_DOMAIN } from '@/constants';
import { LocationFormValues } from '@/packages/features/eventtypes/lib/types';
import Locations from "@/packages/features/eventtypes/components/Locations";
// Note: no in-person address preview here (moved to calendar cards)
import { SettingsToggle } from '@/packages/ui';
import { cn as classNames } from '@/utils/cn';
import { useLocale } from '@/hooks/use-locale';
import * as Label from '@/components/align-ui/ui/label';
import * as Hint from '@/components/align-ui/ui/hint';
import { RiErrorWarningFill } from '@remixicon/react';

type ServiceDetailsFormData = Pick<
  Service,
  | 'title'
  | 'description'
  | 'slug'
  | 'duration'
  | 'price'
  | 'location'
  | 'badgeColor'
>;

// Array com as opções de cores e seus emojis
const colorOptions: { value: ServiceBadgeColor; label: string }[] = [
  { value: 'faded', label: 'Cinza ⚫️' },
  { value: 'information', label: 'Azul 🔵' },
  { value: 'warning', label: 'Amarelo 🟡' },
  { value: 'error', label: 'Vermelho 🔴' },
  { value: 'success', label: 'Verde 🟢' },
  { value: 'away', label: 'Laranja 🟧' },
  { value: 'feature', label: 'Roxo 🟣' },
  { value: 'verified', label: 'Azul Céu 🔷' },
  { value: 'highlighted', label: 'Rosa 🎀' },
  { value: 'stable', label: 'Verde Água 🌊' }
];

type Props = {
  slug: string;
};

export default function ServiceDetails({ slug }: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const {
    queries: { initialMe, serviceDetails, locationOptions },
    ServicesDetailsForm: { register, formState, watch, getValues, setValue, control }
  } = useServicesDetails();

  const { t } = useLocale();

  const [priceVisible, setPriceVisible] = useState(
    !!getValues('price')
  );
  const [stripeStatus, setStripeStatus] = useState<{
    connected: boolean;
    loading: boolean;
    error: string | null;
  }>({ connected: false, loading: true, error: null });
  const [isConnectingStripe, setIsConnectingStripe] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchStripeStatus = async () => {
      try {
        if (isMounted) {
          setStripeStatus((prev) => ({ ...prev, loading: true, error: null }));
        }

        const response = await fetch('/api/integrations/stripepayment/status', {
          cache: 'no-store'
        });

        if (!isMounted) return;

        if (!response.ok) {
          if (response.status === 401) {
            setStripeStatus({ connected: false, loading: false, error: null });
            return;
          }

          const body = await response.json().catch(() => null);
          const message = body?.message || `Erro ao carregar status da Stripe (${response.status})`;
          throw new Error(message);
        }

        const data = await response.json();
        if (!isMounted) return;

        setStripeStatus({
          connected: Boolean(data?.connected),
          loading: false,
          error: null
        });
      } catch (error) {
        if (!isMounted) return;
        console.error(error);
        setStripeStatus({
          connected: false,
          loading: false,
          error:
            error instanceof Error
              ? error.message
              : 'Não foi possível carregar o status da Stripe.'
        });
      }
    };

    void fetchStripeStatus();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleConnectStripe = useCallback(async () => {
    try {
      setStripeStatus((prev) => ({ ...prev, error: null }));
      setIsConnectingStripe(true);

      const statePayload = {
        returnTo: window.location.href,
        onErrorReturnTo: window.location.href,
        fromApp: false
      };

      const response = await fetch(
        `/api/integrations/stripepayment/add?state=${encodeURIComponent(
          JSON.stringify(statePayload)
        )}`
      );

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        const message = body?.message || 'Não foi possível iniciar a conexão com a Stripe.';
        throw new Error(message);
      }

      const data = await response.json();
      if (data?.url) {
        window.location.href = data.url as string;
        return;
      }

      throw new Error('Resposta inesperada ao iniciar a conexão com a Stripe.');
    } catch (error) {
      console.error(error);
      setStripeStatus((prev) => ({
        ...prev,
        loading: false,
        error:
          error instanceof Error
            ? error.message
            : 'Não foi possível iniciar a conexão com a Stripe.'
      }));
    } finally {
      setIsConnectingStripe(false);
    }
  }, []);

  const isStripeConnected = stripeStatus.connected;
  // const service = services.find((s) => s.slug === slug);

  // Carrega os dados do serviço atual
  // useEffect(() => {
  //   if (service) {
  //     setValue('name', service.);
  //     setValue('slug', service.slug);
  //     setValue('duration', service.duration);
  //     setValue('price', service.price);
  //     setValue('badgeColor', service.badgeColor);
  //     setValue('description', service.description || '');
  //     setValue('location', service.location || '');
  //   }
  // }, [slug, setValue, service]);

  // const onSubmit = async (data: ServiceDetailsFormData) => {
  //   try {
  //     const serviceIndex = services.findIndex(
  //       (service) => service.slug === slug
  //     );

  //     if (serviceIndex !== -1) {
  //       services[serviceIndex] = {
  //         ...services[serviceIndex],
  //         ...data,
  //         price: Number(data.price),
  //         duration: Number(data.duration)
  //       };

  //       // console.log('Serviço atualizado:', services[serviceIndex]);
  //       alert('Serviço atualizado com sucesso!');
  //     }
  //   } catch (error) {
  //     console.error('Erro ao atualizar serviço:', error);
  //     alert('Erro ao atualizar serviço. Tente novamente.');
  //   }
  // };

  // Expõe a função de submit para o componente pai
  // useEffect(() => {
  //   const submitForm = () => {
  //     formRef.current?.requestSubmit();
  //   };

  //   // Adiciona ao objeto window para que o Header possa acessar
  //   (window as any).submitServiceForm = submitForm;

  //   return () => {
  //     delete (window as any).submitServiceForm;
  //   };
  // }, []);

  // // console.log('Localizações:', watch('locations')); // Apenas para debug

  return (
    <form
      ref={formRef}
      // onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
      <div className="space-y-4">
        <div className="text-title-h6">Geral</div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-text-strong-950">
            Título do Serviço
          </label>
          <Input.Root>
            <Input.Input
              {...register('name')}
              placeholder="Ex: Consulta de Marketing"
            />
          </Input.Root>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-text-strong-950">
            Descrição
          </label>
          <Textarea.Root
            placeholder="Descreva seu serviço..."
            {...register('description')}
          >
            <Textarea.CharCounter
              current={watch('description')?.length || 0}
              max={500}
            />
          </Textarea.Root>
        </div>

        <div className="flex gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-text-strong-950">
              Link do Serviço
            </label>
            <Input.Root>
              <Input.Affix>{`${MARKADO_DOMAIN}/${initialMe?.username}`}</Input.Affix>
              <Input.Input
                {...register('slug')}
                placeholder="consulta-marketing"
              />
            </Input.Root>
            <span className="text-paragraph-xs text-text-sub-600">
              Este será o link usado para compartilhar seu serviço
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-text-strong-950">
              Cor do Serviço
            </label>
            <Select.Root
              defaultValue={getValues('badgeColor')}
              {...register('badgeColor')}
              // value={watch('badgeColor')}
              onValueChange={(value: string) => {
                setValue('badgeColor', value as ServiceBadgeColor);
              }}
            >
              <Select.Trigger className="w-full">
                <Select.Value placeholder="Selecione uma cor" />
              </Select.Trigger>
              <Select.Content>
                {colorOptions.map((color) => (
                  <Select.Item key={color.value} value={color.value}>
                    {color.label}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
            <span className="text-paragraph-xs text-text-sub-600">
              Esta cor será usada para identificar visualmente o serviço
            </span>
          </div>
        </div>

        <Divider.Root />
        <div className="text-title-h6">Dados do Serviço</div>
        <div className="grid gap-4">
          <div className="flex flex-col gap-3 rounded-lg border border-bg-soft-200 bg-bg-white-0 p-4 shadow-regular-xs">
            <div>
              <p className="text-sm font-medium text-text-strong-950">
                Pagamentos com Stripe
              </p>
              <p className="text-paragraph-xs text-text-sub-600">
                Conecte sua conta Stripe para habilitar a cobrança deste serviço.
              </p>
            </div>

            {stripeStatus.error && (
              <Hint.Root className="flex items-start gap-2 text-error-base">
                <Hint.Icon as={RiErrorWarningFill} className="text-error-base" />
                <span className="text-paragraph-xs">{stripeStatus.error}</span>
              </Hint.Root>
            )}

            <div className="flex items-center gap-2">
              <Button.Root
                variant={isStripeConnected ? 'neutral' : 'primary'}
                mode={isStripeConnected ? 'ghost' : 'filled'}
                size="small"
                disabled={isStripeConnected || stripeStatus.loading || isConnectingStripe}
                onClick={handleConnectStripe}
              >
                {stripeStatus.loading
                  ? 'Verificando...'
                  : isStripeConnected
                    ? 'Stripe conectada'
                    : isConnectingStripe
                      ? 'Conectando...'
                      : 'Conectar Stripe'}
              </Button.Root>
              {isStripeConnected && (
                <span className="text-label-xs text-green-700">Pronto para receber pagamentos</span>
              )}
            </div>
          </div>

          <Controller
            name="price"
            render={({ field: { value, onChange } }) => (
              <>
                <SettingsToggle
                  labelClassName="text-text-strong-950 font-medium text-label-md"
                  toggleSwitchAtTheEnd={true}
                  switchContainerClassName={classNames(
                    'border-subtle rounded-lg',
                    priceVisible && 'rounded-b-none'
                  )}
                  childrenClassName="lg:ml-0"
                  title={t('service_price_title')}
                  description={
                    isStripeConnected
                      ? t('service_price_description')
                      : 'Conecte a Stripe para definir um valor para este serviço.'
                  }
                  checked={priceVisible && isStripeConnected}
                  disabled={!isStripeConnected || stripeStatus.loading}
                  onCheckedChange={(e) => {
                    if (!isStripeConnected) return;
                    setPriceVisible(e);
                    onChange(e ? value : '');
                  }}
                >
                  <div className="border-subtle border-t-0 pt-4">
                    <Label.Root className="mb-1 text-sm font-medium text-text-strong-950">Preço (R$)</Label.Root>
                    <Input.Root>
                      <Input.Input
                        type="number"
                        {...register('price')}
                        placeholder="100.00"
                        step="0.01"
                        required={priceVisible && isStripeConnected}
                        disabled={!isStripeConnected}
                      />
                    </Input.Root>
                    {/* <Hint.Root
                      className={classNames(
                        'text-error-base  gap-1 mt-1',
                        getValues('price') ? 'flex' : 'hidden'
                      )}
                    >
                      <Hint.Icon
                        as={RiErrorWarningFill}
                        className="text-error-base"
                      />

                      {t('redirect_url_warning')}
                    </Hint.Root> */}
                  </div>
                </SettingsToggle>
              </>
            )}
          />
          <Divider.Root />
          
          <div className="w-full flex flex-col gap-2">
            <label className="text-sm font-medium text-text-strong-950">
              Duração (minutos)
            </label>
            <Input.Root>
              <Input.Input
                type="number"
                {...register('duration')}
                placeholder="60"
              />
            </Input.Root>
          </div>

          <Divider.Root />
          
          
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-text-strong-950">
            Localização
          </label>
          {/* Address preview intentionally removed per request */}
          <Controller
            name="locations"
            control={control}
            defaultValue={serviceDetails.locations || []}
            render={() => (
              <Locations
                showAppStoreLink={false}
                team={null}
                destinationCalendar={serviceDetails?.destinationCalendar || null}
                eventType={serviceDetails}
                locationOptions={locationOptions}
                // isChildrenManagedEventType={isChildrenManagedEventType}
                // isManagedEventType={isManagedEventType}
                // disableLocationProp={shouldLockDisableProps("locations").disabled}
                isChildrenManagedEventType={false}
                isManagedEventType={false}
                disableLocationProp={false}
                getValues={getValues as unknown as UseFormGetValues<LocationFormValues>}
                setValue={setValue as unknown as UseFormSetValue<LocationFormValues>}
                control={control as unknown as Control<LocationFormValues>}
                formState={formState as unknown as FormState<LocationFormValues>}
              // {...props}
              />
            )}
          />
        </div>
      </div>
    </form>
  );
}
