
import PageLayout from '@/components/PageLayout';
import Home from '@/modules/home/home-view';
import {useTranslations} from 'next-intl';
import {setRequestLocale} from 'next-intl/server';
import Header from '@/components/navigation/Header';
type Props = {
  params: {locale: string};
};

/** Actual home page of the website.
 * 
  The user is redirected to this page when them types the website URL.
*/
export default function IndexPage({params: {locale}}: Props) {
  // Enable static rendering
  setRequestLocale(locale);

  const t = useTranslations('IndexPage');

  return (
    <PageLayout title="Home">
      <Header />
      <Home />
    </PageLayout>
  );
}
