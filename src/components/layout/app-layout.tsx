'use client';

import Header from '@/components/layout/header';

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 flex">
        <div className="flex-1 flex flex-col">{children}</div>
      </main>
    </div>
  );
};

export default AppLayout;
