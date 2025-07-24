import setDefaultConferencingApp from '@/packages/app-store/_utils/setDefaultConferencingApp';

// import type { TrpcSessionUser } from "../../../trpc";
import type {TSetDefaultConferencingAppSchema} from '~/trpc/server/handlers/setDefaultConferencingApp.schema';

type SetDefaultConferencingAppOptions = {
  input: TSetDefaultConferencingAppSchema;
};

export const setDefaultConferencingAppHandler = async ({
  input
}: SetDefaultConferencingAppOptions) => {
  const session = await auth();

  if (!session || !session.user.id) {
    return;
  }

  return await setDefaultConferencingApp(session.user.id, input.slug);
};
