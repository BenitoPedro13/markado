import { UserFromSession } from "@/lib/getUserFromSession";
import { prisma } from "@/lib/prisma";
import {credentialForCalendarServiceSelect} from '@/repositories/selects/credentialsSelect';

type SessionUser = NonNullable<UserFromSession>;
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
