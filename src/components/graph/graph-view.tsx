
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
import { select, drag, zoom, type D3DragEvent, type ZoomTransform } from 'd3';
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
}


// Mock Data Generation
const generateMockData = (centralConceptId: string) => {
    const conceptName = decodeURIComponent(centralConceptId).replace(/-/g, ' ');
    const hashCode = (s: string) => s.split('').reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0);
    const seed = hashCode(conceptName);

    const causePrefixes = ['Factors leading to', 'Precursors of', 'Origins of', 'Underlying drivers of'];
    const effectPrefixes = ['Consequences of', 'Results of', 'Impacts of', 'Outcomes of'];
    
    // Improved baseTitle logic to avoid "undefined"
    const prefixesToRemove = ['causes of', 'effects of', 'factors leading to', 'precursors of', 'origins of', 'underlying drivers of', 'consequences of', 'results of', 'impacts of', 'outcomes of'];
    let baseTitle = conceptName;
    prefixesToRemove.forEach(p => {
        baseTitle = baseTitle.replace(new RegExp(`^${p}\\s`, 'i'), '');
    });


    const createItems = (prefixes: string[], count: number, offset: number) => {
        return Array.from({ length: count }, (_, i) => {
            const prefix = prefixes[(seed + i * offset) % prefixes.length] || "Related to";
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
const Node = ({ node, onClick, onDrag }: { node: D3Node; onClick: (title: string) => void; onDrag: any }) => {
    const isCentral = node.type === 'central';
    const nodeRef = useRef<SVGGElement>(null);

    useEffect(() => {
        if (nodeRef.current) {
            select(nodeRef.current).call(onDrag);
        }
    }, [onDrag]);
    
    return (
        <g ref={nodeRef} transform={`translate(${node.x}, ${node.y})`} className="cursor-pointer group">
            <foreignObject
                x={-(isCentral ? 100 : 90)}
                y={-(isCentral ? 40 : 35)}
                width={isCentral ? 200 : 180}
                height={isCentral ? 80 : 70}
                className="overflow-visible"
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
        </g>
    );
};

const Edge = ({ link }: { link: D3Link }) => {
    const source = link.source as D3Node;
    const target = link.target as D3Node;
    
    if (!source.x || !source.y || !target.x || !target.y) {
      return null;
    }

    const pathData = `M${source.x},${source.y} C${source.x},${(source.y! + target.y!) / 2} ${target.x},${(source.y! + target.y!) / 2} ${target.x},${target.y}`;

    return (
        <path
            d={pathData}
            className={cn("stroke-2 fill-none", statusColors[link.status])}
            markerEnd="url(#arrow)"
        />
    );
};

// Main Graph Component
const GraphView = ({ centralConceptId }: { centralConceptId: string }) => {
  const router = useRouter();
  const svgRef = useRef<SVGSVGElement>(null);
  const gRef = useRef<SVGGElement>(null);
  const [simulation, setSimulation] = useState<Simulation<D3Node, D3Link>>();
  
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => generateMockData(centralConceptId), [centralConceptId]);

  const [nodes, setNodes] = useState<D3Node[]>([]);
  const [links, setLinks] = useState<D3Link[]>([]);
  const [currentZoom, setCurrentZoom] = useState<ZoomTransform>(zoomIdentity);


  useEffect(() => {
    if (!svgRef.current || !initialNodes.length) return;
    
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    const simulationNodes: D3Node[] = initialNodes.map(node => ({...node, x: Math.random() * width, y: Math.random() * height}));
    const simulationLinks: D3Link[] = initialEdges.map(edge => ({...edge, source: edge.source, target: edge.target}));
    
    const centralNode = simulationNodes.find(n => n.type === 'central');
    if (centralNode) {
        centralNode.fx = width / 2;
        centralNode.fy = height / 2;
    }
    
    const sim: Simulation<D3Node, D3Link> = forceSimulation(simulationNodes)
        .force('link', forceLink<D3Node, D3Link>(simulationLinks).id(d => d.id).distance(200).strength(0.5))
        .force('charge', forceManyBody().strength(-1200))
        .force('x', forceX<D3Node>(d => {
            if (d.type === 'central') return width / 2;
            const isMobile = width < 768;
            if (isMobile) return width / 2;
            return d.type === 'cause' ? width / 4 : (width * 3) / 4;
        }).strength(0.8))
        .force('y', forceY<D3Node>(height / 2).strength(0.1))
        .force('center', forceCenter(width / 2, height / 2));

    sim.on('tick', () => {
        setNodes([...sim.nodes()]);
        setLinks([...sim.force<any>('link').links()]);
    });
    
    setSimulation(sim);

    const svgElement = select(svgRef.current);
    const gElement = select(gRef.current);

    const zoomBehavior = zoom<SVGSVGElement, unknown>().on('zoom', (event) => {
        gElement.attr('transform', event.transform);
        setCurrentZoom(event.transform);
    });

    svgElement.call(zoomBehavior as any);

    return () => {
        sim.stop();
    };

  }, [initialNodes, initialEdges]);

  const handleNodeClick = (title: string) => {
    if (currentZoom.k === 1 && currentZoom.x === 0 && currentZoom.y === 0) { // crude way to check if drag happened
        const formattedTerm = encodeURIComponent(title.trim().toLowerCase().replace(/\s/g, '-'));
        router.push(`/graph/${formattedTerm}`);
    }
  };

  const dragHandler = (sim: Simulation<D3Node, D3Link> | undefined) => {
    function dragstarted(event: D3DragEvent<any, D3Node, any>, d: D3Node) {
      if (!event.active && sim) sim.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: D3DragEvent<any, D3Node, any>, d: D3Node) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: D3DragEvent<any, D3Node, any>, d: D3Node) {
      if (!event.active && sim) sim.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    return drag<any, D3Node>()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended);
  };
  
  return (
    <div className="w-full min-h-[70vh] rounded-lg bg-[radial-gradient(hsl(var(--muted-foreground)/0.1)_1px,transparent_1px)] [background-size:24px_24px] border relative overflow-hidden">
        <svg ref={svgRef} width="100%" height="100%" className="min-h-[70vh]">
            <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="15" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" className="fill-border" />
                </marker>
            </defs>
            <g ref={gRef}>
                {links.map((link) => (
                    <Edge key={link.id} link={link} />
                ))}
                {nodes.map((node) => (
                    <Node key={node.id} node={node} onClick={handleNodeClick} onDrag={dragHandler(simulation)} />
                ))}
            </g>
        </svg>
    </div>
  );
};

// Dummy zoomIdentity for initial state
const zoomIdentity = {
  k: 1,
  x: 0,
  y: 0,
  apply: function(point: [number, number]): [number, number] { return point; },
  scale: function(k: number) { return this; },
  translate: function(x: number, y: number) { return this; },
  invert: function(point: [number, number]): [number, number] { return point; },
  toString: function(): string { return `translate(0,0) scale(1)`; }
};

export default GraphView;
