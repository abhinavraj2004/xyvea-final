
'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceX,
  forceY,
  forceCenter,
  type Simulation,
  type SimulationNodeDatum,
  type SimulationLinkDatum,
} from 'd3-force';
import { ArrowDown, ArrowUp, Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';


// Data types
type NodeData = {
  id: string;
  title: string;
  type: 'cause' | 'effect' | 'central';
};

type EdgeData = {
  id:string;
  source: string;
  target: string;
  status: 'verified' | 'pending' | 'disputed' | 'rejected';
  upvotes: number;
  downvotes: number;
};

// D3 Simulation types
interface D3Node extends NodeData, SimulationNodeDatum {
  id: string;
}

interface D3Link extends SimulationLinkDatum<D3Node> {
  id: string;
  status: EdgeData['status'];
  upvotes: number;
  downvotes: number;
}


// Mock Data Generation
const generateMockData = (centralConceptId: string) => {
    const conceptName = decodeURIComponent(centralConceptId).replace(/-/g, ' ');
    const hashCode = (s: string) => s.split('').reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0);
    const seed = hashCode(conceptName);

    const causePrefixes = ['Factors leading to', 'Precursors of', 'Origins of', 'Underlying drivers of'];
    const effectPrefixes = ['Consequences of', 'Results of', 'Impacts of', 'Outcomes of'];
    
    const createItems = (prefixes: string[], count: number, offset: number) => {
        return Array.from({ length: count }, (_, i) => {
            const prefix = prefixes[(seed + i * offset) % prefixes.length] || "Related to";
            const baseTitle = conceptName.replace(/(causes of|effects of|factors leading to|precursors of|origins of|underlying drivers of|consequences of|results of|impacts of|outcomes of)\s/gi, "");
            const title = `${prefix} ${baseTitle}`;
            return { title };
        });
    };
    
    const causesData = createItems(causePrefixes, 3, 3);
    const effectsData = createItems(effectPrefixes, 4, 5);

    const causes: NodeData[] = causesData.map((d, i) => ({ id: `c${i}`, title: d.title, type: 'cause' }));
    const effects: NodeData[] = effectsData.map((d, i) => ({ id: `e${i}`, title: d.title, type: 'effect' }));
    const centralNode: NodeData = { id: 'central', title: conceptName, type: 'central' };

    const nodes = [centralNode, ...causes, ...effects];
    
    const statuses: EdgeData['status'][] = ['verified', 'pending', 'disputed', 'rejected'];
    const causeEdges: EdgeData[] = causes.map((c, i) => ({ id: `ce${i}`, source: c.id, target: 'central', status: statuses[(seed + i) % statuses.length], upvotes: Math.abs(hashCode(c.title)) % 200, downvotes: Math.abs(hashCode(c.title)) % 50 }));
    const effectEdges: EdgeData[] = effects.map((e, i) => ({ id: `ee${i}`, source: 'central', target: e.id, status: statuses[(seed + i + 1) % statuses.length], upvotes: Math.abs(hashCode(e.title)) % 250, downvotes: Math.abs(hashCode(e.title)) % 40 }));
    
    const edges = [...causeEdges, ...effectEdges];

    return { nodes, edges };
};

// Styling
const statusColors: Record<EdgeData['status'], string> = {
  verified: 'stroke-green-500',
  pending: 'stroke-yellow-500',
  disputed: 'stroke-orange-500',
  rejected: 'stroke-red-500',
};

// Components
const Node = ({ node, onClick }: { node: D3Node; onClick: (title: string) => void }) => {
    const isCentral = node.type === 'central';
    return (
        <foreignObject
            x={node.x! - (isCentral ? 100 : 90)}
            y={node.y! - (isCentral ? 40 : 35)}
            width={isCentral ? 200 : 180}
            height={isCentral ? 80 : 70}
            className="cursor-pointer group overflow-visible"
            onClick={() => onClick(node.title)}
        >
            <div className={cn(
                "w-full h-full rounded-lg p-2 shadow-lg transition-all group-hover:shadow-xl group-hover:-translate-y-0.5 border-2 text-center flex items-center justify-center",
                isCentral 
                  ? "bg-primary text-primary-foreground border-blue-400 text-base font-bold" 
                  : "bg-card border-border text-sm"
            )}>
               <span className="font-semibold capitalize">{node.title}</span>
            </div>
        </foreignObject>
    );
};

