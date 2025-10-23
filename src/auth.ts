import NextAuth from 'next-auth';
import {PrismaAdapter} from '@auth/prisma-adapter';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

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

        // Check if email is verified; return null to avoid throwing
        // and let the client show a friendly error message.
        if (!user.emailVerified) {
          return null;
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

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password.hash
        );

        if (!isPasswordValid) {
          return null;
        }

        return user
      }
    })
  ],
  pages: {
    signIn: '/sign-in',
    signOut: '/logout',
    error: '/sign-in',
  },
  callbacks: {
    async signIn({ user, account, profile, email }) {
      // Allow sign-in with credentials provider
      if (account?.provider === 'credentials') {
        return true;
      }

      // For OAuth providers, check if the email already exists
      if (account?.provider && profile?.email) {
        try {
          // First, check if we have an account with this provider and ID
          const existingAccount = await prisma.account.findFirst({
            where: {
              provider: account.provider,
              providerAccountId: account.providerAccountId,
            },
            include: {
              user: true,
            },
          });

          // If we already have an account with this provider ID, we're good to go
          if (existingAccount) {
            return true;
          }

          // Next, check if we have a user with the same email
          const existingUserWithEmail = await prisma.user.findUnique({
            where: { email: profile.email },
            include: { accounts: true },
          });

          // If we found a user with this email...
          if (existingUserWithEmail) {
            // Instead of checking provider accounts, let's link this OAuth account to the existing user
            // This will solve the "OAuthAccountNotLinked" error
            
            // Create a new account linked to the existing user
            await prisma.account.create({
              data: {
                userId: existingUserWithEmail.id,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                access_token: account.access_token,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
                refresh_token: account.refresh_token,
              },
            });
            
            return true;
          }
          
          // If no existing user, allow standard signup flow to continue
          return true;
        } catch (error) {
          console.error('Error in OAuth account linking:', error);
          return `/sign-in?error=AccountLinkingFailed`;
        }
      }

      return true;
    },
    jwt({token, user}) {
      if (user) {
        // User is available during sign-in
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      // Only set session.user.id if it doesn't exist
      if (token && session.user && !session.user.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
    redirect({ url, baseUrl }) {
      // If the url is the sign-out page, redirect to sign-in
      if (url.includes('/sign-in') && url !== `${baseUrl}/sign-in`) {
        return `${baseUrl}/sign-in`;
      }

      // If signing in, check if onboarding is complete
      if (url === `${baseUrl}/sign-in` || url === baseUrl) {
        // We'll redirect to the homepage which has logic to redirect to personal if needed
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
