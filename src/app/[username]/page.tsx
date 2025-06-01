import ServicesSchedulingForm from '@/modules/scheduling/services/ServicesSchedulingForm';
import {
  getHostUserByUsername
  // getUserByUsernameHandler
} from '~/trpc/server/handlers/user.handler';
import {UserProfile} from '@/types/UserProfile';
import type {EventTypeMetaDataSchema} from '~/prisma/zod-utils';
import {
  // RedirectType,
  type EventType,
  type User
} from '~/prisma/app/generated/prisma/client';
import {z} from 'zod';
import {UserRepository} from '@/repositories/user';
import {getUsernameList} from '@/packages/lib/defaultEvents';
import {markdownToSafeHTML} from '@/packages/lib/markdownToSafeHTML';
import {stripMarkdown} from '@/packages/lib/stripMarkdown';
import {getEventTypesPublic} from '@/packages/event-types/getEventTypesPublic';
import {redirect} from 'next/navigation';
import {notFound} from 'next/navigation';
const SchedulingPage = async (props: {params: Promise<{username: string}>}) => {
  const params = await props.params;
  // 5 second timer

  // const ssr = await ssrInit(context);
  // const {currentOrgDomain, isValidOrgDomain} = orgDomainConfig(
  //   context.req,
  //   context.params?.orgSlug
  // );

  // const usernameList = getUsernameList(context.query.user as string);
  // const isARedirectFromNonOrgLink = context.query.orgRedirection === 'true';
  // const isOrgContext = isValidOrgDomain && !!currentOrgDomain;

  // const dataFetchStart = Date.now();

  // if (!isOrgContext) {
  //   // If there is no org context, see if some redirect is setup due to org migration
  //   const redirect = await getTemporaryOrgRedirect({
  //     slugs: usernameList,
  //     redirectType: RedirectType.User,
  //     eventTypeSlug: null,
  //     currentQuery: context.query
  //   });

  //   if (redirect) {
  //     return redirect;
  //   }
  // }

  const usersInOrgContext = await UserRepository.findUsersByUsername({
    // usernameList,
    usernameList: [params.username],
    // orgSlug: isValidOrgDomain ? currentOrgDomain : null
    orgSlug: null
  });

  // const isDynamicGroup = usersInOrgContext.length > 1;
  // log.debug(
  //   safeStringify({
  //     usersInOrgContext,
  //     isValidOrgDomain,
  //     currentOrgDomain,
  //     isDynamicGroup
  //   })
  // );

  // if (isDynamicGroup) {
  //   const destinationUrl = `/${usernameList.join('+')}/dynamic`;
  //   const originalQueryString = new URLSearchParams(
  //     context.query as Record<string, string>
  //   ).toString();
  //   const destinationWithQuery = `${destinationUrl}?${originalQueryString}`;
  //   log.debug(`Dynamic group detected, redirecting to ${destinationUrl}`);
  //   return {
  //     redirect: {
  //       permanent: false,
  //       destination: destinationWithQuery
  //     }
  //   } as const;
  // }

  // const isNonOrgUser = (user: {profile: UserProfile}) => {
  //   return !user.profile?.organization;
  //   // return true
  // };

  // const isThereAnyNonOrgUser = usersInOrgContext.some(isNonOrgUser);

  // if (
  //   !usersInOrgContext.length ||
  //   (!isValidOrgDomain && !isThereAnyNonOrgUser)
  // ) {
  //   return {
  //     notFound: true
  //   } as const;
  // }

  // Check if user exists
  if (!usersInOrgContext.length) {
    notFound();
  }

  const [user] = usersInOrgContext; //to be used when dealing with single user, not dynamic group

  const profile = {
    name: user.name || user.username || '',
    // image: getUserAvatarUrl({
    //   avatarUrl: user.image
    // }),
    theme: user.theme,
    // brandColor: user.brandColor ?? DEFAULT_LIGHT_BRAND_COLOR,
    image: user.image,
    // darkBrandColor: user.darkBrandColor ?? DEFAULT_DARK_BRAND_COLOR,
    allowSEOIndexing: user.allowSEOIndexing ?? true,
    username: user.username,
    organization: user.profile.organization
  };

  // const dataFetchEnd = Date.now();
  // if (context.query.log === '1') {
  //   context.res.setHeader(
  //     'X-Data-Fetch-Time',
  //     `${dataFetchEnd - dataFetchStart}ms`
  //   );
  // }

  const eventTypes = await getEventTypesPublic(user.id);

  // if profile only has one public event-type, redirect to it
  if (
    eventTypes.length === 1
    // && context.query.redirect !== 'false'
  ) {
    // Redirect but don't change the URL
    const urlDestination = `/${user.profile.username}/${eventTypes[0].slug}`;
    // const {query} = context;
    // const urlQuery = new URLSearchParams(encode(query));

    redirect(urlDestination);
  }

  const safeBio = markdownToSafeHTML(user.biography) || '';

  const markdownStrippedBio = stripMarkdown(user?.biography || '');
  const org = usersInOrgContext[0].profile.organization;

  // return {
  const servicesSchedulingFormProps = {
    users: usersInOrgContext.map((user) => ({
      name: user.name,
      username: user.username,
      biography: user.biography,
      image: user.image,
      verified: user.verified,
      profile: user.profile
    })),
    // entity: {
    //   ...(org?.logoUrl ? {logoUrl: org?.logoUrl} : {}),
    //   considerUnpublished: !isARedirectFromNonOrgLink && org?.slug === null,
    //   orgSlug: currentOrgDomain,
    //   name: org?.name ?? null
    // },
    eventTypes,
    safeBio,
    profile,
    // Dynamic group has no theme preference right now. It uses system theme.
    themeBasis: user.username,
    // trpcState: ssr.dehydrate(),
    markdownStrippedBio
  };
  // };

  let host = null;
  try {
    host = await getHostUserByUsername(params.username);
    if (!host) {
      throw new Error('Host not found');
    }
  } catch (error) {
    console.error('Error fetching user by username:', error);
    throw new Error('Host not found');
    // Handle the error as needed, e.g., show an error message or redirect
  }

  return (
    <ServicesSchedulingForm
      host={host}
      servicesSchedulingFormProps={servicesSchedulingFormProps}
    />
  );
};

export default SchedulingPage;
