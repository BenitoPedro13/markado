import NextAuth from 'next-auth';
import {PrismaAdapter} from '@auth/prisma-adapter';
import Google from 'next-auth/providers/google';

import { prisma } from '@/lib/prisma';

export const {handlers, signIn, signOut, auth} = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {strategy: 'jwt'},
  providers: [Google],
  callbacks: {
    jwt({token, user}) {
      if (user) {
        // User is available during sign-in
        token.id = user.id;
      }
      return token;
    },
    session({session, token}) {
      session.user.id = token.id;
      return session;
    }
  }
});
