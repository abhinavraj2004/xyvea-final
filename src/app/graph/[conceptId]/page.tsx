'use client';

import { useEffect, useState } from 'react';
import GraphView from '@/components/graph/graph-view';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { PlusCircle, Loader2 } from 'lucide-react';
import AddCausalLinkModal from '@/components/contribute/add-causal-link-modal';
import AddConceptModal from '@/components/contribute/add-concept-modal';
import { useAuth } from '@/hooks/use-auth';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { getConceptByTitle } from '@/lib/neo4j'; // Updated import

export default function GraphPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const conceptId = Array.isArray(params.conceptId) ? params.conceptId[0] : params.conceptId;
  const conceptName = decodeURIComponent(conceptId).replace(/-/g, ' ');

  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isConceptModalOpen, setIsConceptModalOpen] = useState(false);
  const [conceptExists, setConceptExists] = useState<boolean | null>(null);

  useEffect(() => {
    const checkConcept = async () => {
      const concept = await getConceptByTitle(conceptName);
      setConceptExists(!!concept);
    };
    checkConcept();
  }, [conceptName]);


  const handleNewSearch = () => {
    router.push('/');
  };
  
  const handleProposeLinkClick = () => {
    if (!user) {
      router.push('/auth/signin');
    } else {
      setIsLinkModalOpen(true);
    }
  };

  const handleContributeClick = () => {
     if (!user) {
      router.push('/auth/signin');
    } else {
      setIsConceptModalOpen(true);
    }
  }

  const ProposeLinkButton = () => (
    <Button variant="outline" onClick={handleProposeLinkClick}>
      <PlusCircle className="mr-2 h-4 w-4" />
      Propose Link
    </Button>
  );

  if (conceptExists === null) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
        <Loader2 className="h-16 w-16 animate-spin" />
      </div>
    );
  }

  if (!conceptExists) {
    return (
        <>
            <div className="container mx-auto max-w-7xl px-4 py-8 flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
                <div className="text-center">
                    <h1 className="text-3xl font-semibold capitalize">Nothing about '{conceptName}' yet.</h1>
                    <p className="text-muted-foreground mt-4 max-w-md">Be the first to add this concept to the knowledge graph and start mapping its connections.</p>
                    <div className="mt-6 flex gap-4 justify-center">
                        <Button onClick={handleContributeClick}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Contribute Topic
                        </Button>
                        <Button variant="secondary" onClick={handleNewSearch}>
                            New Search
                        </Button>
                    </div>
                </div>
            </div>
            <AddConceptModal 
                isOpen={isConceptModalOpen}
                onOpenChange={setIsConceptModalOpen}
                initialTitle={conceptName}
            />
        </>
    )
  }

  return (
    <>
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-semibold capitalize tracking-tight">
            Exploring: <span className="text-primary">{conceptName}</span>
          </h1>
          <div className="flex items-center gap-2">
            {!user ? (
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
            <Link href={`/table/${conceptId}`}>
              <Button variant="outline">Tabular View</Button>
            </Link>
            <Button variant="secondary" onClick={handleNewSearch}>
              New Search
            </Button>
          </div>
        </div>
        <div className="mt-8">
          <GraphView centralConceptId={conceptId} onContributeClick={() => setIsConceptModalOpen(true)} />
        </div>
      </div>
      <AddCausalLinkModal
        isOpen={isLinkModalOpen}
        onOpenChange={setIsLinkModalOpen}
        baseConceptName={conceptName}
      />
      <AddConceptModal 
        isOpen={isConceptModalOpen}
        onOpenChange={setIsConceptModalOpen}
        initialTitle={conceptName}
      />
    </>
  );
}
