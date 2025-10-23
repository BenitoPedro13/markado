import { HttpError } from "@/packages/lib/http-error";
import {UserRepository} from '@/repositories/user';

export const throwIfNotHaveAdminAccessToTeam = async ({
  teamId,
  userId,
}: {
  teamId: number | null;
  userId: string;
}) => {
  if (!teamId) {
    return;
  }
  const userAdminTeams = await UserRepository.getUserAdminTeams(userId);
  const teamsUserHasAdminAccessFor = userAdminTeams?.teams?.map(({ team }) => team.id) ?? [];
  const hasAdminAccessToTeam = teamsUserHasAdminAccessFor.some((id) => id === teamId);

  if (!hasAdminAccessToTeam) {
    throw new HttpError({ statusCode: 401, message: "You must be an admin of the team to do this" });
  }
};
