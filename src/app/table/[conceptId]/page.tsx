'use client';

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
import { useRouter } from 'next/navigation';
import { ArrowDown, ArrowUp } from 'lucide-react';

const mockData = {
  causes: [
    { id: 'c1', title: 'Subprime Mortgages', status: 'verified', upvotes: 128, downvotes: 5 },
    { id: 'c2', title: 'Deregulation', status: 'verified', upvotes: 97, downvotes: 12 },
    { id: 'c3', title: 'Housing Bubble', status: 'pending', upvotes: 23, downvotes: 8 },
  ],
  effects: [
    { id: 'e1', title: 'Global Recession', status: 'verified', upvotes: 210, downvotes: 3 },
    { id: 'e2', title: 'Bank Failures', status: 'disputed', upvotes: 45, downvotes: 40 },
    { id: 'e3', title: 'Government Bailouts', status: 'rejected', upvotes: 15, downvotes: 30 },
  ],
};

const statusColors: Record<string, string> = {
  verified: 'border-green-500 text-green-500',
  pending: 'border-yellow-500 text-yellow-500',
  disputed: 'border-orange-500 text-orange-500',
  rejected: 'border-red-500 text-red-500',
};

export default function TablePage({ params }: { params: { conceptId: string } }) {
  const router = useRouter();
  const conceptName = decodeURIComponent(params.conceptId).replace(/-/g, ' ');

  const handleNewSearch = () => {
    router.push('/');
  };

  const handleConceptClick = (title: string) => {
    const formattedTerm = encodeURIComponent(title.trim().toLowerCase().replace(/\s/g, '-'));
    router.push(`/table/${formattedTerm}`);
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-semibold capitalize tracking-tight">
          Exploring: <span className="text-primary">{conceptName}</span>
        </h1>
        <div className="flex items-center gap-2">
          <Link href={`/graph/${params.conceptId}`}>
            <Button variant="outline">Graph View</Button>
          </Link>
          <Button variant="secondary" onClick={handleNewSearch}>
            New Search
          </Button>
        </div>
      </div>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Causes</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Concept</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Votes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockData.causes.map((item) => (
                <TableRow key={item.id} className="cursor-pointer hover:bg-muted/50" onClick={() => handleConceptClick(item.title)}>
                  <TableCell className="font-medium">{item.title}</TableCell>
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
              ))}
            </TableBody>
          </Table>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Effects</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Concept</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Votes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockData.effects.map((item) => (
                <TableRow key={item.id} className="cursor-pointer hover:bg-muted/50" onClick={() => handleConceptClick(item.title)}>
                  <TableCell className="font-medium">{item.title}</TableCell>
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
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
