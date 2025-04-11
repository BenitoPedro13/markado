// eslint-disable-next-line @typescript-eslint/no-unused-vars
import 'react';
import en from './messages/pt.json';

declare module 'react' {
  interface CSSProperties {
    [key: `--${string}`]: string | number;
  }
}

type Messages = typeof en;
declare global {
  // Use type safe message keys with `next-intl`
  interface IntlMessages extends Messages {}
}
