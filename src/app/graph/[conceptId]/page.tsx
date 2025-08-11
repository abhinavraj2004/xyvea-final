'use client';

import { useState } from 'react';
import GraphView from '@/components/graph/graph-view';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { PlusCircle } from 'lucide-react';
import AddCausalLinkModal from '@/components/contribute/add-causal-link-modal';
import { useAuth } from '@/hooks/use-auth';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function GraphPage() {
  const router = useRouter();
  const params = useParams();
  const { isLoggedIn, toggleLogin } = useAuth();
  const conceptId = Array.isArray(params.conceptId) ? params.conceptId[0] : params.conceptId;
  const conceptName = decodeURIComponent(conceptId).replace(/-/g, ' ');
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);

  const handleNewSearch = () => {
    router.push('/');
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

  return (
    <>
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-semibold capitalize tracking-tight">
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
            <Link href={`/table/${conceptId}`}>
              <Button variant="outline">Tabular View</Button>
            </Link>
            <Button variant="secondary" onClick={handleNewSearch}>
              New Search
            </Button>
          </div>
        </div>
        <div className="mt-8">
          <GraphView centralConceptId={conceptId} />
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
