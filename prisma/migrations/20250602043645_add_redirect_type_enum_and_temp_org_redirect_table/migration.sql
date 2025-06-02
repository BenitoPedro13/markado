/*
  Warnings:

  - You are about to drop the column `industryType` on the `Team` table. All the data in the column will be lost.
  - The primary key for the `VerificationToken` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[slug,parentId]` on the table `Team` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[token]` on the table `VerificationToken` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[identifier,token]` on the table `VerificationToken` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `VerificationToken` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserPermissionRole" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "SMSLockState" AS ENUM ('LOCKED', 'UNLOCKED', 'REVIEW_NEEDED');

-- CreateEnum
CREATE TYPE "FeatureType" AS ENUM ('RELEASE', 'EXPERIMENT', 'OPERATIONAL', 'KILL_SWITCH', 'PERMISSION');

-- CreateEnum
CREATE TYPE "AccessScope" AS ENUM ('READ_BOOKING', 'READ_PROFILE');

-- CreateEnum
CREATE TYPE "SchedulingType" AS ENUM ('roundRobin', 'collective', 'managed');

-- CreateEnum
CREATE TYPE "PeriodType" AS ENUM ('unlimited', 'rolling', 'rolling_window', 'range');

-- CreateEnum
CREATE TYPE "AttributeType" AS ENUM ('TEXT', 'NUMBER', 'SINGLE_SELECT', 'MULTI_SELECT');

-- CreateEnum
CREATE TYPE "MembershipRole" AS ENUM ('MEMBER', 'ADMIN', 'OWNER');

-- CreateEnum
CREATE TYPE "ServiceBadgeColor" AS ENUM ('faded', 'information', 'warning', 'error', 'success', 'away', 'feature', 'verified', 'highlighted', 'stable');

-- CreateEnum
CREATE TYPE "RedirectType" AS ENUM ('user-event-type', 'team-event-type', 'user', 'team');

-- CreateEnum
CREATE TYPE "WorkflowMethods" AS ENUM ('EMAIL', 'SMS', 'WHATSAPP');

-- CreateEnum
CREATE TYPE "WorkflowTemplates" AS ENUM ('REMINDER', 'CUSTOM', 'CANCELLED', 'RESCHEDULED', 'COMPLETED', 'RATING');

-- CreateEnum
CREATE TYPE "WorkflowActions" AS ENUM ('EMAIL_HOST', 'EMAIL_ATTENDEE', 'SMS_ATTENDEE', 'SMS_NUMBER', 'EMAIL_ADDRESS', 'WHATSAPP_ATTENDEE', 'WHATSAPP_NUMBER');

-- CreateEnum
CREATE TYPE "TimeUnit" AS ENUM ('day', 'hour', 'minute');

-- CreateEnum
CREATE TYPE "WorkflowTriggerEvents" AS ENUM ('BEFORE_EVENT', 'EVENT_CANCELLED', 'NEW_EVENT', 'AFTER_EVENT', 'RESCHEDULE_EVENT', 'AFTER_HOSTS_CAL_VIDEO_NO_SHOW', 'AFTER_GUESTS_CAL_VIDEO_NO_SHOW');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('cancelled', 'accepted', 'rejected', 'pending', 'awaiting_host');

-- CreateEnum
CREATE TYPE "PaymentOption" AS ENUM ('ON_BOOKING', 'HOLD');

-- CreateEnum
CREATE TYPE "WebhookTriggerEvents" AS ENUM ('BOOKING_CREATED', 'BOOKING_PAYMENT_INITIATED', 'BOOKING_PAID', 'BOOKING_RESCHEDULED', 'BOOKING_REQUESTED', 'BOOKING_CANCELLED', 'BOOKING_REJECTED', 'BOOKING_NO_SHOW_UPDATED', 'FORM_SUBMITTED', 'MEETING_ENDED', 'MEETING_STARTED', 'RECORDING_READY', 'INSTANT_MEETING', 'RECORDING_TRANSCRIPTION_GENERATED', 'OOO_CREATED', 'AFTER_HOSTS_CAL_VIDEO_NO_SHOW', 'AFTER_GUESTS_CAL_VIDEO_NO_SHOW', 'FORM_SUBMITTED_NO_EVENT');

-- CreateEnum
CREATE TYPE "AppCategories" AS ENUM ('calendar', 'messaging', 'other', 'payment', 'automation', 'analytics', 'conferencing', 'crm');

-- CreateEnum
CREATE TYPE "EventTypeCustomInputType" AS ENUM ('text', 'textLong', 'number', 'bool', 'radio', 'phone');

-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_userId_fkey";

-- DropForeignKey
ALTER TABLE "Authenticator" DROP CONSTRAINT "Authenticator_userId_fkey";

-- DropForeignKey
ALTER TABLE "Availability" DROP CONSTRAINT "Availability_userId_fkey";

-- DropForeignKey
ALTER TABLE "Calendar" DROP CONSTRAINT "Calendar_userId_fkey";

-- DropForeignKey
ALTER TABLE "Schedule" DROP CONSTRAINT "Schedule_userId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

-- DropForeignKey
ALTER TABLE "Team" DROP CONSTRAINT "Team_businessLocationId_fkey";

-- DropForeignKey
ALTER TABLE "UserPassword" DROP CONSTRAINT "UserPassword_userId_fkey";

-- DropIndex
DROP INDEX "Team_slug_key";

-- AlterTable
ALTER TABLE "Availability" ADD COLUMN     "eventTypeId" INTEGER;

-- AlterTable
ALTER TABLE "Team" DROP COLUMN "industryType",
ADD COLUMN     "appIconLogo" TEXT,
ADD COLUMN     "appLogo" TEXT,
ADD COLUMN     "bannerUrl" TEXT,
ADD COLUMN     "bio" TEXT,
ADD COLUMN     "bookingLimits" JSONB,
ADD COLUMN     "brandColor" TEXT,
ADD COLUMN     "calVideoLogo" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "createdByOAuthClientId" TEXT,
ADD COLUMN     "darkBrandColor" TEXT,
ADD COLUMN     "hideBookATeamMember" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hideBranding" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "includeManagedEventsInLimits" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "industyType" "IndustryType",
ADD COLUMN     "isOrganization" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isPlatform" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isPrivate" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "locationType" "BusinessLocationType" NOT NULL DEFAULT 'ONLINE',
ADD COLUMN     "logoUrl" TEXT,
ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "minimumSeats" INTEGER NOT NULL DEFAULT 2,
ADD COLUMN     "parentId" INTEGER,
ADD COLUMN     "pendingPayment" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "smsLockReviewedByAdmin" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "smsLockState" "SMSLockState" NOT NULL DEFAULT 'UNLOCKED',
ADD COLUMN     "theme" TEXT,
ADD COLUMN     "timeFormat" INTEGER,
ADD COLUMN     "timeZone" TEXT NOT NULL DEFAULT 'Europe/London',
ADD COLUMN     "weekStart" TEXT NOT NULL DEFAULT 'Sunday',
ALTER COLUMN "businessLocationId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "VerificationToken" DROP CONSTRAINT "VerificationToken_pkey",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "expiresInDays" INTEGER,
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "secondaryEmailId" INTEGER,
ADD COLUMN     "teamId" INTEGER,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD CONSTRAINT "VerificationToken_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "username" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "biography" TEXT,
    "image" TEXT,
    "timeZone" TEXT NOT NULL DEFAULT 'America/Sao_Paulo',
    "completedOnboarding" BOOLEAN NOT NULL DEFAULT false,
    "defaultScheduleId" INTEGER,
    "locale" "Locale" DEFAULT 'PT',
    "identityProvider" "IdentityProvider" DEFAULT 'MARKADO',
    "identityProviderId" TEXT,
    "weekStart" TEXT NOT NULL DEFAULT 'Sunday',
    "bufferTime" INTEGER NOT NULL DEFAULT 0,
    "hideBranding" BOOLEAN NOT NULL DEFAULT false,
    "timeFormat" INTEGER DEFAULT 12,
    "theme" TEXT,
    "trialEndsAt" TIMESTAMP(3),
    "businessAccountType" BOOLEAN NOT NULL DEFAULT false,
    "invitedTo" INTEGER,
    "brandColor" TEXT,
    "darkBrandColor" TEXT,
    "allowDynamicBooking" BOOLEAN DEFAULT true,
    "allowSEOIndexing" BOOLEAN DEFAULT true,
    "verified" BOOLEAN DEFAULT false,
    "role" "UserPermissionRole" NOT NULL DEFAULT 'USER',
    "organizationId" INTEGER,
    "googleAccessToken" TEXT,
    "googleRefreshToken" TEXT,
    "googleTokenExpiry" BIGINT,
    "selectedCalendarId" TEXT,
    "googleMeetEnabled" BOOLEAN NOT NULL DEFAULT false,
    "locked" BOOLEAN NOT NULL DEFAULT false,
    "movedToProfileId" INTEGER,
    "isPlatformManaged" BOOLEAN NOT NULL DEFAULT false,
    "smsLockState" "SMSLockState" NOT NULL DEFAULT 'UNLOCKED',
    "smsLockReviewedByAdmin" BOOLEAN NOT NULL DEFAULT false,
    "referralLinkId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserFeatures" (
    "userId" TEXT NOT NULL,
    "featureId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedBy" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserFeatures_pkey" PRIMARY KEY ("userId","featureId")
);

-- CreateTable
CREATE TABLE "Feature" (
    "slug" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "type" "FeatureType" DEFAULT 'RELEASE',
    "stale" BOOLEAN DEFAULT false,
    "lastUsedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" INTEGER,

    CONSTRAINT "Feature_pkey" PRIMARY KEY ("slug")
);

-- CreateTable
CREATE TABLE "TeamFeatures" (
    "teamId" INTEGER NOT NULL,
    "featureId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedBy" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TeamFeatures_pkey" PRIMARY KEY ("teamId","featureId")
);

-- CreateTable
CREATE TABLE "NotificationsSubscriptions" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "subscription" TEXT NOT NULL,

    CONSTRAINT "NotificationsSubscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SecondaryEmail" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),

    CONSTRAINT "SecondaryEmail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccessCode" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "clientId" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "scopes" "AccessScope"[],
    "userId" TEXT,
    "teamId" INTEGER,

    CONSTRAINT "AccessCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OAuthClient" (
    "clientId" TEXT NOT NULL,
    "redirectUri" TEXT NOT NULL,
    "clientSecret" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logo" TEXT,

    CONSTRAINT "OAuthClient_pkey" PRIMARY KEY ("clientId")
);

-- CreateTable
CREATE TABLE "OutOfOfficeEntry" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "userId" TEXT NOT NULL,
    "toUserId" TEXT,
    "reasonId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OutOfOfficeEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OutOfOfficeReason" (
    "id" SERIAL NOT NULL,
    "emoji" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "userId" TEXT,

    CONSTRAINT "OutOfOfficeReason_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerifiedEmail" (
    "id" SERIAL NOT NULL,
    "userId" TEXT,
    "teamId" INTEGER,
    "email" TEXT NOT NULL,

    CONSTRAINT "VerifiedEmail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerifiedNumber" (
    "id" SERIAL NOT NULL,
    "userId" TEXT,
    "teamId" INTEGER,
    "phoneNumber" TEXT NOT NULL,

    CONSTRAINT "VerifiedNumber_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Feedback" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "rating" TEXT NOT NULL,
    "comment" TEXT,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizationSettings" (
    "id" SERIAL NOT NULL,
    "organizationId" INTEGER NOT NULL,
    "isOrganizationConfigured" BOOLEAN NOT NULL DEFAULT false,
    "isOrganizationVerified" BOOLEAN NOT NULL DEFAULT false,
    "orgAutoAcceptEmail" TEXT NOT NULL,
    "lockEventTypeCreationForUsers" BOOLEAN NOT NULL DEFAULT false,
    "adminGetsNoSlotsNotification" BOOLEAN NOT NULL DEFAULT false,
    "isAdminReviewed" BOOLEAN NOT NULL DEFAULT false,
    "isAdminAPIEnabled" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "OrganizationSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DSyncData" (
    "id" SERIAL NOT NULL,
    "directoryId" TEXT NOT NULL,
    "tenant" TEXT NOT NULL,
    "organizationId" INTEGER,

    CONSTRAINT "DSyncData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DSyncTeamGroupMapping" (
    "id" SERIAL NOT NULL,
    "organizationId" INTEGER NOT NULL,
    "teamId" INTEGER NOT NULL,
    "directoryId" TEXT NOT NULL,
    "groupName" TEXT NOT NULL,

    CONSTRAINT "DSyncTeamGroupMapping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlatformBilling" (
    "id" INTEGER NOT NULL,
    "customerId" TEXT NOT NULL,
    "subscriptionId" TEXT,
    "plan" TEXT NOT NULL DEFAULT 'none',
    "billingCycleStart" INTEGER,
    "billingCycleEnd" INTEGER,
    "overdue" BOOLEAN DEFAULT false,

    CONSTRAINT "PlatformBilling_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Membership" (
    "id" SERIAL NOT NULL,
    "teamId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "accepted" BOOLEAN NOT NULL DEFAULT false,
    "role" "MembershipRole" NOT NULL,
    "disableImpersonation" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Membership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AttributeToUser" (
    "id" TEXT NOT NULL,
    "memberId" INTEGER NOT NULL,
    "attributeOptionId" TEXT NOT NULL,

    CONSTRAINT "AttributeToUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AttributeOption" (
    "id" TEXT NOT NULL,
    "attributeId" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "AttributeOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attribute" (
    "id" TEXT NOT NULL,
    "teamId" INTEGER NOT NULL,
    "type" "AttributeType" NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "usersCanEditRelation" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Attribute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Host" (
    "userId" TEXT NOT NULL,
    "eventTypeId" INTEGER NOT NULL,
    "isFixed" BOOLEAN NOT NULL DEFAULT false,
    "priority" INTEGER,
    "weight" INTEGER,
    "scheduleId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Host_pkey" PRIMARY KEY ("userId","eventTypeId")
);

-- CreateTable
CREATE TABLE "EventType" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,
    "locations" JSONB,
    "length" INTEGER NOT NULL,
    "offsetStart" INTEGER NOT NULL DEFAULT 0,
    "hidden" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT,
    "profileId" INTEGER,
    "teamId" INTEGER,
    "eventName" TEXT,
    "parentId" INTEGER,
    "bookingFields" JSONB,
    "timeZone" TEXT,
    "periodType" "PeriodType" NOT NULL DEFAULT 'unlimited',
    "periodStartDate" TIMESTAMP(3),
    "periodEndDate" TIMESTAMP(3),
    "periodDays" INTEGER,
    "periodCountCalendarDays" BOOLEAN,
    "lockTimeZoneToggleOnBookingPage" BOOLEAN NOT NULL DEFAULT false,
    "requiresConfirmation" BOOLEAN NOT NULL DEFAULT false,
    "requiresConfirmationWillBlockSlot" BOOLEAN NOT NULL DEFAULT false,
    "requiresBookerEmailVerification" BOOLEAN NOT NULL DEFAULT false,
    "recurringEvent" JSONB,
    "disableGuests" BOOLEAN NOT NULL DEFAULT false,
    "hideCalendarNotes" BOOLEAN NOT NULL DEFAULT false,
    "hideCalendarEventDetails" BOOLEAN NOT NULL DEFAULT false,
    "minimumBookingNotice" INTEGER NOT NULL DEFAULT 120,
    "beforeEventBuffer" INTEGER NOT NULL DEFAULT 0,
    "afterEventBuffer" INTEGER NOT NULL DEFAULT 0,
    "seatsPerTimeSlot" INTEGER,
    "onlyShowFirstAvailableSlot" BOOLEAN NOT NULL DEFAULT false,
    "seatsShowAttendees" BOOLEAN DEFAULT false,
    "seatsShowAvailabilityCount" BOOLEAN DEFAULT true,
    "schedulingType" "SchedulingType",
    "scheduleId" INTEGER,
    "slotInterval" INTEGER,
    "metadata" JSONB,
    "successRedirectUrl" TEXT,
    "forwardParamsSuccessRedirect" BOOLEAN DEFAULT true,
    "bookingLimits" JSONB,
    "durationLimits" JSONB,
    "isInstantEvent" BOOLEAN NOT NULL DEFAULT false,
    "instantMeetingExpiryTimeOffsetInSeconds" INTEGER NOT NULL DEFAULT 90,
    "instantMeetingScheduleId" INTEGER,
    "assignAllTeamMembers" BOOLEAN NOT NULL DEFAULT false,
    "useEventTypeDestinationCalendarEmail" BOOLEAN NOT NULL DEFAULT false,
    "eventTypeColor" JSONB,
    "badgeColor" "ServiceBadgeColor" NOT NULL DEFAULT 'faded',
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'BRL',
    "secondaryEmailId" INTEGER,

    CONSTRAINT "EventType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Workflow" (
    "id" SERIAL NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "name" TEXT NOT NULL,
    "userId" TEXT,
    "teamId" INTEGER,
    "isActiveOnAll" BOOLEAN NOT NULL DEFAULT false,
    "trigger" "WorkflowTriggerEvents" NOT NULL,
    "time" INTEGER,
    "timeUnit" "TimeUnit",

    CONSTRAINT "Workflow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkflowStep" (
    "id" SERIAL NOT NULL,
    "stepNumber" INTEGER NOT NULL,
    "action" "WorkflowActions" NOT NULL,
    "workflowId" INTEGER NOT NULL,
    "sendTo" TEXT,
    "reminderBody" TEXT,
    "emailSubject" TEXT,
    "template" "WorkflowTemplates" NOT NULL DEFAULT 'REMINDER',
    "numberRequired" BOOLEAN,
    "sender" TEXT,
    "numberVerificationPending" BOOLEAN NOT NULL DEFAULT true,
    "includeCalendarEvent" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "WorkflowStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkflowReminder" (
    "id" SERIAL NOT NULL,
    "bookingUid" TEXT,
    "method" "WorkflowMethods" NOT NULL,
    "scheduledDate" TIMESTAMP(3) NOT NULL,
    "referenceId" TEXT,
    "scheduled" BOOLEAN NOT NULL,
    "workflowStepId" INTEGER,
    "cancelled" BOOLEAN,
    "seatReferenceId" TEXT,
    "isMandatoryReminder" BOOLEAN DEFAULT false,
    "retryCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "WorkflowReminder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TempOrgRedirect" (
    "id" SERIAL NOT NULL,
    "from" TEXT NOT NULL,
    "fromOrgId" INTEGER NOT NULL,
    "type" "RedirectType" NOT NULL,
    "toUrl" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TempOrgRedirect_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebhookScheduledTriggers" (
    "id" SERIAL NOT NULL,
    "jobName" TEXT,
    "subscriberUrl" TEXT NOT NULL,
    "payload" TEXT NOT NULL,
    "startAfter" TIMESTAMP(3) NOT NULL,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "appId" TEXT,
    "webhookId" TEXT,
    "bookingId" INTEGER,

    CONSTRAINT "WebhookScheduledTriggers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookingSeat" (
    "id" SERIAL NOT NULL,
    "referenceUid" TEXT NOT NULL,
    "bookingId" INTEGER NOT NULL,
    "attendeeId" INTEGER NOT NULL,
    "data" JSONB,

    CONSTRAINT "BookingSeat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkflowsOnTeams" (
    "id" SERIAL NOT NULL,
    "workflowId" INTEGER NOT NULL,
    "teamId" INTEGER NOT NULL,

    CONSTRAINT "WorkflowsOnTeams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkflowsOnEventTypes" (
    "id" SERIAL NOT NULL,
    "workflowId" INTEGER NOT NULL,
    "eventTypeId" INTEGER NOT NULL,

    CONSTRAINT "WorkflowsOnEventTypes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DestinationCalendar" (
    "id" SERIAL NOT NULL,
    "integration" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "primaryEmail" TEXT,
    "userId" TEXT,
    "eventTypeId" INTEGER,
    "credentialId" INTEGER,

    CONSTRAINT "DestinationCalendar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookingReference" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "uid" TEXT NOT NULL,
    "meetingId" TEXT,
    "thirdPartyRecurringEventId" TEXT,
    "meetingPassword" TEXT,
    "meetingUrl" TEXT,
    "bookingId" INTEGER,
    "externalCalendarId" TEXT,
    "deleted" BOOLEAN,
    "credentialId" INTEGER,

    CONSTRAINT "BookingReference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attendee" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "timeZone" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "locale" TEXT DEFAULT 'en',
    "bookingId" INTEGER,
    "noShow" BOOLEAN DEFAULT false,

    CONSTRAINT "Attendee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" SERIAL NOT NULL,
    "uid" TEXT NOT NULL,
    "idempotencyKey" TEXT,
    "userId" TEXT,
    "userPrimaryEmail" TEXT,
    "eventTypeId" INTEGER,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "customInputs" JSONB,
    "responses" JSONB,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "location" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "status" "BookingStatus" NOT NULL DEFAULT 'accepted',
    "paid" BOOLEAN NOT NULL DEFAULT false,
    "destinationCalendarId" INTEGER,
    "cancellationReason" TEXT,
    "rejectionReason" TEXT,
    "reassignReason" TEXT,
    "reassignById" TEXT,
    "dynamicEventSlugRef" TEXT,
    "dynamicGroupSlugRef" TEXT,
    "rescheduled" BOOLEAN,
    "fromReschedule" TEXT,
    "recurringEventId" TEXT,
    "smsReminderNumber" TEXT,
    "metadata" JSONB,
    "isRecorded" BOOLEAN NOT NULL DEFAULT false,
    "rating" INTEGER,
    "ratingFeedback" TEXT,
    "noShowHost" BOOLEAN DEFAULT false,
    "oneTimePassword" TEXT,
    "cancelledBy" TEXT,
    "rescheduledBy" TEXT,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "App_RoutingForms_Form" (
    "id" TEXT NOT NULL,
    "description" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,
    "routes" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "fields" JSONB,
    "userId" TEXT NOT NULL,
    "teamId" INTEGER,
    "disabled" BOOLEAN NOT NULL DEFAULT false,
    "settings" JSONB,

    CONSTRAINT "App_RoutingForms_Form_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "App_RoutingForms_FormResponse" (
    "id" SERIAL NOT NULL,
    "formFillerId" TEXT NOT NULL,
    "formId" TEXT NOT NULL,
    "response" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "routedToBookingUid" TEXT,

    CONSTRAINT "App_RoutingForms_FormResponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" SERIAL NOT NULL,
    "uid" TEXT NOT NULL,
    "appId" TEXT,
    "bookingId" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "fee" INTEGER NOT NULL,
    "currency" TEXT NOT NULL,
    "success" BOOLEAN NOT NULL,
    "refunded" BOOLEAN NOT NULL,
    "data" JSONB NOT NULL,
    "externalId" TEXT NOT NULL,
    "paymentOption" "PaymentOption" DEFAULT 'ON_BOOKING',

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InstantMeetingToken" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "teamId" INTEGER NOT NULL,
    "bookingId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InstantMeetingToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "App" (
    "slug" TEXT NOT NULL,
    "dirName" TEXT NOT NULL,
    "keys" JSONB,
    "categories" "AppCategories"[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "App_pkey" PRIMARY KEY ("slug")
);

-- CreateTable
CREATE TABLE "ApiKey" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "teamId" INTEGER,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "lastUsedAt" TIMESTAMP(3),
    "hashedKey" TEXT NOT NULL,
    "appId" TEXT,

    CONSTRAINT "ApiKey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RateLimit" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "apiKeyId" TEXT NOT NULL,
    "ttl" INTEGER NOT NULL,
    "limit" INTEGER NOT NULL,
    "blockDuration" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RateLimit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Webhook" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "teamId" INTEGER,
    "eventTypeId" INTEGER,
    "platformOAuthClientId" TEXT,
    "subscriberUrl" TEXT NOT NULL,
    "payloadTemplate" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "eventTriggers" "WebhookTriggerEvents"[],
    "appId" TEXT,
    "secret" TEXT,
    "platform" BOOLEAN NOT NULL DEFAULT false,
    "time" INTEGER,
    "timeUnit" "TimeUnit",

    CONSTRAINT "Webhook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" SERIAL NOT NULL,
    "uid" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "organizationId" INTEGER NOT NULL,
    "username" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HashedLink" (
    "id" SERIAL NOT NULL,
    "link" TEXT NOT NULL,
    "eventTypeId" INTEGER NOT NULL,

    CONSTRAINT "HashedLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Credential" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "key" JSONB NOT NULL,
    "userId" TEXT,
    "teamId" INTEGER,
    "appId" TEXT,
    "subscriptionId" TEXT,
    "paymentStatus" TEXT,
    "billingCycleStart" INTEGER,
    "invalid" BOOLEAN DEFAULT false,

    CONSTRAINT "Credential_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SelectedCalendar" (
    "userId" TEXT NOT NULL,
    "integration" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "credentialId" INTEGER,

    CONSTRAINT "SelectedCalendar_pkey" PRIMARY KEY ("userId","integration","externalId")
);

-- CreateTable
CREATE TABLE "EventTypeCustomInput" (
    "id" SERIAL NOT NULL,
    "eventTypeId" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "type" "EventTypeCustomInputType" NOT NULL,
    "options" JSONB,
    "required" BOOLEAN NOT NULL,
    "placeholder" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "EventTypeCustomInput_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CalendarCache" (
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "credentialId" INTEGER NOT NULL,

    CONSTRAINT "CalendarCache_pkey" PRIMARY KEY ("credentialId","key")
);

-- CreateTable
CREATE TABLE "PlatformOAuthClient" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "secret" TEXT NOT NULL,
    "permissions" INTEGER NOT NULL,
    "logo" TEXT,
    "redirectUris" TEXT[],
    "organizationId" INTEGER NOT NULL,
    "bookingRedirectUri" TEXT,
    "bookingCancelRedirectUri" TEXT,
    "bookingRescheduleRedirectUri" TEXT,
    "areEmailsEnabled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlatformOAuthClient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlatformAuthorizationToken" (
    "id" TEXT NOT NULL,
    "platformOAuthClientId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlatformAuthorizationToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccessToken" (
    "id" SERIAL NOT NULL,
    "secret" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "platformOAuthClientId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "AccessToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RefreshToken" (
    "id" SERIAL NOT NULL,
    "secret" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "platformOAuthClientId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_user_eventtype" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_user_eventtype_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_PlatformOAuthClientToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PlatformOAuthClientToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "users_username_idx" ON "users"("username");

-- CreateIndex
CREATE INDEX "users_emailVerified_idx" ON "users"("emailVerified");

-- CreateIndex
CREATE INDEX "users_identityProvider_idx" ON "users"("identityProvider");

-- CreateIndex
CREATE INDEX "users_identityProviderId_idx" ON "users"("identityProviderId");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_username_key" ON "users"("email", "username");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_organizationId_key" ON "users"("username", "organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "users_movedToProfileId_key" ON "users"("movedToProfileId");

-- CreateIndex
CREATE UNIQUE INDEX "Feature_slug_key" ON "Feature"("slug");

-- CreateIndex
CREATE INDEX "Feature_enabled_idx" ON "Feature"("enabled");

-- CreateIndex
CREATE INDEX "Feature_stale_idx" ON "Feature"("stale");

-- CreateIndex
CREATE INDEX "NotificationsSubscriptions_userId_subscription_idx" ON "NotificationsSubscriptions"("userId", "subscription");

-- CreateIndex
CREATE INDEX "SecondaryEmail_userId_idx" ON "SecondaryEmail"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "SecondaryEmail_email_key" ON "SecondaryEmail"("email");

-- CreateIndex
CREATE UNIQUE INDEX "SecondaryEmail_userId_email_key" ON "SecondaryEmail"("userId", "email");

-- CreateIndex
CREATE UNIQUE INDEX "OAuthClient_clientId_key" ON "OAuthClient"("clientId");

-- CreateIndex
CREATE UNIQUE INDEX "OutOfOfficeEntry_uuid_key" ON "OutOfOfficeEntry"("uuid");

-- CreateIndex
CREATE INDEX "OutOfOfficeEntry_uuid_idx" ON "OutOfOfficeEntry"("uuid");

-- CreateIndex
CREATE INDEX "OutOfOfficeEntry_userId_idx" ON "OutOfOfficeEntry"("userId");

-- CreateIndex
CREATE INDEX "OutOfOfficeEntry_toUserId_idx" ON "OutOfOfficeEntry"("toUserId");

-- CreateIndex
CREATE INDEX "OutOfOfficeEntry_start_end_idx" ON "OutOfOfficeEntry"("start", "end");

-- CreateIndex
CREATE UNIQUE INDEX "OutOfOfficeReason_reason_key" ON "OutOfOfficeReason"("reason");

-- CreateIndex
CREATE INDEX "VerifiedEmail_userId_idx" ON "VerifiedEmail"("userId");

-- CreateIndex
CREATE INDEX "VerifiedEmail_teamId_idx" ON "VerifiedEmail"("teamId");

-- CreateIndex
CREATE INDEX "VerifiedNumber_userId_idx" ON "VerifiedNumber"("userId");

-- CreateIndex
CREATE INDEX "VerifiedNumber_teamId_idx" ON "VerifiedNumber"("teamId");

-- CreateIndex
CREATE INDEX "Feedback_userId_idx" ON "Feedback"("userId");

-- CreateIndex
CREATE INDEX "Feedback_rating_idx" ON "Feedback"("rating");

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationSettings_organizationId_key" ON "OrganizationSettings"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "DSyncData_directoryId_key" ON "DSyncData"("directoryId");

-- CreateIndex
CREATE UNIQUE INDEX "DSyncData_organizationId_key" ON "DSyncData"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "DSyncTeamGroupMapping_teamId_groupName_key" ON "DSyncTeamGroupMapping"("teamId", "groupName");

-- CreateIndex
CREATE UNIQUE INDEX "PlatformBilling_id_key" ON "PlatformBilling"("id");

-- CreateIndex
CREATE UNIQUE INDEX "PlatformBilling_customerId_key" ON "PlatformBilling"("customerId");

-- CreateIndex
CREATE INDEX "Membership_teamId_idx" ON "Membership"("teamId");

-- CreateIndex
CREATE INDEX "Membership_userId_idx" ON "Membership"("userId");

-- CreateIndex
CREATE INDEX "Membership_accepted_idx" ON "Membership"("accepted");

-- CreateIndex
CREATE INDEX "Membership_role_idx" ON "Membership"("role");

-- CreateIndex
CREATE UNIQUE INDEX "Membership_userId_teamId_key" ON "Membership"("userId", "teamId");

-- CreateIndex
CREATE UNIQUE INDEX "AttributeToUser_memberId_attributeOptionId_key" ON "AttributeToUser"("memberId", "attributeOptionId");

-- CreateIndex
CREATE UNIQUE INDEX "Attribute_slug_key" ON "Attribute"("slug");

-- CreateIndex
CREATE INDEX "Host_userId_idx" ON "Host"("userId");

-- CreateIndex
CREATE INDEX "Host_eventTypeId_idx" ON "Host"("eventTypeId");

-- CreateIndex
CREATE INDEX "Host_scheduleId_idx" ON "Host"("scheduleId");

-- CreateIndex
CREATE INDEX "EventType_userId_idx" ON "EventType"("userId");

-- CreateIndex
CREATE INDEX "EventType_teamId_idx" ON "EventType"("teamId");

-- CreateIndex
CREATE INDEX "EventType_scheduleId_idx" ON "EventType"("scheduleId");

-- CreateIndex
CREATE INDEX "EventType_parentId_idx" ON "EventType"("parentId");

-- CreateIndex
CREATE UNIQUE INDEX "EventType_userId_slug_key" ON "EventType"("userId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "EventType_teamId_slug_key" ON "EventType"("teamId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "EventType_userId_parentId_key" ON "EventType"("userId", "parentId");

-- CreateIndex
CREATE INDEX "Workflow_userId_idx" ON "Workflow"("userId");

-- CreateIndex
CREATE INDEX "Workflow_teamId_idx" ON "Workflow"("teamId");

-- CreateIndex
CREATE INDEX "WorkflowStep_workflowId_idx" ON "WorkflowStep"("workflowId");

-- CreateIndex
CREATE UNIQUE INDEX "WorkflowReminder_referenceId_key" ON "WorkflowReminder"("referenceId");

-- CreateIndex
CREATE INDEX "WorkflowReminder_bookingUid_idx" ON "WorkflowReminder"("bookingUid");

-- CreateIndex
CREATE INDEX "WorkflowReminder_workflowStepId_idx" ON "WorkflowReminder"("workflowStepId");

-- CreateIndex
CREATE INDEX "WorkflowReminder_seatReferenceId_idx" ON "WorkflowReminder"("seatReferenceId");

-- CreateIndex
CREATE INDEX "WorkflowReminder_method_scheduled_scheduledDate_idx" ON "WorkflowReminder"("method", "scheduled", "scheduledDate");

-- CreateIndex
CREATE INDEX "WorkflowReminder_cancelled_scheduledDate_idx" ON "WorkflowReminder"("cancelled", "scheduledDate");

-- CreateIndex
CREATE UNIQUE INDEX "TempOrgRedirect_from_type_fromOrgId_key" ON "TempOrgRedirect"("from", "type", "fromOrgId");

-- CreateIndex
CREATE UNIQUE INDEX "BookingSeat_referenceUid_key" ON "BookingSeat"("referenceUid");

-- CreateIndex
CREATE UNIQUE INDEX "BookingSeat_attendeeId_key" ON "BookingSeat"("attendeeId");

-- CreateIndex
CREATE INDEX "BookingSeat_bookingId_idx" ON "BookingSeat"("bookingId");

-- CreateIndex
CREATE INDEX "BookingSeat_attendeeId_idx" ON "BookingSeat"("attendeeId");

-- CreateIndex
CREATE INDEX "WorkflowsOnTeams_workflowId_idx" ON "WorkflowsOnTeams"("workflowId");

-- CreateIndex
CREATE INDEX "WorkflowsOnTeams_teamId_idx" ON "WorkflowsOnTeams"("teamId");

-- CreateIndex
CREATE UNIQUE INDEX "WorkflowsOnTeams_workflowId_teamId_key" ON "WorkflowsOnTeams"("workflowId", "teamId");

-- CreateIndex
CREATE INDEX "WorkflowsOnEventTypes_workflowId_idx" ON "WorkflowsOnEventTypes"("workflowId");

-- CreateIndex
CREATE INDEX "WorkflowsOnEventTypes_eventTypeId_idx" ON "WorkflowsOnEventTypes"("eventTypeId");

-- CreateIndex
CREATE UNIQUE INDEX "WorkflowsOnEventTypes_workflowId_eventTypeId_key" ON "WorkflowsOnEventTypes"("workflowId", "eventTypeId");

-- CreateIndex
CREATE UNIQUE INDEX "DestinationCalendar_userId_key" ON "DestinationCalendar"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "DestinationCalendar_eventTypeId_key" ON "DestinationCalendar"("eventTypeId");

-- CreateIndex
CREATE INDEX "DestinationCalendar_userId_idx" ON "DestinationCalendar"("userId");

-- CreateIndex
CREATE INDEX "DestinationCalendar_eventTypeId_idx" ON "DestinationCalendar"("eventTypeId");

-- CreateIndex
CREATE INDEX "DestinationCalendar_credentialId_idx" ON "DestinationCalendar"("credentialId");

-- CreateIndex
CREATE INDEX "BookingReference_bookingId_idx" ON "BookingReference"("bookingId");

-- CreateIndex
CREATE INDEX "BookingReference_type_idx" ON "BookingReference"("type");

-- CreateIndex
CREATE INDEX "BookingReference_uid_idx" ON "BookingReference"("uid");

-- CreateIndex
CREATE INDEX "Attendee_email_idx" ON "Attendee"("email");

-- CreateIndex
CREATE INDEX "Attendee_bookingId_idx" ON "Attendee"("bookingId");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_uid_key" ON "Booking"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_idempotencyKey_key" ON "Booking"("idempotencyKey");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_oneTimePassword_key" ON "Booking"("oneTimePassword");

-- CreateIndex
CREATE INDEX "Booking_eventTypeId_idx" ON "Booking"("eventTypeId");

-- CreateIndex
CREATE INDEX "Booking_userId_idx" ON "Booking"("userId");

-- CreateIndex
CREATE INDEX "Booking_destinationCalendarId_idx" ON "Booking"("destinationCalendarId");

-- CreateIndex
CREATE INDEX "Booking_recurringEventId_idx" ON "Booking"("recurringEventId");

-- CreateIndex
CREATE INDEX "Booking_uid_idx" ON "Booking"("uid");

-- CreateIndex
CREATE INDEX "Booking_status_idx" ON "Booking"("status");

-- CreateIndex
CREATE INDEX "Booking_startTime_endTime_status_idx" ON "Booking"("startTime", "endTime", "status");

-- CreateIndex
CREATE INDEX "App_RoutingForms_Form_userId_idx" ON "App_RoutingForms_Form"("userId");

-- CreateIndex
CREATE INDEX "App_RoutingForms_Form_disabled_idx" ON "App_RoutingForms_Form"("disabled");

-- CreateIndex
CREATE UNIQUE INDEX "App_RoutingForms_FormResponse_routedToBookingUid_key" ON "App_RoutingForms_FormResponse"("routedToBookingUid");

-- CreateIndex
CREATE INDEX "App_RoutingForms_FormResponse_formFillerId_idx" ON "App_RoutingForms_FormResponse"("formFillerId");

-- CreateIndex
CREATE INDEX "App_RoutingForms_FormResponse_formId_idx" ON "App_RoutingForms_FormResponse"("formId");

-- CreateIndex
CREATE UNIQUE INDEX "App_RoutingForms_FormResponse_formFillerId_formId_key" ON "App_RoutingForms_FormResponse"("formFillerId", "formId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_uid_key" ON "Payment"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_externalId_key" ON "Payment"("externalId");

-- CreateIndex
CREATE INDEX "Payment_bookingId_idx" ON "Payment"("bookingId");

-- CreateIndex
CREATE INDEX "Payment_externalId_idx" ON "Payment"("externalId");

-- CreateIndex
CREATE UNIQUE INDEX "InstantMeetingToken_token_key" ON "InstantMeetingToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "InstantMeetingToken_bookingId_key" ON "InstantMeetingToken"("bookingId");

-- CreateIndex
CREATE INDEX "InstantMeetingToken_token_idx" ON "InstantMeetingToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "App_slug_key" ON "App"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "App_dirName_key" ON "App"("dirName");

-- CreateIndex
CREATE INDEX "App_enabled_idx" ON "App"("enabled");

-- CreateIndex
CREATE UNIQUE INDEX "ApiKey_id_key" ON "ApiKey"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ApiKey_hashedKey_key" ON "ApiKey"("hashedKey");

-- CreateIndex
CREATE INDEX "ApiKey_userId_idx" ON "ApiKey"("userId");

-- CreateIndex
CREATE INDEX "RateLimit_apiKeyId_idx" ON "RateLimit"("apiKeyId");

-- CreateIndex
CREATE UNIQUE INDEX "Webhook_id_key" ON "Webhook"("id");

-- CreateIndex
CREATE INDEX "Webhook_active_idx" ON "Webhook"("active");

-- CreateIndex
CREATE UNIQUE INDEX "Webhook_userId_subscriberUrl_key" ON "Webhook"("userId", "subscriberUrl");

-- CreateIndex
CREATE UNIQUE INDEX "Webhook_platformOAuthClientId_subscriberUrl_key" ON "Webhook"("platformOAuthClientId", "subscriberUrl");

-- CreateIndex
CREATE INDEX "Profile_uid_idx" ON "Profile"("uid");

-- CreateIndex
CREATE INDEX "Profile_userId_idx" ON "Profile"("userId");

-- CreateIndex
CREATE INDEX "Profile_organizationId_idx" ON "Profile"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_organizationId_key" ON "Profile"("userId", "organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_username_organizationId_key" ON "Profile"("username", "organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "HashedLink_link_key" ON "HashedLink"("link");

-- CreateIndex
CREATE INDEX "Credential_userId_idx" ON "Credential"("userId");

-- CreateIndex
CREATE INDEX "Credential_appId_idx" ON "Credential"("appId");

-- CreateIndex
CREATE INDEX "Credential_subscriptionId_idx" ON "Credential"("subscriptionId");

-- CreateIndex
CREATE INDEX "Credential_invalid_idx" ON "Credential"("invalid");

-- CreateIndex
CREATE INDEX "SelectedCalendar_userId_idx" ON "SelectedCalendar"("userId");

-- CreateIndex
CREATE INDEX "SelectedCalendar_integration_idx" ON "SelectedCalendar"("integration");

-- CreateIndex
CREATE INDEX "SelectedCalendar_externalId_idx" ON "SelectedCalendar"("externalId");

-- CreateIndex
CREATE INDEX "EventTypeCustomInput_eventTypeId_idx" ON "EventTypeCustomInput"("eventTypeId");

-- CreateIndex
CREATE UNIQUE INDEX "CalendarCache_credentialId_key_key" ON "CalendarCache"("credentialId", "key");

-- CreateIndex
CREATE UNIQUE INDEX "PlatformAuthorizationToken_userId_platformOAuthClientId_key" ON "PlatformAuthorizationToken"("userId", "platformOAuthClientId");

-- CreateIndex
CREATE UNIQUE INDEX "AccessToken_secret_key" ON "AccessToken"("secret");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_secret_key" ON "RefreshToken"("secret");

-- CreateIndex
CREATE INDEX "_user_eventtype_B_index" ON "_user_eventtype"("B");

-- CreateIndex
CREATE INDEX "_PlatformOAuthClientToUser_B_index" ON "_PlatformOAuthClientToUser"("B");

-- CreateIndex
CREATE INDEX "Availability_eventTypeId_idx" ON "Availability"("eventTypeId");

-- CreateIndex
CREATE INDEX "Team_parentId_idx" ON "Team"("parentId");

-- CreateIndex
CREATE UNIQUE INDEX "Team_slug_parentId_key" ON "Team"("slug", "parentId");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE INDEX "VerificationToken_token_idx" ON "VerificationToken"("token");

-- CreateIndex
CREATE INDEX "VerificationToken_teamId_idx" ON "VerificationToken"("teamId");

-- CreateIndex
CREATE INDEX "VerificationToken_secondaryEmailId_idx" ON "VerificationToken"("secondaryEmailId");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_movedToProfileId_fkey" FOREIGN KEY ("movedToProfileId") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFeatures" ADD CONSTRAINT "UserFeatures_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFeatures" ADD CONSTRAINT "UserFeatures_featureId_fkey" FOREIGN KEY ("featureId") REFERENCES "Feature"("slug") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamFeatures" ADD CONSTRAINT "TeamFeatures_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamFeatures" ADD CONSTRAINT "TeamFeatures_featureId_fkey" FOREIGN KEY ("featureId") REFERENCES "Feature"("slug") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationsSubscriptions" ADD CONSTRAINT "NotificationsSubscriptions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SecondaryEmail" ADD CONSTRAINT "SecondaryEmail_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccessCode" ADD CONSTRAINT "AccessCode_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "OAuthClient"("clientId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccessCode" ADD CONSTRAINT "AccessCode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccessCode" ADD CONSTRAINT "AccessCode_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OutOfOfficeEntry" ADD CONSTRAINT "OutOfOfficeEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OutOfOfficeEntry" ADD CONSTRAINT "OutOfOfficeEntry_toUserId_fkey" FOREIGN KEY ("toUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OutOfOfficeEntry" ADD CONSTRAINT "OutOfOfficeEntry_reasonId_fkey" FOREIGN KEY ("reasonId") REFERENCES "OutOfOfficeReason"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OutOfOfficeReason" ADD CONSTRAINT "OutOfOfficeReason_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerifiedEmail" ADD CONSTRAINT "VerifiedEmail_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerifiedEmail" ADD CONSTRAINT "VerifiedEmail_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerifiedNumber" ADD CONSTRAINT "VerifiedNumber_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerifiedNumber" ADD CONSTRAINT "VerifiedNumber_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPassword" ADD CONSTRAINT "UserPassword_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerificationToken" ADD CONSTRAINT "VerificationToken_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerificationToken" ADD CONSTRAINT "VerificationToken_secondaryEmailId_fkey" FOREIGN KEY ("secondaryEmailId") REFERENCES "SecondaryEmail"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Availability" ADD CONSTRAINT "Availability_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Availability" ADD CONSTRAINT "Availability_eventTypeId_fkey" FOREIGN KEY ("eventTypeId") REFERENCES "EventType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_createdByOAuthClientId_fkey" FOREIGN KEY ("createdByOAuthClientId") REFERENCES "PlatformOAuthClient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_businessLocationId_fkey" FOREIGN KEY ("businessLocationId") REFERENCES "BusinessLocation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationSettings" ADD CONSTRAINT "OrganizationSettings_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DSyncData" ADD CONSTRAINT "DSyncData_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "OrganizationSettings"("organizationId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DSyncTeamGroupMapping" ADD CONSTRAINT "DSyncTeamGroupMapping_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DSyncTeamGroupMapping" ADD CONSTRAINT "DSyncTeamGroupMapping_directoryId_fkey" FOREIGN KEY ("directoryId") REFERENCES "DSyncData"("directoryId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlatformBilling" ADD CONSTRAINT "PlatformBilling_id_fkey" FOREIGN KEY ("id") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttributeToUser" ADD CONSTRAINT "AttributeToUser_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Membership"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttributeToUser" ADD CONSTRAINT "AttributeToUser_attributeOptionId_fkey" FOREIGN KEY ("attributeOptionId") REFERENCES "AttributeOption"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttributeOption" ADD CONSTRAINT "AttributeOption_attributeId_fkey" FOREIGN KEY ("attributeId") REFERENCES "Attribute"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attribute" ADD CONSTRAINT "Attribute_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Host" ADD CONSTRAINT "Host_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Host" ADD CONSTRAINT "Host_eventTypeId_fkey" FOREIGN KEY ("eventTypeId") REFERENCES "EventType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Host" ADD CONSTRAINT "Host_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventType" ADD CONSTRAINT "EventType_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventType" ADD CONSTRAINT "EventType_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventType" ADD CONSTRAINT "EventType_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventType" ADD CONSTRAINT "EventType_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "EventType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventType" ADD CONSTRAINT "EventType_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventType" ADD CONSTRAINT "EventType_instantMeetingScheduleId_fkey" FOREIGN KEY ("instantMeetingScheduleId") REFERENCES "Schedule"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventType" ADD CONSTRAINT "EventType_secondaryEmailId_fkey" FOREIGN KEY ("secondaryEmailId") REFERENCES "SecondaryEmail"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workflow" ADD CONSTRAINT "Workflow_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workflow" ADD CONSTRAINT "Workflow_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowStep" ADD CONSTRAINT "WorkflowStep_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "Workflow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowReminder" ADD CONSTRAINT "WorkflowReminder_bookingUid_fkey" FOREIGN KEY ("bookingUid") REFERENCES "Booking"("uid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowReminder" ADD CONSTRAINT "WorkflowReminder_workflowStepId_fkey" FOREIGN KEY ("workflowStepId") REFERENCES "WorkflowStep"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WebhookScheduledTriggers" ADD CONSTRAINT "WebhookScheduledTriggers_webhookId_fkey" FOREIGN KEY ("webhookId") REFERENCES "Webhook"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WebhookScheduledTriggers" ADD CONSTRAINT "WebhookScheduledTriggers_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingSeat" ADD CONSTRAINT "BookingSeat_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingSeat" ADD CONSTRAINT "BookingSeat_attendeeId_fkey" FOREIGN KEY ("attendeeId") REFERENCES "Attendee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowsOnTeams" ADD CONSTRAINT "WorkflowsOnTeams_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "Workflow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowsOnTeams" ADD CONSTRAINT "WorkflowsOnTeams_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowsOnEventTypes" ADD CONSTRAINT "WorkflowsOnEventTypes_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "Workflow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowsOnEventTypes" ADD CONSTRAINT "WorkflowsOnEventTypes_eventTypeId_fkey" FOREIGN KEY ("eventTypeId") REFERENCES "EventType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DestinationCalendar" ADD CONSTRAINT "DestinationCalendar_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DestinationCalendar" ADD CONSTRAINT "DestinationCalendar_eventTypeId_fkey" FOREIGN KEY ("eventTypeId") REFERENCES "EventType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DestinationCalendar" ADD CONSTRAINT "DestinationCalendar_credentialId_fkey" FOREIGN KEY ("credentialId") REFERENCES "Credential"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingReference" ADD CONSTRAINT "BookingReference_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingReference" ADD CONSTRAINT "BookingReference_credentialId_fkey" FOREIGN KEY ("credentialId") REFERENCES "Credential"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendee" ADD CONSTRAINT "Attendee_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_eventTypeId_fkey" FOREIGN KEY ("eventTypeId") REFERENCES "EventType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_destinationCalendarId_fkey" FOREIGN KEY ("destinationCalendarId") REFERENCES "DestinationCalendar"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_reassignById_fkey" FOREIGN KEY ("reassignById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "App_RoutingForms_Form" ADD CONSTRAINT "App_RoutingForms_Form_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "App_RoutingForms_Form" ADD CONSTRAINT "App_RoutingForms_Form_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "App_RoutingForms_FormResponse" ADD CONSTRAINT "App_RoutingForms_FormResponse_formId_fkey" FOREIGN KEY ("formId") REFERENCES "App_RoutingForms_Form"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "App_RoutingForms_FormResponse" ADD CONSTRAINT "App_RoutingForms_FormResponse_routedToBookingUid_fkey" FOREIGN KEY ("routedToBookingUid") REFERENCES "Booking"("uid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_appId_fkey" FOREIGN KEY ("appId") REFERENCES "App"("slug") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstantMeetingToken" ADD CONSTRAINT "InstantMeetingToken_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstantMeetingToken" ADD CONSTRAINT "InstantMeetingToken_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApiKey" ADD CONSTRAINT "ApiKey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApiKey" ADD CONSTRAINT "ApiKey_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApiKey" ADD CONSTRAINT "ApiKey_appId_fkey" FOREIGN KEY ("appId") REFERENCES "App"("slug") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RateLimit" ADD CONSTRAINT "RateLimit_apiKeyId_fkey" FOREIGN KEY ("apiKeyId") REFERENCES "ApiKey"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Webhook" ADD CONSTRAINT "Webhook_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Webhook" ADD CONSTRAINT "Webhook_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Webhook" ADD CONSTRAINT "Webhook_eventTypeId_fkey" FOREIGN KEY ("eventTypeId") REFERENCES "EventType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Webhook" ADD CONSTRAINT "Webhook_platformOAuthClientId_fkey" FOREIGN KEY ("platformOAuthClientId") REFERENCES "PlatformOAuthClient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Webhook" ADD CONSTRAINT "Webhook_appId_fkey" FOREIGN KEY ("appId") REFERENCES "App"("slug") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HashedLink" ADD CONSTRAINT "HashedLink_eventTypeId_fkey" FOREIGN KEY ("eventTypeId") REFERENCES "EventType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Credential" ADD CONSTRAINT "Credential_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Credential" ADD CONSTRAINT "Credential_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Credential" ADD CONSTRAINT "Credential_appId_fkey" FOREIGN KEY ("appId") REFERENCES "App"("slug") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SelectedCalendar" ADD CONSTRAINT "SelectedCalendar_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SelectedCalendar" ADD CONSTRAINT "SelectedCalendar_credentialId_fkey" FOREIGN KEY ("credentialId") REFERENCES "Credential"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventTypeCustomInput" ADD CONSTRAINT "EventTypeCustomInput_eventTypeId_fkey" FOREIGN KEY ("eventTypeId") REFERENCES "EventType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CalendarCache" ADD CONSTRAINT "CalendarCache_credentialId_fkey" FOREIGN KEY ("credentialId") REFERENCES "Credential"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Authenticator" ADD CONSTRAINT "Authenticator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Calendar" ADD CONSTRAINT "Calendar_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlatformOAuthClient" ADD CONSTRAINT "PlatformOAuthClient_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlatformAuthorizationToken" ADD CONSTRAINT "PlatformAuthorizationToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlatformAuthorizationToken" ADD CONSTRAINT "PlatformAuthorizationToken_platformOAuthClientId_fkey" FOREIGN KEY ("platformOAuthClientId") REFERENCES "PlatformOAuthClient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccessToken" ADD CONSTRAINT "AccessToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccessToken" ADD CONSTRAINT "AccessToken_platformOAuthClientId_fkey" FOREIGN KEY ("platformOAuthClientId") REFERENCES "PlatformOAuthClient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_platformOAuthClientId_fkey" FOREIGN KEY ("platformOAuthClientId") REFERENCES "PlatformOAuthClient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_user_eventtype" ADD CONSTRAINT "_user_eventtype_A_fkey" FOREIGN KEY ("A") REFERENCES "EventType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_user_eventtype" ADD CONSTRAINT "_user_eventtype_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PlatformOAuthClientToUser" ADD CONSTRAINT "_PlatformOAuthClientToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "PlatformOAuthClient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PlatformOAuthClientToUser" ADD CONSTRAINT "_PlatformOAuthClientToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
