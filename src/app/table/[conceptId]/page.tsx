'use client';

import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowDown, ArrowUp, Link as LinkIcon, PlusCircle, Loader2 } from 'lucide-react';
import AddCausalLinkModal from '@/components/contribute/add-causal-link-modal';
import { useAuth } from '@/hooks/use-auth';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { CausalLink, getLinksForConcept, voteOnLink } from '@/lib/neo4j'; // Updated import

const statusStyles: Record<string, string> = {
  verified: 'bg-green-100 border-green-300 text-green-800 dark:bg-green-500/20 dark:border-green-500 dark:text-green-300',
  disputed: 'bg-yellow-100 border-yellow-300 text-yellow-800 dark:bg-yellow-500/20 dark:border-yellow-500 dark:text-yellow-300',
  pending: 'bg-gray-200 border-gray-400 text-gray-700 dark:bg-gray-500/20 dark:border-gray-500 dark:text-gray-300',
  rejected: 'bg-red-100 border-red-300 text-red-800 dark:bg-red-500/20 dark:border-red-500 dark:text-red-300',
};

type ConceptCardProps = {
  item: CausalLink;
  type: 'cause' | 'effect';
  isSelected: boolean;
  onSelect: () => void;
  onNavigate: (title: string) => void;
  onVote: (linkId: string, voteType: 'up' | 'down') => void;
};


const ConceptCard = ({ item, type, isSelected, onSelect, onNavigate, onVote }: ConceptCardProps) => {
  const { toast } = useToast();
  const statusStyle = statusStyles[item.status] || statusStyles.pending;
  const title = type === 'cause' ? item.cause : item.effect;
  const { user } = useAuth();


  const handleVote = (e: React.MouseEvent, voteType: 'up' | 'down') => {
    e.stopPropagation();
    if (!user) {
        toast({
            title: 'Login Required',
            description: `You must be logged in to vote.`,
            variant: 'destructive',
        });
        return;
    }
    onVote(item.id, voteType);
  };

  return (
    <div
      className={cn(
        "border rounded-lg p-4 flex flex-col h-full cursor-pointer transition-all bg-card/50",
        isSelected ? "border-primary shadow-lg scale-[1.02]" : "hover:border-primary/50 hover:shadow-md"
      )}
      onClick={onSelect}
    >
      <h3 className="text-lg font-semibold mb-2 capitalize cursor-pointer hover:underline" onClick={(e) => { e.stopPropagation(); onNavigate(title); }}>{title}</h3>
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
        <Badge className={cn('text-xs font-medium px-2 py-1 capitalize', statusStyle)} variant="outline">
          {item.status}
        </Badge>
        <div className="flex items-center gap-4 text-sm">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1 text-green-500 hover:bg-green-500/10 hover:text-green-500"
            onClick={(e) => handleVote(e, 'up')}
          >
            <ArrowUp size={16} />
            <span>{item.upvotes}</span>
          </Button>
          <Button
             variant="ghost"
             size="sm"
             className="flex items-center gap-1 text-red-500 hover:bg-red-500/10 hover:text-red-500"
             onClick={(e) => handleVote(e, 'down')}
          >
            <ArrowDown size={16} />
            <span>{item.downvotes}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default function TablePage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const conceptId = Array.isArray(params.conceptId) ? params.conceptId[0] : params.conceptId;
  const conceptName = decodeURIComponent(conceptId).replace(/-/g, ' ');
  const { toast } = useToast();
  
  const [causes, setCauses] = useState<CausalLink[]>([]);
  const [effects, setEffects] = useState<CausalLink[]>([]);
  const [loading, setLoading] = useState(true);

  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [selectedCause, setSelectedCause] = useState<string | null>(null);
  const [selectedEffect, setSelectedEffect] = useState<string | null>(null);
  
  const fetchLinks = async () => {
    setLoading(true);
    const { causes: fetchedCauses, effects: fetchedEffects } = await getLinksForConcept(conceptName);
    setCauses(fetchedCauses);
    setEffects(fetchedEffects);
    setLoading(false);
  };

  useEffect(() => {
    fetchLinks();
  }, [conceptId]);

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
    if (!user) {
      router.push('/auth/signin');
    } else {
      setIsLinkModalOpen(true);
    }
  };
  
  const handleVote = async (linkId: string, voteType: 'up' | 'down') => {
    if (!user) return;
    try {
        await voteOnLink(linkId, user.uid, voteType);
        toast({
            title: 'Vote Recorded',
            description: `Your ${voteType}vote has been recorded.`,
        });
        // Re-fetch links to update vote counts
        fetchLinks();
    } catch (error: any) {
        toast({
            title: 'Error',
            description: error.message,
            variant: 'destructive',
        });
    }
  };
  
  const selectedCauseConcept = useMemo(() => {
    if (!selectedCause) return null;
    return causes.find(c => c.id === selectedCause)?.cause;
  }, [selectedCause, causes]);

  const selectedEffectConcept = useMemo(() => {
    if (!selectedEffect) return null;
    return effects.find(e => e.id === selectedEffect)?.effect;
  }, [selectedEffect, effects]);

  const isProposeDisabled = !selectedCause || !selectedEffect;
  
  const ProposeLinkButton = () => (
    <Button onClick={handleProposeLinkClick} disabled={isProposeDisabled || !user}>
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
                   {!user ? (
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
        {loading ? (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-12 w-12 animate-spin" />
            </div>
        ) : (
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <h2 className="text-2xl font-semibold mb-4 text-center">Causes</h2>
                <div className="grid grid-cols-1 gap-6">
                {causes.length > 0 ? causes.map((item) => (
                    <ConceptCard 
                        key={item.id} 
                        item={item} 
                        type="cause"
                        isSelected={selectedCause === item.id}
                        onSelect={() => handleCardClick('cause', item.id)}
                        onNavigate={handleConceptNavigate}
                        onVote={handleVote}
                    />
                )) : <p className="text-center text-muted-foreground">No causes found.</p>}
                </div>
            </div>
            <div>
                <h2 className="text-2xl font-semibold mb-4 text-center">Effects</h2>
                <div className="grid grid-cols-1 gap-6">
                {effects.length > 0 ? effects.map((item) => (
                    <ConceptCard 
                        key={item.id} 
                        item={item} 
                        type="effect"
                        isSelected={selectedEffect === item.id}
                        onSelect={() => handleCardClick('effect', item.id)}
                        onNavigate={handleConceptNavigate}
                        onVote={handleVote}
                    />
                )) : <p className="text-center text-muted-foreground">No effects found.</p>}
                </div>
            </div>
            </div>
        )}

      </div>
      <AddCausalLinkModal
        isOpen={isLinkModalOpen}
        onOpenChange={setIsLinkModalOpen}
        baseConceptName={conceptName}
        causeConcept={selectedCauseConcept || undefined}
        effectConcept={selectedEffectConcept || undefined}
        onLinkAdded={fetchLinks}
      />
    </>
  );
}
