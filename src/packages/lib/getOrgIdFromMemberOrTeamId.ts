import {prisma} from "@/lib/prisma";

export default async function getOrgIdFromMemberOrTeamId(args: {
  memberId?: string | null;
  teamId?: number | null;
}) {
  const userId = args.memberId ?? '';
  const teamId = args.teamId ?? 0;

  const orgId = await prisma.team.findFirst({
    where: {
      OR: [
        {
          AND: [
            {
              members: {
                some: {
                  userId,
                  accepted: true,
                },
              },
            },
            {
              isOrganization: true,
            },
          ],
        },
        {
          AND: [
            {
              children: {
                some: {
                  id: teamId,
                },
              },
            },
            {
              isOrganization: true,
            },
          ],
        },
      ],
    },
    select: {
      id: true,
    },
  });
  return orgId?.id;
}