const Edge = ({ link }: { link: D3Link }) => {
    const source = link.source as D3Node;
    const target = link.target as D3Node;

    const pathData = `M${source.x},${source.y} C${source.x},${(source.y! + target.y!) / 2} ${target.x},${(source.y! + target.y!) / 2} ${target.x},${target.y}`;

    return (
        <path
            d={pathData}
            className={cn("stroke-2 fill-none", statusColors[link.status])}
            markerEnd="url(#arrow)"
        />
    );
};

const EdgeBadge = ({ link }: { link: D3Link }) => {
    const source = link.source as D3Node;
    const target = link.target as D3Node;

    return (
      <foreignObject 
        x={(source.x! + target.x!) / 2 - 75} 
        y={(source.y! + target.y!) / 2 - 20} 
        width="150" 
        height="40"
        className="overflow-visible"
      >
        <div className="bg-background/80 backdrop-blur-sm p-2 rounded-lg border min-w-[150px] z-20 shadow-lg">
          <div className="flex justify-center items-center gap-4 text-sm">
            <div className="flex items-center gap-1 text-green-500">
              <ArrowUp size={16} />
              <span>{link.upvotes}</span>
            </div>
            <div className="flex items-center gap-1 text-red-500">
              <ArrowDown size={16} />
              <span>{link.downvotes}</span>
            </div>
             <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                    <button className="cursor-pointer text-muted-foreground hover:text-foreground">
                        <Info size={16} />
                    </button>
                    </TooltipTrigger>
                    <TooltipContent>
                    <p className="capitalize">Status: <span className={cn(statusColors[link.status]?.replace('stroke-', 'text-'), 'font-semibold')}>{link.status}</span></p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </foreignObject>
    )
};


// Main Graph Component
const GraphView = ({ centralConceptId }: { centralConceptId: string }) => {
  const router = useRouter();
  const svgRef = useRef<SVGSVGElement>(null);
  
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => generateMockData(centralConceptId), [centralConceptId]);

  const [nodes, setNodes] = useState<D3Node[]>([]);
  const [links, setLinks] = useState<D3Link[]>([]);


  useEffect(() => {
    if (!svgRef.current) return;
    
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    const simulationNodes: D3Node[] = initialNodes.map(node => ({...node}));
    const simulationLinks: D3Link[] = initialEdges.map(edge => ({...edge, source: edge.source, target: edge.target}));
    
    const centralNode = simulationNodes.find(n => n.type === 'central');
    if (centralNode) {
        centralNode.fx = width / 2;
        centralNode.fy = height / 2;
    }
    
    const simulation: Simulation<D3Node, D3Link> = forceSimulation(simulationNodes)
        .force('link', forceLink<D3Node, D3Link>(simulationLinks).id(d => d.id).distance(180))
        .force('charge', forceManyBody().strength(-800))
        .force('x', forceX<D3Node>(d => {
            if (d.type === 'central') return width / 2;
            const isMobile = width < 768; // md breakpoint
            if (isMobile) return width / 2; // Stack vertically on mobile
            return d.type === 'cause' ? width / 4 : (width * 3) / 4;
        }).strength(1))
        .force('y', forceY<D3Node>(d => {
            const isMobile = width < 768;
            if (isMobile) {
                if (d.type === 'central') return height / 2;
                return d.type === 'cause' ? height / 4 : (height * 3) / 4;
            }
            return height / 2;
        }).strength(isMobile => isMobile ? 0.5 : 0.1))
        .force('center', forceCenter(width / 2, height / 2));

    simulation.on('tick', () => {
        setNodes([...simulation.nodes()]);
        setLinks([...simulation.force<any>('link').links()]);
    });
    
    return () => {
        simulation.stop();
    };

  }, [initialNodes, initialEdges]);

  const handleNodeClick = (title: string) => {
    const formattedTerm = encodeURIComponent(title.trim().toLowerCase().replace(/\s/g, '-'));
    router.push(`/graph/${formattedTerm}`);
  };
  
  return (
    <div className="w-full min-h-[70vh] rounded-lg bg-[radial-gradient(hsl(var(--muted-foreground)/0.1)_1px,transparent_1px)] [background-size:24px_24px] border relative overflow-hidden">
        <svg ref={svgRef} width="100%" height="100%" className="min-h-[70vh]">
            <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="15" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" className="fill-border" />
                </marker>
            </defs>
            <g>
                {links.map((link) => (
                    <Edge key={link.id} link={link} />
                ))}
            </g>
             <g>
                {links.map((link) => (
                    <EdgeBadge key={`badge-${link.id}`} link={link} />
                ))}
            </g>
            <g>
                {nodes.map((node) => (
                    <Node key={node.id} node={node} onClick={handleNodeClick} />
                ))}
            </g>
        </svg>
    </div>
  );
};

export default GraphView;
