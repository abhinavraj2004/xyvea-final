'use client';

import GraphView from '@/components/graph/graph-view';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function GraphPage({ params }: { params: { conceptId: string } }) {
  const router = useRouter();
  const conceptName = decodeURIComponent(params.conceptId).replace(/-/g, ' ');

  const handleNewSearch = () => {
    router.push('/');
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-semibold capitalize tracking-tight">
          Exploring: <span className="text-primary">{conceptName}</span>
        </h1>
        <div className="flex items-center gap-2">
          <Link href={`/table/${params.conceptId}`}>
            <Button variant="outline">Tabular View</Button>
          </Link>
          <Button variant="secondary" onClick={handleNewSearch}>
            New Search
          </Button>
        </div>
      </div>
      <div className="mt-8">
        <GraphView centralConceptId={params.conceptId} />
      </div>
    </div>
  );
}
