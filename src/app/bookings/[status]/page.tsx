import { withAppDirSsg } from "@/app/WithAppDirSsg";
import { generateMetadata as _generateMetadata } from "@/app/_utils";
import { WithLayout } from "@/app/layoutHOC";
import type { InferGetStaticPropsType } from "next";

import { newValidStatuses } from "@/modules/bookings/lib/validStatuses";
import ListPage from "@/modules/bookings/views/bookings-listing-view";
import { getStaticProps } from "@/modules/bookings/views/bookings-listing-view.getStaticProps";

type Y = InferGetStaticPropsType<typeof getStaticProps>;
const getData = withAppDirSsg<Y>(getStaticProps);

export const generateMetadata = async () =>
  await _generateMetadata(
    (t) => t("bookings"),
    (t) => t("bookings_description")
  );

export const generateStaticParams = async () => {
  return newValidStatuses.map((status) => ({ status }));
};

export default WithLayout({ getLayout: null, getData, Page: ListPage })<"P">;

export const dynamic = "force-static";
