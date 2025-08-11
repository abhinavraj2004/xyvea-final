'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import AddConceptModal from '@/components/contribute/add-concept-modal';
import AddCausalLinkModal from '@/components/contribute/add-causal-link-modal';

export default function ContributePage() {
  const [isConceptModalOpen, setIsConceptModalOpen] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);

  return (
    <>
      <div className="container mx-auto max-w-7xl px-4 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">Contribute to CausalCanvas</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Help grow the collective understanding by adding new concepts and the causal links between them.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="flex flex-col items-center text-center p-8 border rounded-lg shadow-sm">
            <div className="p-3 bg-primary/10 rounded-full">
              <PlusCircle className="h-8 w-8 text-primary" />
            </div>
            <h2 className="mt-4 text-2xl font-semibold">Add a New Concept</h2>
            <p className="mt-2 text-muted-foreground">
              Introduce a new idea, event, or entity to the knowledge graph.
            </p>
            <Button className="mt-6" onClick={() => setIsConceptModalOpen(true)}>
              Add Concept
            </Button>
          </div>
          
          <div className="flex flex-col items-center text-center p-8 border rounded-lg shadow-sm">
            <div className="p-3 bg-primary/10 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-primary"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72"/></svg>
            </div>
            <h2 className="mt-4 text-2xl font-semibold">Propose a Causal Link</h2>
            <p className="mt-2 text-muted-foreground">
              Connect two existing concepts with a sourced cause-and-effect relationship.
            </p>
            <Button className="mt-6" onClick={() => setIsLinkModalOpen(true)}>
              Propose Link
            </Button>
          </div>
        </div>
      </div>
      <AddConceptModal isOpen={isConceptModalOpen} onOpenChange={setIsConceptModalOpen} />
      <AddCausalLinkModal isOpen={isLinkModalOpen} onOpenChange={setIsLinkModalOpen} />
    </>
  );
}
