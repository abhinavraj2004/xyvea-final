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

  // A simple hash function to get a number from a string, for variety
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
        className={cn("flex flex-col items-center gap-2 cursor-pointer group", isCentral && 'z-10')}
        onClick={onClick}
    >
        <div className={cn(
            "w-24 h-24 rounded-full flex items-center justify-center text-center p-2 shadow-lg transition-transform group-hover:scale-105 border-2",
            isCentral ? "bg-primary text-primary-foreground border-primary-foreground/50 scale-125" : "bg-card border-border"
        )}>
           <span className="text-sm font-semibold">{title}</span>
        </div>
    </div>
);

const EdgeBadge = ({ status, upvotes, downvotes }: Omit<EdgeData, 'id' | 'source' | 'target'>) => (
  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background p-2 rounded-lg border min-w-[150px] z-20">
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
    <div className="w-full min-h-[60vh] flex items-center justify-center p-4 rounded-lg bg-muted/20 border border-dashed relative overflow-x-auto">
        <div className="flex items-center justify-between w-full max-w-7xl gap-8 px-4">
            {/* Causes Column */}
            <div className="flex flex-col gap-16">
                {mockData.causes.map(node => <Node key={node.id} title={node.title} onClick={() => handleNodeClick(node.title)} />)}
            </div>

            {/* Edges from Causes to Central */}
            <div className="relative flex-1 h-full min-w-[200px] hidden md:block">
                <svg width="100%" height="100%" className="absolute">
                     <defs>
                        <marker id="arrow-cause" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="hsl(var(--border))" />
                        </marker>
                    </defs>
                    {mockData.causes.map((_, index) => (
                        <path key={`cause-line-${index}`} d={`M 0,${25 + index * 33}% C 50,${25 + index*33}% 50,50% 100,50%`} stroke="hsl(var(--border))" fill="none" strokeWidth="2"  markerEnd="url(#arrow-cause)"/>
                    ))}
                </svg>
                 <div className="absolute left-[25%] top-[25%]"><EdgeBadge {...mockData.causeEdges[0]}/></div>
                 <div className="absolute left-[25%] top-[58%]"><EdgeBadge {...mockData.causeEdges[1]}/></div>
                 <div className="absolute left-[25%] top-[91%]"><EdgeBadge {...mockData.causeEdges[2]}/></div>
            </div>

            <div className="flex flex-col gap-4 items-center">
                 <Node title={mockData.centralNode.title} isCentral />
            </div>

            {/* Edges from Central to Effects */}
            <div className="relative flex-1 h-full min-w-[200px] hidden md:block">
                <svg width="100%" height="100%" className="absolute">
                    <defs>
                        <marker id="arrow-effect" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="hsl(var(--border))" />
                        </marker>
                    </defs>
                    {mockData.effects.map((_, index) => (
                        <path key={`effect-line-${index}`} d={`M 0,50% C 50,50% 50,${25 + index*33}% 100,${25 + index*33}%`} stroke="hsl(var(--border))" fill="none" strokeWidth="2" markerEnd="url(#arrow-effect)"/>
                    ))}
                </svg>
                 <div className="absolute left-[75%] top-[25%]"><EdgeBadge {...mockData.effectEdges[0]}/></div>
                 <div className="absolute left-[75%] top-[58%]"><EdgeBadge {...mockData.effectEdges[1]}/></div>
                 <div className="absolute left-[75%] top-[91%]"><EdgeBadge {...mockData.effectEdges[2]}/></div>
            </div>

            {/* Effects Column */}
            <div className="flex flex-col gap-16">
                {mockData.effects.map(node => <Node key={node.id} title={node.title} onClick={() => handleNodeClick(node.title)} />)}
            </div>
        </div>
         <p className="absolute bottom-4 text-center text-sm text-muted-foreground w-full">Note: This is a static visualization for demonstration purposes. Click a node to explore.</p>
    </div>
  );
};

export default GraphView;
