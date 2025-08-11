'use client';

import { useState, Fragment, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowDown, ArrowUp, LinkIcon, PlusCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import AddCausalLinkModal from '@/components/contribute/add-causal-link-modal';
import { useAuth } from '@/hooks/use-auth';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';


const generateMockData = (conceptId: string) => {
  const conceptName = decodeURIComponent(conceptId).replace(/-/g, ' ');

  // A simple hash function to get a number from a string, for variety
  const hashCode = (s: string) => s.split('').reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0);
  const seed = hashCode(conceptName);
  
  const causePrefixes = ['Factors leading to', 'Precursors of', 'Origins of', 'Underlying drivers of'];
  const effectPrefixes = ['Consequences of', 'Results of', 'Impacts of', 'Outcomes of'];
  const statuses = ['verified', 'pending', 'disputed', 'rejected'];

  const causes = Array.from({ length: 3 }, (_, i) => {
    const prefix = causePrefixes[(seed + i * 3) % causePrefixes.length];
    const title = `${prefix} ${conceptName.replace(/(causes of|effects of|factors leading to|precursors of|origins of|underlying drivers of|consequences of|results of|impacts of|outcomes of)\s/gi, "")}`;
    const titleHash = hashCode(title);
    return {
      id: `c${i}`,
      title,
      status: statuses[(seed + i) % statuses.length],
      upvotes: Math.abs(titleHash) % 200,
      downvotes: Math.abs(titleHash) % 50,
      description: `A mock description explaining how ${title.toLowerCase()} could be a factor for ${conceptName.toLowerCase()}.`,
      sourceURL: 'https://example.com/mock-source',
    };
  });

  const effects = Array.from({ length: 3 }, (_, i) => {
    const prefix = effectPrefixes[(seed + i * 5) % effectPrefixes.length];
    const title = `${prefix} ${conceptName.replace(/(causes of|effects of|factors leading to|precursors of|origins of|underlying drivers of|consequences of|results of|impacts of|outcomes of)\s/gi, "")}`;
    const titleHash = hashCode(title);
    return {
      id: `e${i}`,
      title,
      status: statuses[(seed + i + 1) % statuses.length],
      upvotes: Math.abs(titleHash) % 250,
      downvotes: Math.abs(titleHash) % 40,
      description: `A mock description explaining how ${conceptName.toLowerCase()} could lead to ${title.toLowerCase()}.`,
      sourceURL: 'https://example.com/mock-source',
    };
  });

  return { causes, effects };
};


const statusColors: Record<string, string> = {
  verified: 'border-green-500 text-green-500',
  pending: 'border-yellow-500 text-yellow-500',
  disputed: 'border-orange-500 text-orange-500',
  rejected: 'border-red-500 text-red-500',
};

export default function TablePage() {
  const router = useRouter();
  const params = useParams();
  const { isLoggedIn } = useAuth();
  const conceptId = Array.isArray(params.conceptId) ? params.conceptId[0] : params.conceptId;
  const conceptName = decodeURIComponent(conceptId).replace(/-/g, ' ');
  
  const mockData = useMemo(() => generateMockData(conceptId), [conceptId]);

  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);


  const handleNewSearch = () => {
    router.push('/');
  };

  const handleConceptClick = (title: string) => {
    const formattedTerm = encodeURIComponent(title.trim().toLowerCase().replace(/\s/g, '-'));
    router.push(`/table/${formattedTerm}`);
  };
  
  const toggleRow = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const ProposeLinkButton = () => (
    <Button variant="outline" onClick={() => setIsLinkModalOpen(true)} disabled={!isLoggedIn}>
      <PlusCircle className="mr-2 h-4 w-4" />
      Propose Link
    </Button>
  );

  const renderTable = (title: string, data: typeof mockData.causes) => (
    <div>
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Concept</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Votes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <Fragment key={item.id}>
                <TableRow className="cursor-pointer hover:bg-muted/50" onClick={() => toggleRow(item.id)}>
                  <TableCell className="font-medium hover:underline" onClick={(e) => { e.stopPropagation(); handleConceptClick(item.title); }}>{item.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusColors[item.status]}>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="flex items-center gap-4">
                     <div className="flex items-center gap-1 text-green-500">
                        <ArrowUp size={16} />
                        <span>{item.upvotes}</span>
                    </div>
                    <div className="flex items-center gap-1 text-red-500">
                        <ArrowDown size={16} />
                        <span>{item.downvotes}</span>
                    </div>
                  </TableCell>
                </TableRow>
                {expandedRow === item.id && (
                  <TableRow>
                    <TableCell colSpan={3}>
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <p className="text-muted-foreground mb-4">{item.description}</p>
                        <a 
                          href={item.sourceURL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary inline-flex items-center gap-2 text-sm hover:underline"
                        >
                          <LinkIcon size={14} />
                          Source
                        </a>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </Fragment>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );

  return (
    <>
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-semibold capitalize tracking-tight">
          Exploring: <span className="text-primary">{conceptName}</span>
        </h1>
        <div className="flex items-center gap-2">
            {!isLoggedIn ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                     {/* The div wrapper is necessary for the tooltip to work on a disabled button */}
                    <div className="cursor-not-allowed">
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
          <Link href={`/graph/${conceptId}`}>
            <Button variant="outline">Graph View</Button>
          </Link>
          <Button variant="secondary" onClick={handleNewSearch}>
            New Search
          </Button>
        </div>
      </div>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {renderTable('Causes', mockData.causes)}
        {renderTable('Effects', mockData.effects)}
      </div>
    </div>
    <AddCausalLinkModal isOpen={isLinkModalOpen} onOpenChange={setIsLinkModalOpen} baseConceptName={conceptName} />
    </>
  );
}
