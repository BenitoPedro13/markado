import LocaleSwitcher from '@/components/LocaleSwitcher';

interface SchedulingLayoutProps {
  children: React.ReactNode;
  params: Promise<{username: string}>;
}

export default function SchedulingLayout({children}: SchedulingLayoutProps) {
  return (
    <div className="w-full h-full px-11 py-6 flex flex-col">
      {/* Content */}
      <div className="grow flex flex-col items-center justify-center">
        {children}
      </div>
      {/* Footer */}
      <footer className="mt-auto w-full flex justify-between items-center">
        <p className="text-paragraph-sm text-text-sub-600">
          &copy; {new Date().getFullYear()} Markado
        </p>
        <LocaleSwitcher />
      </footer>
    </div>
  );
}
