'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

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
      <Input
        type="search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Ask about a concept and its connections..."
        className="w-full rounded-lg bg-background border-border/50 shadow-lg py-6 pl-4 pr-14"
      />
      <Button type="submit" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md h-9 w-9">
        <Send size={18}/>
      </Button>
    </form>
  );
}
