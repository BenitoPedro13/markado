type WeekdayFormat = 'short' | 'long';

// By default starts on Sunday (Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday)
export function weekdayNames(
  locale: string | string[],
  weekStart = 0,
  format: WeekdayFormat = 'long'
) {
  return Array(7)
    .fill(null)
    .map((_, day) => nameOfDay(locale, day + weekStart, format));
}

export function nameOfDay(
  locale: string | string[] | undefined,
  day: number,
  format: WeekdayFormat = 'long'
) {
  return new Intl.DateTimeFormat(locale, {weekday: format}).format(
    new Date(1970, 0, day + 4)
  );
}

import {format} from 'date-fns';
import {ptBR} from 'date-fns/locale';
import {enUS} from 'date-fns/locale';

/**
 * Formata uma data para o padrão "EEEE, d 'de' MMMM" em português do Brasil ou "EEEE, MMMM d" em inglês.
 * Exemplo: Segunda-feira, 1 de janeiro (pt-BR) ou Monday, January 1 (en-US)
 * @param date Data a ser formatada
 * @param localeStr Idioma: 'pt-BR', 'en-US' ou qualquer string (fallback para 'pt-BR')
 */
export function formatLongDateIntl(
  date: Date,
  localeStr: string = 'pt-BR'
): string {
  console.log('localeStr', localeStr)

  if (localeStr === 'en') {
    return format(date, 'EEEE, MMMM d', {locale: enUS});
  }
  return format(date, "EEEE, d 'de' MMMM", {locale: ptBR});
}
