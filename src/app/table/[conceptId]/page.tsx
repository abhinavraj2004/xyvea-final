'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowDown, ArrowUp, LinkIcon, PlusCircle } from 'lucide-react';
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
        id: `${(prefix?.[0] || 'r').toLowerCase()}${i}`,
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

const statusStyles: Record<string, string> = {
  verified: 'bg-green-500/20 border-green-500 text-green-300',
  disputed: 'bg-yellow-500/20 border-yellow-500 text-yellow-300',
  pending: 'bg-gray-500/20 border-gray-500 text-gray-300',
  rejected: 'bg-red-500/20 border-red-500 text-red-300',
};

type ConceptCardProps = {
  item: ReturnType<typeof generateMockData>['causes'][0];
  isSelected: boolean;
  onSelect: () => void;
  onNavigate: (title: string) => void;
};


const ConceptCard = ({ item, isSelected, onSelect, onNavigate }: ConceptCardProps) => {
  const statusStyle = statusStyles[item.status] || statusStyles.pending;
  return (
    <div
      className={cn(
        "border rounded-lg p-4 flex flex-col h-full cursor-pointer transition-all bg-card/50",
        isSelected ? "border-primary shadow-lg scale-[1.02]" : "hover:border-primary/50 hover:shadow-md"
      )}
      onClick={onSelect}
    >
      <h3 className="text-lg font-semibold mb-2 cursor-pointer hover:underline" onClick={(e) => { e.stopPropagation(); onNavigate(item.title); }}>{item.title}</h3>
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

      <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/50">
        <Badge className={cn('text-xs font-medium px-2 py-1', statusStyle)} variant="outline">
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

export default function TablePage() {
  const router = useRouter();
  const params = useParams();
  const { isLoggedIn, toggleLogin } = useAuth();
  const conceptId = Array.isArray(params.conceptId) ? params.conceptId[0] : params.conceptId;
  const conceptName = decodeURIComponent(conceptId).replace(/-/g, ' ');
  
  const mockData = useMemo(() => generateMockData(conceptId), [conceptId]);

  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [selectedCause, setSelectedCause] = useState<string | null>(null);
  const [selectedEffect, setSelectedEffect] = useState<string | null>(null);

  const handleCardClick = (type: 'cause' | 'effect', id: string) => {
    if (type === 'cause') {
      setSelectedCause(prev => (prev === id ? null : id));
    } else {
      setSelectedEffect(prev => (prev === id ? null : id));
    }
  };

  const handleNewSearch = () => {
    router.push('/');
  };

  const handleConceptNavigate = (title: string) => {
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
  
  const isProposeDisabled = !selectedCause || !selectedEffect;
  
  const ProposeLinkButton = () => (
    <Button onClick={handleProposeLinkClick} disabled={isProposeDisabled || !isLoggedIn}>
      <PlusCircle className="mr-2 h-4 w-4" />
      Propose Link
    </Button>
  );

  return (
    <>
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-semibold capitalize tracking-tight">
            Exploring: <span className="text-primary">{conceptName}</span>
          </h1>
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  {/* The div is necessary to ensure the tooltip works when the button is disabled */}
                  <div className="cursor-pointer" onClick={(e) => { if (isProposeDisabled) e.preventDefault(); }}>
                     <ProposeLinkButton />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                   {!isLoggedIn ? (
                     <p>You must be logged in to propose a link.</p>
                   ) : isProposeDisabled ? (
                     <p>Select a cause and an effect to propose a link.</p>
                   ) : (
                    <p>Create a new link between the selected concepts.</p>
                   )}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

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
            <h2 className="text-2xl font-semibold mb-4 text-center">Causes</h2>
            <div className="grid grid-cols-1 gap-6">
              {mockData.causes.map((item) => (
                <ConceptCard 
                  key={item.id} 
                  item={item} 
                  isSelected={selectedCause === item.id}
                  onSelect={() => handleCardClick('cause', item.id)}
                  onNavigate={handleConceptNavigate}
                />
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-center">Effects</h2>
            <div className="grid grid-cols-1 gap-6">
              {mockData.effects.map((item) => (
                <ConceptCard 
                  key={item.id} 
                  item={item} 
                  isSelected={selectedEffect === item.id}
                  onSelect={() => handleCardClick('effect', item.id)}
                  onNavigate={handleConceptNavigate}
                />
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
