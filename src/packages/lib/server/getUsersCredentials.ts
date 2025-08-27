import { prisma } from "@/lib/prisma";
import { credentialForCalendarServiceSelect } from "~/prisma/selects/credential";
import type { TrpcSessionUser } from "~/trpc/server/trpc";

type SessionUser = NonNullable<TrpcSessionUser>;
type User = { id: SessionUser["id"] };

export async function getUsersCredentials(user: User) {
  const credentials = await prisma.credential.findMany({
    where: {
      userId: user.id,
    },
    select: credentialForCalendarServiceSelect,
    orderBy: {
      id: "asc",
    },
  });
  return credentials;
}
