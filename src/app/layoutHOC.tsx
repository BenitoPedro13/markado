//import type { LayoutProps, PageProps } from "app/_types";
import { buildLegacyCtx } from "@/lib/buildLegacyCtx";
import { type GetServerSidePropsContext } from "next";
import { cookies, headers } from "next/headers";
import { LayoutProps, PageProps } from "./_types";
import PageWrapper from "@/components/PageWrapperAppDir";
import { getMessages } from "next-intl/server";
import { routing } from "@/i18n/routing";

// import { buildLegacyCtx } from "@lib/buildLegacyCtx";

// import PageWrapper from "@components/PageWrapperAppDir";

type WithLayoutParams<T extends Record<string, any>> = {
  getLayout?: ((page: React.ReactElement) => React.ReactNode) | null;
  getServerLayout?: (page: React.ReactElement) => Promise<React.ReactNode | null>;
  Page?: (props: T) => React.ReactElement | null;
  ServerPage?: (props: T) => Promise<React.ReactElement> | null;
  getData?: (arg: GetServerSidePropsContext) => Promise<T | undefined>;
  isBookingPage?: boolean;
  requiresLicense?: boolean;
};

export function WithLayout<T extends Record<string, any>>({
  getLayout,
  getServerLayout,
  getData,
  ServerPage,
  Page,
  isBookingPage,
  requiresLicense,
}: WithLayoutParams<T>) {
  // eslint-disable-next-line react/display-name
  return async <P extends "P" | "L">(p: P extends "P" ? PageProps : LayoutProps) => {
    const h = await headers();
    const c = await cookies();
    const nonce = h.get("x-nonce") ?? undefined;
    let props = {} as T;

    // Get locale and messages for translations
    const locale = c.get('NEXT_LOCALE')?.value || routing.defaultLocale;
    const messages = await getMessages({ locale });

    if ("searchParams" in p && getData) {
      props = (await getData(buildLegacyCtx(h, c, p.params, p.searchParams))) ?? ({} as T);
    }

    // `p.children` exists only for layout.tsx files
    const childrenFromLayoutFile = "children" in p ? p.children : null;
    const page = ServerPage ? (
      await ServerPage({ ...props, ...p })
    ) : Page ? (
      <Page {...props} />
    ) : (
      childrenFromLayoutFile
    );
    const pageWithServerLayout = page ? (getServerLayout ? await getServerLayout(page) : page) : null;

    return (
      <PageWrapper
        getLayout={getLayout}
        requiresLicense={requiresLicense || !!(Page && "requiresLicense" in Page && Page.requiresLicense)}
        nonce={nonce}
        themeBasis={null}
        isThemeSupported={Page && "isThemeSupported" in Page ? (Page.isThemeSupported as boolean) : undefined}
        isBookingPage={isBookingPage || !!(Page && "isBookingPage" in Page && Page.isBookingPage)}
        messages={messages}
        locale={locale}
        {...props}>
        {pageWithServerLayout}
      </PageWrapper>
    );
  };
}
