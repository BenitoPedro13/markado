import { ReactNode } from 'react';
import './globals.css';

type Props = {
  children: ReactNode;
};

/**
 * Layout required for all pages. NextJS stuff...
 */
export default function RootLayout({children}: Props) {
  return children;
}
