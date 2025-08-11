
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowDown, ArrowUp, Info } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";


type NodeData = {
  id: string;
  title: string;
};

type EdgeData = {
  id:string;
  source: string;
  target: string;
  status: 'verified' | 'pending' | 'disputed' | 'rejected';
  upvotes: number;
  downvotes: number;
};

const generateMockData = (centralConceptId: string) => {
  const conceptName = decodeURIComponent(centralConceptId).replace(/-/g, ' ');

  const hashCode = (s: string) => s.split('').reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0);
  const seed = hashCode(conceptName);

  const causePrefixes = ['Factors leading to', 'Precursors of', 'Origins of', 'Underlying drivers of'];
  const effectPrefixes = ['Consequences of', 'Results of', 'Impacts of', 'Outcomes of'];

  const causes: NodeData[] = Array.from({ length: 3 }, (_, i) => {
    const prefix = causePrefixes[(seed + i * 3) % causePrefixes.length];
    return { id: `c${i}`, title: `${prefix} ${conceptName}` };
  });

  const effects: NodeData[] = Array.from({ length: 3 }, (_, i) => {
    const prefix = effectPrefixes[(seed + i * 5) % effectPrefixes.length];
    return { id: `e${i}`, title: `${prefix} ${conceptName}` };
  });
  
  const statuses: EdgeData['status'][] = ['verified', 'pending', 'disputed', 'rejected'];

  return {
    centralNode: { id: 'central', title: conceptName },
    causes,
    effects,
    causeEdges: causes.map((c, i) => ({
      id: `ce${i}`,
      source: c.id,
      target: 'central',
      status: statuses[(seed + i) % statuses.length],
      upvotes: Math.abs(hashCode(c.title)) % 200,
      downvotes: Math.abs(hashCode(c.title)) % 50,
    })),
    effectEdges: effects.map((e, i) => ({
      id: `ee${i}`,
      source: 'central',
      target: e.id,
      status: statuses[(seed + i + 1) % statuses.length],
      upvotes: Math.abs(hashCode(e.title)) % 250,
      downvotes: Math.abs(hashCode(e.title)) % 40,
    })),
  };
};


const statusColors: Record<EdgeData['status'], string> = {
  verified: 'border-green-500 text-green-500',
  pending: 'border-yellow-500 text-yellow-500',
  disputed: 'border-orange-500 text-orange-500',
  rejected: 'border-red-500 text-red-500',
};

const Node = ({ title, isCentral = false, onClick }: { title: string; isCentral?: boolean; onClick?: () => void }) => (
    <div 
        className={cn("flex items-center justify-center cursor-pointer group z-10", isCentral && 'transform scale-125')}
        onClick={onClick}
    >
        <div className={cn(
            "rounded-lg p-4 shadow-lg transition-all group-hover:shadow-xl group-hover:-translate-y-1 border-2 text-center",
            isCentral 
              ? "bg-primary text-primary-foreground border-blue-400 min-w-[200px] min-h-[100px] flex items-center justify-center text-lg font-bold" 
              : "bg-card border-border w-48 h-24 flex items-center justify-center"
        )}>
           <span className="font-semibold">{title}</span>
        </div>
    </div>
);

const EdgeBadge = ({ status, upvotes, downvotes }: Omit<EdgeData, 'id' | 'source' | 'target'>) => (
  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background p-2 rounded-lg border min-w-[150px] z-20 shadow-lg">
    <div className="flex justify-center items-center gap-4 text-sm">
      <div className="flex items-center gap-1 text-green-500">
        <ArrowUp size={16} />
        <span>{upvotes}</span>
      </div>
      <div className="flex items-center gap-1 text-red-500">
        <ArrowDown size={16} />
        <span>{downvotes}</span>
      </div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="cursor-pointer text-muted-foreground hover:text-foreground">
              <Info size={16} />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="capitalize">Status: <span className={cn(statusColors[status], 'font-semibold')}>{status}</span></p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  </div>
);


