'use client';

import { useState } from 'react';
import Header from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="relative flex min-h-screen flex-col">
      <Header onToggleSidebar={toggleSidebar} isSidebarVisible={isSidebarOpen} />
      <main className="flex-1 flex">
        {isLoggedIn ? (
          <>
            <Sidebar isVisible={isSidebarOpen} />
            <div
              className={cn(
                'flex-1 flex flex-col transition-all duration-300 ease-in-out',
                isSidebarOpen ? 'pl-0 md:pl-64' : 'pl-0'
              )}
            >
              {children}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col">{children}</div>
        )}
      </main>
    </div>
  );
};

export default AppLayout;
