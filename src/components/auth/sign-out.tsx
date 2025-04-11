import * as Button from '@/components/align-ui/ui/button';

import {signOut} from './auth-actions';

export default function SignOut() {
  return (
    <form action={signOut}>
      <Button.Root variant="error" type="submit" size='small'>
        Sign out
      </Button.Root>
    </form>
  );
} 