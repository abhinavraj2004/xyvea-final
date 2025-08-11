'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Send } from 'lucide-react';

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
    <form onSubmit={handleSearch} className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Explore concepts like 'economic inflation' or 'climate change'..."
          className="w-full rounded-2xl bg-background border-white/20 shadow-lg py-6 sm:py-7 pl-10 sm:pl-12 pr-12 sm:pr-14 text-base sm:text-lg"
        />
        <Button type="submit" size="icon" className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 rounded-full h-8 w-8 sm:h-10 sm:w-10 bg-primary hover:bg-primary/90 text-primary-foreground">
          <Send size={18}/>
          <span className="sr-only">Search</span>
        </Button>
      </div>
    </form>
  );
}
