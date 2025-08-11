'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowDown, ArrowUp, LinkIcon, PlusCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AddCausalLinkModal from '@/components/contribute/add-causal-link-modal';
import { useAuth } from '@/hooks/use-auth';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

const generateMockData = (conceptId: string) => {
  const conceptName = decodeURIComponent(conceptId).replace(/-/g, ' ');

  const hashCode = (s: string) => s.split('').reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0);
  const seed = hashCode(conceptName);
  
  const causePrefixes = ['Factors leading to', 'Precursors of', 'Origins of', 'Underlying drivers of'];
  const effectPrefixes = ['Consequences of', 'Results of', 'Impacts of', 'Outcomes of'];
  const statuses = ['verified', 'pending', 'disputed', 'rejected'] as const;

  const createItems = (prefixes: string[], count: number, offset: number) => {
    return Array.from({ length: count }, (_, i) => {
      const prefix = prefixes[(seed + i * offset) % prefixes.length] || "Related to";
      const baseTitle = conceptName.replace(/(causes of|effects of|factors leading to|precursors of|origins of|underlying drivers of|consequences of|results of|impacts of|outcomes of)\s/gi, "");
      const title = `${prefix} ${baseTitle}`;
      const titleHash = hashCode(title + i);
      return {
        id: `${(prefix[0] || 'r').toLowerCase()}${i}`,
        title,
        status: statuses[(seed + i * offset) % statuses.length],
        upvotes: Math.abs(titleHash) % 200,
        downvotes: Math.abs(titleHash) % 50,
        description: `A mock description explaining the causal link related to "${title.toLowerCase()}".`,
        sourceURL: 'https://example.com/mock-source',
      };
    });
  };

  const causes = createItems(causePrefixes, 3, 3);
  const effects = createItems(effectPrefixes, 3, 5);

  return { causes, effects };
};

const statusStyles: Record<string, { bg: string; text: string }> = {
  verified: { bg: 'bg-green-500/20 text-green-900 dark:text-green-300', text: 'text-green-700 dark:text-green-400' },
  disputed: { bg: 'bg-yellow-500/20 text-yellow-900 dark:text-yellow-300', text: 'text-yellow-700 dark:text-yellow-400' },
  pending: { bg: 'bg-gray-500/20 text-gray-900 dark:text-gray-300', text: 'text-gray-700 dark:text-gray-400' },
  rejected: { bg: 'bg-red-500/20 text-red-900 dark:text-red-300', text: 'text-red-700 dark:text-red-400' },
};

export default function TablePage() {
  const router = useRouter();
  const params = useParams();
  const { isLoggedIn, toggleLogin } = useAuth();
  const conceptId = Array.isArray(params.conceptId) ? params.conceptId[0] : params.conceptId;
  const conceptName = decodeURIComponent(conceptId).replace(/-/g, ' ');
  
  const mockData = useMemo(() => generateMockData(conceptId), [conceptId]);

  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);

  const handleNewSearch = () => {
    router.push('/');
  };

  const handleConceptClick = (title: string) => {
    const formattedTerm = encodeURIComponent(title.trim().toLowerCase().replace(/\s/g, '-'));
    router.push(`/table/${formattedTerm}`);
  };

  const handleProposeLinkClick = () => {
    if (isLoggedIn) {
      setIsLinkModalOpen(true);
    } else {
      toggleLogin();
    }
  };
  
  const ProposeLinkButton = () => (
    <Button variant="outline" onClick={handleProposeLinkClick}>
      <PlusCircle className="mr-2 h-4 w-4" />
      Propose Link
    </Button>
  );

  const ConceptCard = ({ item }: { item: (typeof mockData.causes)[0] }) => {
    const statusStyle = statusStyles[item.status] || statusStyles.pending;
    return (
      <div 
        className="border rounded-lg p-4 flex flex-col h-full cursor-pointer hover:border-primary/50 hover:shadow-lg transition-all"
        onClick={() => handleConceptClick(item.title)}
      >
        <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
        <p className="text-muted-foreground text-sm flex-grow mb-4">{item.description}</p>
        
        <a 
          href={item.sourceURL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()} // Prevent card click from firing
          className="text-primary inline-flex items-center gap-2 text-sm hover:underline mb-4"
        >
          <LinkIcon size={14} />
          Source
        </a>

        <div className="flex items-center justify-between mt-auto">
          <Badge className={cn('text-xs font-medium px-2 py-1', statusStyle.bg, statusStyle.text)}>
            {item.status}
          </Badge>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1 text-green-500">
              <ArrowUp size={16} />
              <span>{item.upvotes}</span>
            </div>
            <div className="flex items-center gap-1 text-red-500">
              <ArrowDown size={16} />
              <span>{item.downvotes}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };


  return (
    <>
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-semibold capitalize tracking-tight">
            Exploring: <span className="text-primary">{conceptName}</span>
          </h1>
          <div className="flex items-center gap-2">
            {!isLoggedIn ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="cursor-pointer" onClick={handleProposeLinkClick}>
                      <ProposeLinkButton />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>You must be logged in to propose a link.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <ProposeLinkButton />
            )}
            <Link href={`/graph/${conceptId}`}>
              <Button variant="outline">Graph View</Button>
            </Link>
            <Button variant="secondary" onClick={handleNewSearch}>
              New Search
            </Button>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Causes</h2>
            <div className="grid grid-cols-1 gap-4">
              {mockData.causes.map((item) => (
                <ConceptCard key={item.id} item={item} />
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4">Effects</h2>
            <div className="grid grid-cols-1 gap-4">
              {mockData.effects.map((item) => (
                <ConceptCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        </div>
      </div>
      <AddCausalLinkModal
        isOpen={isLinkModalOpen}
        onOpenChange={setIsLinkModalOpen}
        baseConceptName={conceptName}
      />
    </>
  );
}
