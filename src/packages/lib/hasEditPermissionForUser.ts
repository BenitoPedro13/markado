import { auth } from '@/auth';
import {prisma} from '@/lib/prisma';
import {MembershipRole} from '~/prisma/enums';

type InputOptions = {
  input: {
    memberId: string;
  };
};

export async function hasEditPermissionForUserID({input}: InputOptions) {
  const session = await auth();

  if (!session) {
    throw new Error(
      'hasEditPermissionForUserID: Could not get the user session'
    );
  }

  if (!session.user) {
    throw new Error('hasEditPermissionForUserID: Not authenticated');
  }

  const authedUsersTeams = await prisma.membership.findMany({
    where: {
      userId: session.user.id,
      accepted: true,
      role: {
        in: [MembershipRole.ADMIN, MembershipRole.OWNER]
      }
    }
  });

  const targetUsersTeams = await prisma.membership.findMany({
    where: {
      userId: input.memberId,
      accepted: true
    }
  });

  const teamIdOverlaps = authedUsersTeams.some((authedTeam) => {
    return targetUsersTeams.some(
      (targetTeam) => targetTeam.teamId === authedTeam.teamId
    );
  });

  return teamIdOverlaps;
}

export async function hasReadPermissionsForUserId({
  userId,
  memberId
}: InputOptions['input'] & {userId: string}) {
  const authedUsersTeams = await prisma.membership.findMany({
    where: {
      userId,
      accepted: true
    }
  });

  const targetUsersTeams = await prisma.membership.findMany({
    where: {
      userId: memberId,
      accepted: true
    }
  });

  const teamIdOverlaps = authedUsersTeams.some((authedTeam) => {
    return targetUsersTeams.some(
      (targetTeam) => targetTeam.teamId === authedTeam.teamId
    );
  });

  return teamIdOverlaps;
}
