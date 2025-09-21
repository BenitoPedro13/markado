import type {Payment} from '~/prisma/app/generated/prisma/client';
import type {EventType} from '~/prisma/app/generated/prisma/client';
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe
} from '@stripe/react-stripe-js';
import type {StripeElementLocale, StripeElements} from '@stripe/stripe-js';
import {useRouter} from 'next/navigation';
import type {SyntheticEvent} from 'react';
import {useEffect, useState} from 'react';

import getStripe from '@/packages/app-store/stripepayment/lib/client';
import {useBookingSuccessRedirect} from '@/packages/lib/bookingSuccessRedirect';
import {useCompatSearchParams} from '@/packages/lib/hooks/useCompatSearchParams';
import {useLocale} from '@/hooks/use-locale';
import type {PaymentOption} from '~/prisma/enums';
// import {Button} from '@/packages/ui';
import {CheckboxField} from '@/packages/features/form-builder/FormBuilder';
import {formatPrice} from '@/packages/lib/price';
import '../../../../../apps/web/styles/globals.css';
import type {PaymentPageProps} from '../pages/payment';
import * as Button from '@/components/align-ui/ui/button';
export type Props = {
  payment: Omit<
    Payment,
    'id' | 'fee' | 'success' | 'refunded' | 'externalId' | 'data'
  > & {
    data: Record<string, unknown>;
  };
  eventType: {
    id: number;
    successRedirectUrl: EventType['successRedirectUrl'];
    forwardParamsSuccessRedirect: EventType['forwardParamsSuccessRedirect'];
  };
  user: {
    username: string | null;
  };
  location?: string | null;
  clientSecret: string;
  booking: PaymentPageProps['booking'];
};

export type States =
  | {
      status: 'idle';
    }
  | {
      status: 'processing';
    }
  | {
      status: 'error';
      error: Error;
    }
  | {
      status: 'ok';
    };

export const PaymentFormComponent = (
  props: Props & {
    onSubmit: (ev: SyntheticEvent) => void;
    onCancel: () => void;
    onPaymentElementChange: () => void;
    elements: StripeElements | null;
    paymentOption: PaymentOption | null;
    state: States;
  }
) => {
  const {t, i18n} = useLocale();
  const {paymentOption, elements, state, onPaymentElementChange} = props;
  const [isCanceling, setIsCanceling] = useState<boolean>(false);
  const [holdAcknowledged, setHoldAcknowledged] = useState<boolean>(
    paymentOption === 'HOLD' ? false : true
  );
  const holdFeeAmount = formatPrice(
    props.payment.amount,
    props.payment.currency,
    i18n.language
  );
  const disableButtons =
    isCanceling ||
    !holdAcknowledged ||
    ['processing', 'error'].includes(state.status);

  useEffect(() => {
    elements?.update({locale: i18n.language as StripeElementLocale});
  }, [elements, i18n.language]);

  return (
    <>
      <form
        id="payment-form"
        className="bg-white-0 mt-4 rounded-md p-0"
        onSubmit={props.onSubmit}
      >
        <div>
          <PaymentElement onChange={() => onPaymentElementChange()} />
        </div>
        {paymentOption === 'HOLD' && (
          <div className="bg-info mb-5 mt-2 rounded-md p-3">
            <CheckboxField
              description={t('acknowledge_booking_no_show_fee', {
                amount: holdFeeAmount
              })}
              onCheckedChange={(checked) => setHoldAcknowledged(checked)}
              // descriptionClassName="text-info font-semibold"
            />
          </div>
        )}
        <div className="mt-3 flex justify-end space-x-2">
          <Button.Root
            color="secondary"
            disabled={disableButtons || isCanceling}
            type="button"
            onClick={() => {
              setIsCanceling(true);
              props.onCancel();
            }}
            variant="error"
            mode='stroke'
          >
            <span id="button-text">{t('cancel')}</span>
          </Button.Root>
          <Button.Root
            type="submit"
            variant="primary"
            mode="filled"
            disabled={disableButtons || state.status === 'processing'}
          >
            <span id="button-text">
              {state.status === 'processing' ? (
                <div className="spinner" id="spinner" />
              ) : paymentOption === 'HOLD' ? (
                t('submit_card')
              ) : (
                t('pay_now')
              )}
            </span>
          </Button.Root>
        </div>
        {state.status === 'error' && (
          <div className="mt-4 text-center text-red-900" role="alert">
            {state.error.message}
          </div>
        )}
      </form>
    </>
  );
};

