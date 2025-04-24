import type { PluginFunc } from "dayjs";
declare module "dayjs" {
  interface BusinessDaysPluginOptions {
    holidays?: string[];
    holidayFormat?: string;
    additionalWorkingDays?: string[];
    additionalWorkingDayFormat?: string;
    workingWeekdays?: number[];
  }

  interface Dayjs {
    isHoliday(): boolean;
    isBusinessDay(): boolean;
    isAdditionalWorkingDay(): boolean;
    businessDaysAdd(days: number): Dayjs;
    businessDaysSubtract(days: number): Dayjs;
    businessDiff(date: Dayjs): number;
    nextBusinessDay(): Dayjs;
    prevBusinessDay(): Dayjs;
    businessDaysInMonth(): Dayjs[];
    lastBusinessDayOfMonth(): Dayjs;
    businessWeeksInMonth(): Dayjs[][];
  }

  interface DayjsStatic {
    getWorkingWeekdays(): number[];
    setWorkingWeekdays(workingWeekdays: number[]): void;
    getHolidays(): string[];
    setHolidays(holidays: string[]): void;
    getHolidayFormat(): string | undefined;
    setHolidayFormat(holidayFormat: string): void;
    getAdditionalWorkingDays(): string[];
    setAdditionalWorkingDays(additionalWorkingDays: string[]): void;
    getAdditionalWorkingDayFormat(): string | undefined;
    setAdditionalWorkingDayFormat(additionalWorkingDayFormat: string): void;
  }
}

declare const plugin: PluginFunc<{
  holidays?: string[];
  holidayFormat?: string;
  additionalWorkingDays?: string[];
  additionalWorkingDayFormat?: string;
  workingWeekdays?: number[];
}>;
export default plugin;
