

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
import { cn } from '@/lib/utils';
import { CausalLink, getLinksForConcept, getConceptByTitle } from '@/lib/firestore';
import { Loader2, PlusCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { useAuth } from '@/hooks/use-auth';
import Link from 'next/link';


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
};

// D3 Simulation types
interface D3Node extends NodeData, SimulationNodeDatum {
  id: string;
}

interface D3Link extends SimulationLinkDatum<D3Node> {
  id: string;
  status: EdgeData['status'];
}


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

const transformDataForGraph = (causes: CausalLink[], effects: CausalLink[], centralConceptId: string) => {
    const centralConceptTitle = centralConceptId.toLowerCase();
    const centralNode: NodeData = { id: centralConceptTitle, title: centralConceptId, type: 'central' };
    
    const causeNodes: NodeData[] = Array.from(new Set(causes.map(c => c.cause.toLowerCase())))
        .map(title => ({ id: title, title, type: 'cause' }));

    const effectNodes: NodeData[] = Array.from(new Set(effects.map(e => e.effect.toLowerCase())))
        .map(title => ({ id: title, title, type: 'effect' }));

    const nodes = [centralNode, ...causeNodes, ...effectNodes];
    
    const causeEdges: EdgeData[] = causes.map(c => ({ id: c.id, source: c.cause.toLowerCase(), target: centralConceptTitle, status: c.status }));
    const effectEdges: EdgeData[] = effects.map(e => ({ id: e.id, source: centralConceptTitle, target: e.effect.toLowerCase(), status: e.status }));
    
    const edges = [...causeEdges, ...effectEdges];

    return { nodes, edges };
}

// Main Graph Component
const GraphView = ({ centralConceptId, onContributeClick }: { centralConceptId: string; onContributeClick: () => void; }) => {
  const router = useRouter();
  const { user } = useAuth();
  const svgRef = useRef<SVGSVGElement>(null);
  const gRef = useRef<SVGGElement>(null);
  const [simulation, setSimulation] = useState<Simulation<D3Node, D3Link>>();
  const [loading, setLoading] = useState(true);
  
  const conceptName = useMemo(() => decodeURIComponent(centralConceptId).replace(/-/g, ' '), [centralConceptId]);

  const [graphData, setGraphData] = useState<{nodes: NodeData[], edges: EdgeData[]}>({nodes: [], edges: []});

  const [nodes, setNodes] = useState<D3Node[]>([]);
  const [links, setLinks] = useState<D3Link[]>([]);
  const [currentZoom, setCurrentZoom] = useState<ZoomTransform>(zoomIdentity);


  useEffect(() => {
      const fetchData = async () => {
        setLoading(true);
        const { causes, effects } = await getLinksForConcept(conceptName);
        const transformedData = transformDataForGraph(causes, effects, conceptName);
        setGraphData(transformedData);
        setLoading(false);
      }
      fetchData();
  }, [conceptName]);


  useEffect(() => {
    if (!svgRef.current || !graphData.nodes.length || loading) return;
    
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    const simulationNodes: D3Node[] = graphData.nodes.map(node => ({...node, x: Math.random() * width, y: Math.random() * height}));
    const simulationLinks: D3Link[] = graphData.edges.map(edge => ({...edge, source: edge.source, target: edge.target}));
    
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

  }, [graphData, loading]);

  const handleNodeClick = (title: string) => {
    if (currentZoom.k === 1 && currentZoom.x === 0 && currentZoom.y === 0) { // crude way to check if drag happened
        const formattedTerm = encodeURIComponent(title.trim().toLowerCase().replace(/\s/g, '-'));
        router.push(`/graph/${formattedTerm}`);
    }
  };

  const handleContribute = () => {
    if (!user) {
      router.push('/auth/signin');
    } else {
      onContributeClick();
    }
  }

  const dragHandler = (sim: Simulation<D3Node, D3Link> | undefined) => {
    function dragstarted(event: D3DragEvent<any, D3Node, any>) {
      const d = event.subject;
      if (!event.active && sim) sim.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: D3DragEvent<any, D3Node, any>) {
      const d = event.subject;
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: D3DragEvent<any, D3Node, any>) {
      const d = event.subject;
      if (!event.active && sim) sim.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    return drag<any, D3Node>()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended);
  };
  
  if (loading) {
    return (
        <div className="w-full min-h-[70vh] flex justify-center items-center">
            <Loader2 className="h-16 w-16 animate-spin" />
        </div>
    );
  }

  return (
    <div className="w-full min-h-[70vh] rounded-lg bg-[radial-gradient(hsl(var(--muted-foreground)/0.1)_1px,transparent_1px)] [background-size:24px_24px] border relative overflow-hidden">
        {graphData.edges.length > 0 ? (
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
        ) : (
            <div className="w-full h-full flex flex-col justify-center items-center text-center p-4">
                <p className="text-muted-foreground text-xl capitalize">No links for '{conceptName}' yet.</p>
                <p className="text-muted-foreground mt-2 max-w-md">Be the first to propose a causal link for this concept and help grow the knowledge graph.</p>
                <Button className="mt-6" onClick={handleContribute}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Propose a Link
                </Button>
            </div>
        )}
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
