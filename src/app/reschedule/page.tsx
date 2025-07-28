import { redirect } from 'next/navigation';

export default function ReschedulePage() {
  // Redirects to the main page if someone accesses /reschedule without uid
  redirect('/');
} 