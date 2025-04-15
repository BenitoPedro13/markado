import "next-auth";
import { User } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: Pick<User, "id" | "email" | "name" | "image">
  }
} 