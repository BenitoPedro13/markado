import * as Select from '@/components/align-ui/ui/select';
import { routing } from '@/i18n/routing';
import { useLocale, useTranslations } from 'next-intl';
import LocaleSwitcherSelect from './LocaleSwitcherSelect';

/** A dropdown that allows users to switch between locales. */
export default function LocaleSwitcher() {
  const t = useTranslations('LocaleSwitcher');
  const locale = useLocale();

  return (
    <LocaleSwitcherSelect defaultValue={locale} label={t('label')}>
      {routing.locales.map((cur) => (
        <Select.Item
          key={cur}
          value={cur}
          className="text-text-sub-600 text-paragraph-sm"
        >
          {t('locale', {locale: cur})}
        </Select.Item>
      ))}
    </LocaleSwitcherSelect>
  );
}
