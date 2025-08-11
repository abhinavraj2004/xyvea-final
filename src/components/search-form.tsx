'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Mic, Paperclip, Search } from 'lucide-react';

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
        <Input
          type="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Ask anything"
          className="w-full rounded-2xl bg-background border-white/20 shadow-lg py-7 pl-28 pr-20 text-lg"
        />
        <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
           <Button type="button" variant="outline" size="sm" className="rounded-full bg-transparent border-white/20 hover:bg-white/10">
              <Paperclip size={16} />
              Attach
            </Button>
            <Button type="button" variant="outline" size="sm" className="rounded-full bg-transparent border-white/20 hover:bg-white/10">
              <Search size={16}/>
              Search
            </Button>
        </div>
        <Button type="submit" size="icon" className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full h-10 w-10 bg-white/10 hover:bg-white/20">
          <Mic size={20}/>
        </Button>
      </div>
    </form>
  );
}
