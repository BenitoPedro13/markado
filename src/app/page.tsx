import PageLayout from '@/components/PageLayout';
import Home from '@/modules/home/home-view';
import {useTranslations} from 'next-intl';
import Header from '@/components/navigation/Header';
import * as Divider from '@/components/align-ui/ui/divider';
import { cookies } from 'next/headers';

/** Actual home page of the website.
 * 
  The user is redirected to this page when them types the website URL.
*/
export default function IndexPage() {
  const t = useTranslations('IndexPage');

  return (
    <PageLayout title="Home">
      {/* <Header variant="scheduling"/> */}
      <Header variant="availability" mode="inside" />
      <Divider.Root />

      <Home />
    </PageLayout>
  );
}
