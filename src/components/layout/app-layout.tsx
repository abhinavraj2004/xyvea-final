'use client';

import Header from '@/components/layout/header';
import HistorySidebar from '@/components/layout/history-sidebar';
import { useAuth } from '@/hooks/use-auth';

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn } = useAuth();
  return (
    <div className="relative flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 flex">
        {isLoggedIn && (
          <div className="hidden md:block w-64 border-r">
            <HistorySidebar />
          </div>
        )}
        <div className="flex-1 flex flex-col">{children}</div>
      </main>
    </div>
  );
};

export default AppLayout;
