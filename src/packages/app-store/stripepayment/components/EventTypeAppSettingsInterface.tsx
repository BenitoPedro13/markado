import {useState, useEffect, type ChangeEvent} from 'react';

import type {EventTypeAppSettingsComponent} from '@/packages/app-store/types';
import {useLocale} from '@/hooks/use-locale';
import * as Select from '@/components/align-ui/ui/select';
import {TextField} from '@/components/align-ui/ui/text-field';
import {
  convertToSmallestCurrencyUnit,
  convertFromSmallestToPresentableCurrencyUnit
} from '../../_utils/payments/currencyConversions';
import {paymentOptions} from '../lib/constants';
import {currencyOptions} from '../lib/currencyOptions';

const EventTypeAppSettingsInterface: EventTypeAppSettingsComponent = ({
  getAppData,
  setAppData,
  disabled,
  eventType
}) => {
  const price = getAppData('price');

  const resolveSelectValue = (value: unknown, fallback: string) => {
    if (typeof value === 'string') return value;
    if (value && typeof value === 'object' && 'value' in value) {
      const optionValue = (value as {value?: unknown}).value;
      if (typeof optionValue === 'string') return optionValue;
    }
    return fallback;
  };

  const rawCurrency = resolveSelectValue(getAppData('currency'), currencyOptions[0].value);
  const normalizedCurrency = rawCurrency.toLowerCase();
  const [selectedCurrency, setSelectedCurrency] = useState(normalizedCurrency);
  const selectedCurrencyOption =
    currencyOptions.find((option) => option.value === selectedCurrency) ||
    currencyOptions[0];
  const currencyCode = selectedCurrencyOption.value.toUpperCase();

  const paymentOption = resolveSelectValue(getAppData('paymentOption'), paymentOptions[0].value);
  const [selectedPaymentOption, setSelectedPaymentOption] = useState(paymentOption);

  const paymentEnabledFlag = getAppData('enabled');
  const requirePayment =
    typeof paymentEnabledFlag === 'boolean'
      ? paymentEnabledFlag
      : typeof price === 'number' && price > 0;

  const {t} = useLocale();
  const recurringEventDefined = eventType.recurringEvent?.count !== undefined;
  const seatsEnabled = !!eventType.seatsPerTimeSlot;
  const getCurrencySymbol = (locale: string, currency: string) =>
    (0)
      .toLocaleString(locale, {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      })
      .replace(/\d/g, '')
      .trim();

  useEffect(() => {
    if (requirePayment) {
      if (!getAppData('currency')) {
        setAppData('currency', currencyOptions[0].value);
      }
      if (!getAppData('paymentOption')) {
        setAppData('paymentOption', paymentOptions[0].value);
      }
    }
  }, [requirePayment, getAppData, setAppData]);

  useEffect(() => {
    setSelectedCurrency(normalizedCurrency);
  }, [normalizedCurrency]);

  useEffect(() => {
    setSelectedPaymentOption(paymentOption);
  }, [paymentOption]);

  return (
    <>
      {!recurringEventDefined && requirePayment && (
        <>
          <div className="mt-4 block items-center justify-start sm:flex sm:space-x-2">
            <TextField
              data-testid="stripe-price-input"
              label={t('price')}
              className="h-[38px]"
              addOnLeading={<>{currencyCode ? getCurrencySymbol('en', currencyCode) : ''}</>}
              addOnSuffix={currencyCode}
              addOnClassname="h-[38px]"
              step="0.01"
              min="0.5"
              type="number"
              required
              placeholder="Price"
              disabled={disabled}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                const amount = Number(event.target.value);
                if (Number.isNaN(amount)) {
                  return;
                }
                setAppData(
                  'price',
                  convertToSmallestCurrencyUnit(amount, currencyCode)
                );
              }}
              value={
                typeof price === 'number' && price > 0
                  ? convertFromSmallestToPresentableCurrencyUnit(
                      price,
                      currencyCode
                    )
                  : undefined
              }
            />
          </div>

          <div className="mt-5 w-60">
            <label
              className="text-default mb-1 block text-sm font-medium"
              htmlFor="currency"
            >
              {t('currency')}
            </label>
            <Select.Root
              data-testid="stripe-currency-select"
              value={selectedCurrency}
              onValueChange={(value) => {
                setSelectedCurrency(value);
                setAppData('currency', value);
              }}
              disabled={disabled}
            >
              <Select.Trigger className="w-full">
                <Select.Value />
              </Select.Trigger>
              <Select.Content>
                {currencyOptions.map((option) => (
                  <Select.Item key={option.value} value={option.value}>
                    {option.label}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </div>
          <div className="mt-4 w-60">
            <label
              className="text-default mb-1 block text-sm font-medium"
              htmlFor="currency"
            >
              {t('payment_option')}
            </label>
            <Select.Root
              data-testid="stripe-payment-option-select"
              value={selectedPaymentOption}
              onValueChange={(value) => {
                setSelectedPaymentOption(value);
                setAppData('paymentOption', value);
              }}
              disabled={seatsEnabled || disabled}
            >
              <Select.Trigger className="w-full">
                <Select.Value />
              </Select.Trigger>
              <Select.Content>
                {paymentOptions.map((option) => (
                  <Select.Item key={option.value} value={option.value}>
                    {t(option.label) || option.label}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </div>
        </>
      )}
    </>
  );
};

export default EventTypeAppSettingsInterface;
