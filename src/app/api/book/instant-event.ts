// import type { NextApiRequest, NextApiResponse } from "next";

// import { getServerSession } from "@/features/auth/lib/getServerSession";
// import handleInstantMeeting from "@/features/instant-meeting/handleInstantMeeting";
// import { checkRateLimitAndThrowError } from "@/lib/checkRateLimitAndThrowError";
// import getIP from "@/lib/getIP";
// import { defaultResponder } from "@/lib/server";

// async function handler(req: NextApiRequest & { userId?: number }, res: NextApiResponse) {
//   const userIp = getIP(req);

//   await checkRateLimitAndThrowError({
//     rateLimitingType: "core",
//     identifier: `instant.event-${userIp}`,
//   });

//   const session = await getServerSession({ req, res });
//   req.userId = session?.user?.id || -1;
//   const booking = await handleInstantMeeting(req);
//   return booking;
// }
// export default defaultResponder(handler);
