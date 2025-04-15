import * as Button from '@/components/align-ui/ui/button';
import { signOut } from './auth-actions';
import { useFormStatus } from 'react-dom';

function SignOutButton() {
  const { pending } = useFormStatus();
  
  return (
    <Button.Root variant="error" type="submit" size='small' disabled={pending}>
      {pending ? 'Signing out...' : 'Sign out'}
    </Button.Root>
  );
}

export default function SignOut() {
  return (
    <form action={signOut}>
      <SignOutButton />
    </form>
  );
} 