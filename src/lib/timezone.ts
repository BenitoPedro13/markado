import type {ITimezoneOption} from 'react-timezone-select';

import dayjs from '@/lib/dayjs';

function isProblematicTimezone(tz: string): boolean {
  const problematicTimezones = [
    'null',
    'Africa/Malabo',
    'Africa/Maseru',
    'Africa/Mbabane',
    'America/Anguilla',
    'America/Antigua',
    'America/Aruba',
    'America/Bahia',
    'America/Cayman',
    'America/Dominica',
    'America/Grenada',
    'America/Guadeloupe',
    'America/Kralendijk',
    'America/Lower_Princes',
    'America/Maceio',
    'America/Marigot',
    'America/Montserrat',
    'America/Nassau',
    'America/St_Barthelemy',
    'America/St_Kitts',
    'America/St_Lucia',
    'America/St_Thomas',
    'America/St_Vincent',
    'America/Tortola',
    'Antarctica/McMurdo',
    'Arctic/Longyearbyen',
    'Asia/Bahrain',
    'Atlantic/St_Helena',
    'Europe/Busingen',
    'Europe/Guernsey',
    'Europe/Isle_of_Man',
    'Europe/Mariehamn',
    'Europe/San_Marino',
    'Europe/Vaduz',
    'Europe/Vatican',
    'Indian/Comoro',
    'Pacific/Saipan',
    'Africa/Asmara'
  ];
  return problematicTimezones.includes(tz);
}

export type Timezones = {label: string; timezone: string}[];

const searchTextFilter = (tzOption: Timezones[number], searchText: string) => {
  return (
    searchText &&
    tzOption.label.toLowerCase().includes(searchText.toLowerCase())
  );
};

export const filterBySearchText = (
  searchText: string,
  timezones: Timezones
) => {
  return timezones.filter((tzOption) => searchTextFilter(tzOption, searchText));
};

export const addTimezonesToDropdown = (timezones: Timezones) => {
  return Object.fromEntries(
    timezones
      .filter(({timezone}) => {
        return timezone !== null && !isProblematicTimezone(timezone);
      })
      .map(({label, timezone}) => [timezone, label])
  );
};

const formatOffset = (offset: string) =>
  offset.replace(
    /^([-+])(0)(\d):00$/,
    (_, sign, _zero, hour) => `${sign}${hour}:00`
  );

export const handleOptionLabel = (
  option: ITimezoneOption,
  timezones: Timezones
) => {
  const offsetUnit = option.label.split('-')[0].substring(1);
  const cityName = option.label.split(') ')[1];

  const timezoneValue = ` ${offsetUnit} ${formatOffset(dayjs.tz(undefined, option.value).format('Z'))}`;
  return timezones.length > 0
    ? `${cityName}${timezoneValue}`
    : `${option.value.replace(/_/g, ' ')}${timezoneValue}`;
};
