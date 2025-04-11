"use server";

import {signIn} from '@/auth';
import * as SocialButton from '@/components/align-ui/ui/social-button';
export default async function SignIn() {
  return (
    <form
      action={await signIn('google')}
    >
      <SocialButton.Root brand="google" type="submit" >a</SocialButton.Root>
    </form>
  );
}
