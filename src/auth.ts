import NextAuth from 'next-auth';
import {PrismaAdapter} from '@auth/prisma-adapter';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import { verify } from '@node-rs/argon2';

import { prisma } from '@/lib/prisma';

export const {handlers, signIn, signOut, auth} = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {strategy: 'jwt'},
  providers: [
    Google,
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
          include: { password: true }
        });

        if (!user) {
          return null;
        }

        // Check if email is verified
        if (!user.emailVerified) {
          throw new Error('Please verify your email before signing in');
        }

        // Check if this is a one-time login token
        const verificationToken = await prisma.verificationToken.findUnique({
          where: {
            identifier_token: {
              identifier: credentials.email as string,
              token: credentials.password as string
            }
          }
        });

        if (verificationToken) {
          // This is a one-time login token, delete it and allow login
          await prisma.verificationToken.delete({
            where: {
              identifier_token: {
                identifier: credentials.email as string,
                token: credentials.password as string
              }
            }
          });
          return user;
        }

        // Regular password check
        if (!user.password) {
          return null;
        }

        const isPasswordValid = await verify(
          user.password.hash,
          credentials.password as string
        );

        if (!isPasswordValid) {
          return null;
        }

        return user
      }
    })
  ],
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
