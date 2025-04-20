import { redirect } from 'next/navigation';

export default function SignUpPage({ searchParams }: { searchParams: Record<string, string> }) {
  const queryString = new URLSearchParams(searchParams).toString();
  redirect(`/sign-up/email${queryString ? `?${queryString}` : ''}`);
}