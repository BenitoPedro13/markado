'use client';

import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState
} from 'react';

interface PageContextProps {
  pageName: string;
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: Dispatch<SetStateAction<boolean>>;
}

const PageContext = createContext<PageContextProps | undefined>(undefined);

export const usePageContext = () => {
  const context = useContext(PageContext);
  if (!context) {
    throw new Error('usePageContext must be used within a PageProvider');
  }
  return context;
};

export const PageProvider = ({
  pageName,
  children
}: {
  pageName: string;
  children: React.ReactNode;
}) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <PageContext.Provider
      value={{pageName, isCreateModalOpen, setIsCreateModalOpen}}
    >
      {children}
    </PageContext.Provider>
  );
};
