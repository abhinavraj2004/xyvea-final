import GraphView from "@/components/graph/graph-view";
import { Button } from "@/components/ui/button";

export default function GraphPage({ params }: { params: { conceptId: string } }) {
  const conceptName = decodeURIComponent(params.conceptId).replace(/-/g, ' ');

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-semibold capitalize tracking-tight">
          Exploring: <span className="text-primary">{conceptName}</span>
        </h1>
        <Button variant="secondary" className="mt-4 sm:mt-0">
          New Search
        </Button>
      </div>
      <div className="mt-8">
        <GraphView centralConcept={conceptName} />
      </div>
    </div>
  );
}
