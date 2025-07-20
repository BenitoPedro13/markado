import type { PageProps as _PageProps }from "@/app/_types";
import { cookies, headers } from "next/headers";
import { buildLegacyCtx } from "@/lib/buildLegacyCtx";
import { BookingStatus } from "~/prisma/enums";
import { generateMetadata as _generateMetadata } from "@/app/_utils";
import { withAppDirSsr } from "@/app/WithAppDirSsr";
import { WithLayout } from "@/app/layoutHOC";
import OldPage from "@/modules/bookings/views/bookings-single-view";
import { getServerSideProps, type PageProps } from "@/modules/bookings/views/bookings-single-view.getServerSideProps";

export const generateMetadata = async ({ params, searchParams }: _PageProps) => {
  const { bookingInfo, eventType, recurringBookings } = await getData(
    buildLegacyCtx(await headers(), await cookies(), params, searchParams)
  );
  const needsConfirmation = bookingInfo.status === BookingStatus.PENDING && eventType.requiresConfirmation;

  return await _generateMetadata(
    (t) =>
      t(`booking_${needsConfirmation ? "submitted" : "confirmed"}${recurringBookings ? "_recurring" : ""}`),
    (t) =>
      t(`booking_${needsConfirmation ? "submitted" : "confirmed"}${recurringBookings ? "_recurring" : ""}`)
  );
};

const getData = withAppDirSsr<PageProps>(getServerSideProps);

export default WithLayout({ getLayout: null, getData, Page: OldPage });