const PaymentForm = (props: Props) => {
  const {
    user: {username}
  } = props;
  const {t} = useLocale();
  const router = useRouter();
  const searchParams = useCompatSearchParams();
  const [state, setState] = useState<States>({status: 'idle'});
  const stripe = useStripe();
  const elements = useElements();
  const paymentOption = props.payment.paymentOption;
  const bookingSuccessRedirect = useBookingSuccessRedirect();

  const handleSubmit = async (ev: SyntheticEvent) => {
    ev.preventDefault();

    if (!stripe || !elements || searchParams === null) {
      return;
    }

    if (!stripe || !elements) {
      return;
    }

    setState({status: 'processing'});

    let payload;
    const params: {
      uid: string;
      email: string | null;
      location?: string;
      payment_intent?: string;
      payment_intent_client_secret?: string;
      redirect_status?: string;
    } = {
      uid: props.booking.uid,
      email: searchParams?.get('email')
    };
    if (paymentOption === 'HOLD' && 'setupIntent' in props.payment.data) {
      payload = await stripe.confirmSetup({
        elements,
        redirect: 'if_required'
      });
      if (payload.setupIntent) {
        params.payment_intent = payload.setupIntent.id;
        params.payment_intent_client_secret =
          payload.setupIntent.client_secret || undefined;
        params.redirect_status = payload.setupIntent.status;
      }
    } else if (paymentOption === 'ON_BOOKING') {
      payload = await stripe.confirmPayment({
        elements,
        redirect: 'if_required'
      });
      if (payload.paymentIntent) {
        params.payment_intent = payload.paymentIntent.id;
        params.payment_intent_client_secret =
          payload.paymentIntent.client_secret || undefined;
        params.redirect_status = payload.paymentIntent.status;
      }
    }

    if (payload?.error) {
      setState({
        status: 'error',
        error: new Error(`Payment failed: ${payload.error.message}`)
      });
    } else {
      if (props.location) {
        if (props.location.includes('integration')) {
          params.location = t('web_conferencing_details_to_follow');
        } else {
          params.location = props.location;
        }
      }

      return bookingSuccessRedirect({
        successRedirectUrl: props.eventType.successRedirectUrl,
        query: params,
        booking: props.booking,
        forwardParamsSuccessRedirect:
          props.eventType.forwardParamsSuccessRedirect
      });
    }
  };

  return (
    <PaymentFormComponent
      {...props}
      elements={elements}
      paymentOption={paymentOption}
      state={state}
      onSubmit={handleSubmit}
      onCancel={() => {
        if (username) {
          return router.push(`/${username}`);
        }
        return router.back();
      }}
      onPaymentElementChange={() => {
        setState({status: 'idle'});
      }}
    />
  );
};

export default function PaymentComponent(props: Props) {
  const stripePromise = getStripe(
    props.payment.data.stripe_publishable_key as any
  );

  const appearance: {
    theme: 'flat' | 'stripe' | 'night' | undefined;
  } & Record<string, any> = {
    theme: 'stripe',
    variables: {
      colorPrimary: '#0570de',
      colorBackground: '#ffffff',
      fontFamily: '"Plus Jakarta Sans", sans-serif'
    },
    rules: {
      '.Label': {
        color: 'var(--bg-strong-950, #171717)',
        /* Label/Small */
        fontSize: '14px',
        fontWeight: 500,
        lineHeight: '20px' /* 142.857% */,
        letterSpacing: '-0.084px'
      },
      '.Input': {
        display: 'flex',
        overflow: 'hidden',
        padding: '10px 10px 10px 12px',
        borderRadius: 'var(--radius-10, 10px)',
        border: '1px solid var(--stroke-soft-200, #E1E4EA)',
        boxShadow: '0px 1px 2px 0px rgba(10, 13, 20, 0.03)',
        background: 'var(--bg-white-0, #FFF)',
        alignItems: 'center',
        gap: '8px',
        alignSelf: 'stretch'
      }
    }
  };

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret: props.clientSecret,
        appearance
      }}
    >
      <PaymentForm {...props} />
    </Elements>
  );
}
