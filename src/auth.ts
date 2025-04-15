import NextAuth from 'next-auth';
import {PrismaAdapter} from '@auth/prisma-adapter';
import Google from 'next-auth/providers/google';

import { prisma } from '@/lib/prisma';

export const {handlers, signIn, signOut, auth} = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {strategy: 'jwt'},
  providers: [Google],
  pages: {
    signIn: '/pt/sign-in',
    signOut: '/pt/sign-in',
  },
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
    },
    redirect({ url, baseUrl }) {
      // If the url is the sign-out page, redirect to sign-in
      if (url.includes('/pt/sign-in') && url !== `${baseUrl}/pt/sign-in`) {
        return `${baseUrl}/pt/sign-in`;
      }

      // If signing in, redirect to home
      if (url === `${baseUrl}/pt/sign-in`) {
        return baseUrl;
      }

      // Allows relative callback URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`;

      // Allows callback URLs on the same origin
      if (new URL(url).origin === baseUrl) return url;

      return baseUrl;
    }
  }
});
