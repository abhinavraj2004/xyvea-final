'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

export function SearchForm() {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      const formattedTerm = encodeURIComponent(searchTerm.trim().toLowerCase().replace(/\s/g, '-'));
      router.push(`/graph/${formattedTerm}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="mt-8 flex w-full max-w-2xl flex-col items-center gap-4 sm:flex-row">
      <div className="relative w-full">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
        <Input
          type="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for a concept to see its connections..."
          className="w-full rounded-full bg-muted py-6 pl-12 pr-4 sm:pr-24"
        />
      </div>
      <Button type="submit" size="lg" className="w-full shrink-0 sm:w-auto rounded-full">
        Search
      </Button>
    </form>
  );
}
