
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/hooks/use-auth';
import { PlusCircle, MessageSquare, Settings, User, LogOut, ChevronsUpDown } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';


const mockHistory = [
  "Causes of Climate Change",
  "Impact of AI on Jobs",
  "Economic effects of remote work",
  "Factors influencing vaccination rates",
  "History of the Roman Empire",
  "Principles of Quantum Mechanics",
  "The rise of social media",
  "Renewable energy sources",
];


type SidebarProps = {
  isSheet?: boolean;
  onLinkClick?: () => void;
};


export default function Sidebar({ isSheet = false, onLinkClick }: SidebarProps) {
  const { toggleLogin } = useAuth();
  const router = useRouter();
  const [isHistoryOpen, setIsHistoryOpen] = useState(true);

  const handleContribute = () => {
    router.push('/contribute');
    onLinkClick?.();
  };
  
  const handleNavigate = (path: string) => {
    router.push(path);
    onLinkClick?.();
  };
  
  const handleLogout = () => {
    toggleLogin();
    onLinkClick?.();
  };

  const handleHistoryClick = (item: string) => {
    const formattedTerm = encodeURIComponent(item.trim().toLowerCase().replace(/\s/g, '-'));
    router.push(`/graph/${formattedTerm}`);
    onLinkClick?.();
  }

  const content = (
    <div className="flex flex-col h-full">
      <div className="p-4">
        <Button className="w-full" onClick={handleContribute}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Contribute
        </Button>
      </div>
      <Collapsible open={isHistoryOpen} onOpenChange={setIsHistoryOpen} className="flex-1 flex flex-col px-2">
        <div className="px-2 mb-2">
          <CollapsibleTrigger asChild>
            <button className="flex items-center justify-between w-full hover:bg-accent p-2 rounded-md">
              <h2 className="text-lg font-semibold tracking-tight">History</h2>
              <ChevronsUpDown className={cn("h-4 w-4 text-muted-foreground transition-transform", isHistoryOpen && "rotate-180")} />
            </button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent asChild>
          <div className="flex-1 flex flex-col min-h-0">
            <ScrollArea className="flex-1 px-2">
              <div className="space-y-1">
                {mockHistory.map((item) => (
                  <Button
                    key={item}
                    variant="ghost"
                    className="w-full justify-start font-normal truncate"
                    onClick={() => handleHistoryClick(item)}
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    {item}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </CollapsibleContent>
      </Collapsible>
      
      {isSheet && (
         <div className="mt-auto border-t p-4 space-y-2">
           <Button variant="ghost" className="w-full justify-start" onClick={() => handleNavigate('/profile')}>
             <User className="mr-2 h-4 w-4" />
             Profile
           </Button>
           <Button variant="ghost" className="w-full justify-start" onClick={() => handleNavigate('/settings')}>
             <Settings className="mr-2 h-4 w-4" />
             Settings
           </Button>
           <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
             <LogOut className="mr-2 h-4 w-4" />
             Log Out
           </Button>
         </div>
      )}
    </div>
  );

  if (isSheet) {
    return content;
  }

  return (
    <aside className="hidden md:flex flex-col w-64 fixed top-0 left-0 h-full border-r pt-14 bg-background">
      {content}
    </aside>
  );
}
