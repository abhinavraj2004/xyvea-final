'use client';

import Header from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';
import { useAuth } from '@/hooks/use-auth';

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn } = useAuth();
  return (
    <div className="relative flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 flex">
        {isLoggedIn ? (
          <>
            <Sidebar />
            <div className="flex-1 flex flex-col pl-0 md:pl-64">{children}</div>
          </>
        ) : (
          <div className="flex-1 flex flex-col">{children}</div>
        )}
      </main>
    </div>
  );
};

export default AppLayout;
