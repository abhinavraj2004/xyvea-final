'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/hooks/use-auth';
import { PlusCircle, MessageSquare, Settings, User, LogOut, Loader2, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { HistoryItem } from '@/types';

type SidebarProps = {
  isSheet?: boolean;
  onLinkClick?: () => void;
  isVisible?: boolean;
};


export default function Sidebar({ isSheet = false, onLinkClick, isVisible = true }: SidebarProps) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  const handleContribute = () => {
    router.push('/contribute');
    onLinkClick?.();
  };
  
  const handleNavigate = (path: string) => {
    router.push(path);
    onLinkClick?.();
  };
  
  const handleLogout = () => {
    logout();
    onLinkClick?.();
  };

  const handleHistoryClick = (item: HistoryItem) => {
    const formattedTerm = encodeURIComponent(item.searchTerm.trim().toLowerCase().replace(/\s/g, '-'));
    router.push(`/graph/${formattedTerm}`);
    onLinkClick?.();
  }

  const handleDonateClick = () => {
    window.open('https://buymeacoffee.com/xyvea', '_blank');
    onLinkClick?.();
  };

  const content = (
    <div className="flex flex-col h-full">
      <div className="p-4 space-y-2">
        <Button className="w-full" onClick={handleContribute}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Contribute
        </Button>
         <Button className="w-full" variant="outline" onClick={handleDonateClick}>
          <Heart className="mr-2 h-4 w-4 text-red-500" />
          Donate
        </Button>
      </div>
      <div className="flex-1 flex flex-col px-2">
        <div className="px-2 mb-2">
          <h2 className="text-lg font-semibold tracking-tight">History</h2>
        </div>
        <div className="flex-1 flex flex-col min-h-0">
          {loading ? (
             <div className="flex-1 flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin" />
             </div>
          ) : (
            <ScrollArea className="flex-1 px-2">
              <div className="space-y-1">
                {user?.searchHistory && user.searchHistory.length > 0 ? (
                    user.searchHistory.map((item) => (
                    <Button
                        key={item.id}
                        variant="ghost"
                        className="w-full justify-start font-normal truncate"
                        onClick={() => handleHistoryClick(item)}
                    >
                        <MessageSquare className="mr-2 h-4 w-4" />
                        {item.searchTerm}
                    </Button>
                    ))
                ) : (
                    <p className="text-sm text-muted-foreground p-2">No history yet.</p>
                )}
              </div>
            </ScrollArea>
          )}
        </div>
      </div>
      
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
    <aside
      className={cn(
        'hidden md:flex flex-col w-64 fixed top-0 left-0 h-full border-r pt-14 bg-background transition-transform duration-300 ease-in-out z-40',
        isVisible ? 'translate-x-0' : '-translate-x-full'
      )}
    >
      {content}
    </aside>
  );
}
