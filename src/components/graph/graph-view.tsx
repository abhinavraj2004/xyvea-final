'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowDown, ArrowUp } from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils";

type NodeData = {
  id: string;
  title: string;
};

type EdgeData = {
  id: string;
  source: string;
  target: string;
  status: 'verified' | 'pending' | 'disputed' | 'rejected';
  upvotes: number;
  downvotes: number;
};

const mockData = {
  causes: [
    { id: 'c1', title: 'Subprime Mortgages' },
    { id: 'c2', title: 'Deregulation' },
    { id: 'c3', title: 'Housing Bubble' },
  ],
  effects: [
    { id: 'e1', title: 'Global Recession' },
    { id: 'e2', title: 'Bank Failures' },
    { id: 'e3', title: 'Government Bailouts' },
  ],
  causeEdges: [
    { id: 'ce1', source: 'c1', target: 'central', status: 'verified', upvotes: 128, downvotes: 5 },
    { id: 'ce2', source: 'c2', target: 'central', status: 'verified', upvotes: 97, downvotes: 12 },
    { id: 'ce3', source: 'c3', target: 'central', status: 'pending', upvotes: 23, downvotes: 8 },
  ],
  effectEdges: [
    { id: 'ee1', source: 'central', target: 'e1', status: 'verified', upvotes: 210, downvotes: 3 },
    { id: 'ee2', source: 'central', target: 'e2', status: 'disputed', upvotes: 45, downvotes: 40 },
    { id: 'ee3', source: 'central', target: 'e3', status: 'rejected', upvotes: 15, downvotes: 30 },
  ],
};

const statusColors: Record<EdgeData['status'], string> = {
  verified: 'border-green-500 text-green-500',
  pending: 'border-yellow-500 text-yellow-500',
  disputed: 'border-orange-500 text-orange-500',
  rejected: 'border-red-500 text-red-500',
};

const Node = ({ title, isCentral = false }: { title: string; isCentral?: boolean }) => (
  <Card className={cn("w-64 text-center shadow-lg", isCentral && "bg-primary text-primary-foreground")}>
    <CardContent className="p-4">
      <p className="font-semibold">{title}</p>
    </CardContent>
  </Card>
);

const EdgeBadge = ({ status, upvotes, downvotes }: Omit<EdgeData, 'id' | 'source' | 'target'>) => (
  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background p-2 rounded-lg border min-w-[150px]">
     <Badge variant="outline" className={cn("capitalize mb-2 w-full justify-center", statusColors[status])}>{status}</Badge>
     <div className="flex justify-around items-center text-sm">
        <div className="flex items-center gap-1 text-green-500">
            <ArrowUp size={16} />
            <span>{upvotes}</span>
        </div>
        <div className="flex items-center gap-1 text-red-500">
            <ArrowDown size={16} />
            <span>{downvotes}</span>
        </div>
     </div>
  </div>
);


const GraphView = ({ centralConcept }: { centralConcept: string }) => {
  return (
    <div className="w-full min-h-[60vh] flex items-center justify-center p-4 rounded-lg bg-muted/20 border border-dashed relative overflow-hidden">
        <div className="flex items-center justify-between w-full max-w-6xl gap-8">
            {/* Causes Column */}
            <div className="flex flex-col gap-16">
                {mockData.causes.map(node => <Node key={node.id} title={node.title}/>)}
            </div>

            {/* Edges and Central Node */}
            <div className="relative flex-1 h-full min-w-[200px] hidden md:block">
                {/* Lines from Causes */}
                <div className="absolute inset-0">
                    <svg width="100%" height="100%" className="absolute">
                        {mockData.causes.map((_, index) => (
                            <path key={`cause-line-${index}`} d={`M 0,${25 + index * 33}% C 50,${25 + index*33}% 50,50% 100,50%`} stroke="hsl(var(--border))" fill="none" strokeWidth="2" markerEnd="url(#arrow)"/>
                        ))}
                    </svg>
                     <div className="absolute left-[25%] top-[25%]"><EdgeBadge {...mockData.causeEdges[0]}/></div>
                     <div className="absolute left-[25%] top-[58%]"><EdgeBadge {...mockData.causeEdges[1]}/></div>
                     <div className="absolute left-[25%] top-[91%]"><EdgeBadge {...mockData.causeEdges[2]}/></div>
                </div>
            </div>

            <div className="flex flex-col gap-4 items-center">
                 <Node title={centralConcept} isCentral />
            </div>

            <div className="relative flex-1 h-full min-w-[200px] hidden md:block">
                 {/* Lines to Effects */}
                 <svg width="100%" height="100%" className="absolute">
                    <defs>
                        <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="hsl(var(--border))" />
                        </marker>
                    </defs>
                    {mockData.effects.map((_, index) => (
                         <path key={`effect-line-${index}`} d={`M 0,50% C 50,50% 50,${25 + index*33}% 100,${25 + index*33}%`} stroke="hsl(var(--border))" fill="none" strokeWidth="2" markerEnd="url(#arrow)"/>
                    ))}
                </svg>
                 <div className="absolute left-[75%] top-[25%]"><EdgeBadge {...mockData.effectEdges[0]}/></div>
                 <div className="absolute left-[75%] top-[58%]"><EdgeBadge {...mockData.effectEdges[1]}/></div>
                 <div className="absolute left-[75%] top-[91%]"><EdgeBadge {...mockData.effectEdges[2]}/></div>
            </div>

            {/* Effects Column */}
            <div className="flex flex-col gap-16">
                {mockData.effects.map(node => <Node key={node.id} title={node.title}/>)}
            </div>
        </div>
         <p className="absolute bottom-4 text-center text-sm text-muted-foreground w-full">Note: This is a static visualization for demonstration purposes.</p>
    </div>
  );
};

export default GraphView;
