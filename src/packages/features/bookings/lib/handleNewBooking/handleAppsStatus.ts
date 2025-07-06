import type { AdditionalInformation, AppsStatus } from "@/types/Calendar";
import type { EventResult } from "@/packages/types/EventManager";
import type {AppMeta} from '@/packages/types/App';
import type { ReqAppsStatus, Booking } from "./types";

export function handleAppsStatus(
  results: EventResult<AdditionalInformation>[],
  booking: (Booking & { appsStatus?: AppsStatus[] }) | null,
  reqAppsStatus: ReqAppsStatus
): AppsStatus[] {
  const resultStatus = mapResultsToAppsStatus(results);

  if (reqAppsStatus === undefined) {
    return updateBookingWithStatus(booking, resultStatus);
  }

  return calculateAggregatedAppsStatus(reqAppsStatus, resultStatus);
}

function mapResultsToAppsStatus(results: EventResult<AdditionalInformation>[]): AppsStatus[] {
  return results.map((app) => ({
    appName: app.appName,
    type: app.type as AppMeta['type'],
    success: app.success ? 1 : 0,
    failures: !app.success ? 1 : 0,
    errors: app.calError ? [app.calError] : [],
    warnings: app.calWarnings
  }));
}

function updateBookingWithStatus(
  booking: (Booking & { appsStatus?: AppsStatus[] }) | null,
  resultStatus: AppsStatus[]
): AppsStatus[] {
  if (booking !== null) {
    booking.appsStatus = resultStatus;
  }
  return resultStatus;
}

function calculateAggregatedAppsStatus(
  reqAppsStatus: NonNullable<ReqAppsStatus>,
  resultStatus: AppsStatus[]
): AppsStatus[] {
  // From down here we can assume reqAppsStatus is not undefined anymore
  // Other status exist, so this is the last booking of a series,
  // proceeding to prepare the info for the event
  const aggregatedStatus = reqAppsStatus.concat(resultStatus).reduce((acc, curr) => {
    if (acc[curr.type]) {
      acc[curr.type].success += curr.success;
      acc[curr.type].errors = acc[curr.type].errors.concat(curr.errors);
      acc[curr.type].warnings = acc[curr.type].warnings?.concat(curr.warnings || []);
    } else {
      acc[curr.type] = curr as AppsStatus;
    }
    return acc;
  }, {} as { [key: string]: AppsStatus });

  return Object.values(aggregatedStatus);
}
