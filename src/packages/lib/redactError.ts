import { Prisma } from "~/prisma/app/generated/prisma/client";

import { IS_PRODUCTION } from "@/constants";

function shouldRedact<T extends Error>(error: T) {
  return (
    error instanceof Prisma.PrismaClientInitializationError ||
    error instanceof Prisma.PrismaClientKnownRequestError ||
    error instanceof Prisma.PrismaClientUnknownRequestError ||
    error instanceof Prisma.PrismaClientValidationError
  );
}

export const redactError = <T extends Error | unknown>(error: T) => {
  if (!(error instanceof Error)) {
    return error;
  }
  console.debug("Type of Error: ", error.constructor);
  if (shouldRedact(error) && IS_PRODUCTION) {
    console.error("Error: ", JSON.stringify(error));
    return new Error("An error occured while querying the database.");
  }
  return error;
};
