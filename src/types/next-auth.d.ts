import "next-auth";
import {User} from '~/prisma/app/generated/prisma/client';

declare module "next-auth" {
  interface Session {
    user: User
  }
} 