import {PageProvider} from '@/contexts/PageContext';
import {ReactNode} from 'react';
import Sidebar from '@/components/navigation/Global/Sidebar';
type Props = {
  children?: ReactNode;
  title: string;
};

/** Layout for all pages. You can customize it as you want. */
export default function PageLayout({children, title}: Props) {
  /** If all of your pages will have some text inside it, use the translation to render it. */
  // const t = useTranslations('PageLayout');

  return (
    <PageProvider pageName={title}>
      <Sidebar>{children}</Sidebar>
    </PageProvider>
  );
}
