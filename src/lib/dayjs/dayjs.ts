import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import duration from 'dayjs/plugin/duration';
import isBetween from 'dayjs/plugin/isBetween';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isToday from 'dayjs/plugin/isToday';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import minmax from 'dayjs/plugin/minMax';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import toArray from 'dayjs/plugin/toArray';
import utc from 'dayjs/plugin/utc';

import BusinessDaysPlugin from './plugins/business-days-plugin';

// Initialize dayjs plugins
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);
dayjs.extend(BusinessDaysPlugin);
dayjs.extend(isBetween);
dayjs.extend(isToday);
dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);
dayjs.extend(toArray);
dayjs.extend(minmax);
dayjs.extend(duration);
dayjs.extend(isSameOrAfter);

// Import the type declarations to ensure they're recognized
import './plugins/business-days-plugin';

export type Dayjs = dayjs.Dayjs;
export type { ConfigType } from 'dayjs';

export default dayjs; 