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


const generateMockData = (conceptName: string) => {
  const causes = [
    { id: 'c1', title: `Precursor to ${conceptName}`, status: 'verified', upvotes: 128, downvotes: 5, description: `A description for the precursor to ${conceptName}.`, sourceURL: 'https://example.com/source' },
    { id: 'c2', title: `Underlying factor for ${conceptName}`, status: 'pending', upvotes: 97, downvotes: 12, description: `A description for an underlying factor for ${conceptName}.`, sourceURL: 'https://example.com/source' },
    { id: 'c3', title: `Catalyst for ${conceptName}`, status: 'verified', upvotes: 23, downvotes: 8, description: `A description for a catalyst for ${conceptName}.`, sourceURL: 'https://example.com/source' },
  ];
  
  const effects = [
    { id: 'e1', title: `Consequence of ${conceptName}`, status: 'verified', upvotes: 210, downvotes: 3, description: `A description for a consequence of ${conceptName}.`, sourceURL: 'https://example.com/source' },
    { id: 'e2', title: `Result of ${conceptName}`, status: 'disputed', upvotes: 45, downvotes: 40, description: `A description for a result of ${conceptName}.`, sourceURL: 'https://example.com/source' },
    { id: 'e3', title: `Aftermath of ${conceptName}`, status: 'rejected', upvotes: 15, downvotes: 30, description: `A description for the aftermath of ${conceptName}.`, sourceURL: 'https://example.com/source' },
  ];

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
  const conceptId = Array.isArray(params.conceptId) ? params.conceptId[0] : params.conceptId;
  const conceptName = decodeURIComponent(conceptId).replace(/-/g, ' ');
  
  const mockData = useMemo(() => generateMockData(conceptName), [conceptName]);

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
           <Button variant="outline" onClick={() => setIsLinkModalOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Propose Link
          </Button>
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
