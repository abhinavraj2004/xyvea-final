import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { SearchForm } from '@/components/search-form';
import { Logo } from '@/components/layout/logo';

export default function Home() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
            <Logo />
        </div>
      </div>
      <div className="flex-none p-4 md:p-6">
        <div className="mx-auto w-full max-w-2xl">
          <SearchForm />
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Xyvea can make mistakes. Consider checking important information.
          </p>
        </div>
      </div>
    </div>
  );
}
