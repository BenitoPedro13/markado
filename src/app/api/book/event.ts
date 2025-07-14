import type { NextApiRequest, NextApiResponse } from "next";

// import { getServerSession } from "@/packages/features/auth/lib/getServerSession";
import handleNewBooking from "@/packages/features/bookings/lib/handleNewBooking";
// import { checkRateLimitAndThrowError } from "@/packages/lib/checkRateLimitAndThrowError";
// import getIP from "@/packages/lib/getIP";
import { defaultResponder } from "@/packages/lib/server";
import { auth } from "@/auth";

async function handler(req: NextApiRequest & { userId?: string }, res: NextApiResponse) {
  // const userIp = getIP(req);

  // await checkRateLimitAndThrowError({
  //   rateLimitingType: "core",
  //   identifier: userIp,
  // });

  // const session = await getServerSession({ req, res });
  const session = await auth()
  /* To mimic API behavior and comply with types */
  req.userId = session?.user?.id || "0";
  const booking = await handleNewBooking(req);
  return booking;
}

export default defaultResponder(handler);
