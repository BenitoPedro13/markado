import { redirect } from 'next/navigation';

export default async function SignUpPage(props: { searchParams: Promise<Record<string, string>> }) {
  const searchParams = await props.searchParams;
  const queryString = new URLSearchParams(searchParams).toString();
  redirect(`/sign-up/email${queryString ? `?${queryString}` : ''}`);
}