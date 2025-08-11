
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus } from 'lucide-react';

// Mock data for search history
const mockHistory = [
  { id: '1', name: 'Causes of Climate Change' },
  { id: '2', name: 'Impact of AI on Jobs' },
  { id: '3', name: 'Economic effects of remote work' },
  { id: '4', name: 'Factors influencing vaccination rates' },
  { id: '5', name: 'Subprime mortgage crisis' },
  { id: '6', name: '2008 Financial Crisis' },
  { id: '7', name: 'Rise of social media' },
];

export default function HistorySidebar() {
  const handleNewSearch = () => {
    // In a real app, this would clear the search input and start a new session
    console.log('New search started');
  };

  const formatNameToUrl = (name: string) => {
    return encodeURIComponent(name.trim().toLowerCase().replace(/\s/g, '-'));
  };

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-border/40 bg-background/95 p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold tracking-tight">History</h2>
        <Button variant="ghost" size="icon" onClick={handleNewSearch}>
          <Plus />
          <span className="sr-only">New Search</span>
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-2 pr-4">
          {mockHistory.map((item) => (
            <Button
              key={item.id}
              variant="link"
              className="w-full justify-start text-muted-foreground hover:text-foreground h-auto p-2"
              asChild
            >
              <Link href={`/graph/${formatNameToUrl(item.name)}`}>
                <span className="truncate">{item.name}</span>
              </Link>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </aside>
  );
}