const GraphView = ({ centralConceptId }: { centralConceptId: string }) => {
  const router = useRouter();

  const mockData = useMemo(() => generateMockData(centralConceptId), [centralConceptId]);

  const handleNodeClick = (title: string) => {
    const formattedTerm = encodeURIComponent(title.trim().toLowerCase().replace(/\s/g, '-'));
    router.push(`/graph/${formattedTerm}`);
  };
  
  return (
    <div className="w-full min-h-[70vh] flex items-center justify-center p-4 rounded-lg bg-[radial-gradient(hsl(var(--muted-foreground)/0.1)_1px,transparent_1px)] [background-size:16px_16px] border relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-around w-full max-w-7xl gap-8 md:gap-16 px-4">
            
            {/* Causes Column */}
            <div className="flex flex-row md:flex-col gap-8 md:gap-24">
                {mockData.causes.map(node => <Node key={node.id} title={node.title} onClick={() => handleNodeClick(node.title)} />)}
            </div>

            {/* Central Node */}
            <div className="flex flex-col gap-4 items-center order-first md:order-none my-8 md:my-0">
                 <Node title={mockData.centralNode.title} isCentral />
            </div>

            {/* Effects Column */}
            <div className="flex flex-row md:flex-col gap-8 md:gap-24">
                {mockData.effects.map(node => <Node key={node.id} title={node.title} onClick={() => handleNodeClick(node.title)} />)}
            </div>

            {/* SVG Edges Layer */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <svg width="100%" height="100%">
                     <defs>
                        <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="hsl(var(--border))" />
                        </marker>
                    </defs>
                    
                    {/* Desktop Edges */}
                    <g className="hidden md:block">
                        {/* Cause Edges */}
                        <path d="M 20%,20% C 35%,20% 35%,50% 45%,50%" stroke="hsl(var(--border))" fill="none" strokeWidth="2" markerEnd="url(#arrow)"/>
                        <path d="M 20%,50% C 35%,50% 35%,50% 45%,50%" stroke="hsl(var(--border))" fill="none" strokeWidth="2" markerEnd="url(#arrow)"/>
                        <path d="M 20%,80% C 35%,80% 35%,50% 45%,50%" stroke="hsl(var(--border))" fill="none" strokeWidth="2" markerEnd="url(#arrow)"/>
                        
                        {/* Effect Edges */}
                        <path d="M 55%,50% C 65%,50% 65%,20% 80%,20%" stroke="hsl(var(--border))" fill="none" strokeWidth="2" markerEnd="url(#arrow)"/>
                        <path d="M 55%,50% C 65%,50% 65%,50% 80%,50%" stroke="hsl(var(--border))" fill="none" strokeWidth="2" markerEnd="url(#arrow)"/>
                        <path d="M 55%,50% C 65%,50% 65%,80% 80%,80%" stroke="hsl(var(--border))" fill="none" strokeWidth="2" markerEnd="url(#arrow)"/>
                    </g>
                    
                     {/* Mobile Edges */}
                    <g className="md:hidden">
                        {/* Cause Edges */}
                        <path d="M 25%,80% C 25%,65% 50%,65% 50%,55%" stroke="hsl(var(--border))" fill="none" strokeWidth="2" markerEnd="url(#arrow)"/>
                        <path d="M 50%,80% C 50%,65% 50%,65% 50%,55%" stroke="hsl(var(--border))" fill="none" strokeWidth="2" markerEnd="url(#arrow)"/>
                        <path d="M 75%,80% C 75%,65% 50%,65% 50%,55%" stroke="hsl(var(--border))" fill="none" strokeWidth="2" markerEnd="url(#arrow)"/>

                        {/* Effect Edges */}
                        <path d="M 50%,45% C 50%,35% 25%,35% 25%,20%" stroke="hsl(var(--border))" fill="none" strokeWidth="2" markerEnd="url(#arrow)"/>
                        <path d="M 50%,45% C 50%,35% 50%,35% 50%,20%" stroke="hsl(var(--border))" fill="none" strokeWidth="2" markerEnd="url(#arrow)"/>
                        <path d="M 50%,45% C 50%,35% 75%,35% 75%,20%" stroke="hsl(var(--border))" fill="none" strokeWidth="2" markerEnd="url(#arrow)"/>
                    </g>
                </svg>
            </div>
             <div className="absolute top-[calc(50%-1.5rem)] left-[calc(35%)] pointer-events-auto hidden md:block"><EdgeBadge {...mockData.causeEdges[1]}/></div>
             <div className="absolute top-[calc(50%-1.5rem)] right-[calc(35%)] pointer-events-auto hidden md:block"><EdgeBadge {...mockData.effectEdges[1]}/></div>
        </div>
         <p className="absolute bottom-4 text-center text-sm text-muted-foreground w-full px-4">Note: This is a static visualization. Click a node to explore.</p>
    </div>
  );
};

export default GraphView;

    