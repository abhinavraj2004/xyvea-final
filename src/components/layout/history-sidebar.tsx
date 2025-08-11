
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, PlusCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();

  const handleNewSearch = () => {
    router.push('/');
  };

  const handleContributeClick = () => {
    router.push('/contribute');
  };

  const formatNameToUrl = (name: string) => {
    return encodeURIComponent(name.trim().toLowerCase().replace(/\s/g, '-'));
  };

  return (
    <aside className="flex flex-col h-full bg-background p-4 border-r">
       <div className="flex flex-col gap-4 mb-4 pt-12 md:pt-0">
          <Button onClick={handleContributeClick}>
            <PlusCircle />
            Contribute
          </Button>
       </div>
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
