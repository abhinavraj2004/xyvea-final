import { Share2 } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center gap-2">
       <Share2 className="h-6 w-6 text-primary" />
      <span className="text-xl font-semibold">Xyvea</span>
    </div>
  );
}
