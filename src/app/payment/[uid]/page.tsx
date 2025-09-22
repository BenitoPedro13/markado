import { withAppDirSsr } from "@/app/WithAppDirSsr";
import { generateMetadata as _generateMetadata } from "@/app/_utils";
import { WithLayout } from "@/app/layoutHOC";

import PaymentPage from "@/packages/core/payments/components/PaymentPage";
import { getServerSideProps, type PaymentPageProps } from "@/packages/core/payments/pages/payment";

export const generateMetadata = async () =>
  await _generateMetadata(
    // the title does not contain the eventName as in the legacy page
    (t) => `${t("payment")}`,
    () => ""
  );

const getData = withAppDirSsr<PaymentPageProps>(getServerSideProps);

export default WithLayout({ getLayout: null, getData, Page: PaymentPage });
