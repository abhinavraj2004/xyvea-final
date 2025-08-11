import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { SearchForm } from '@/components/search-form';

const suggestionChips = [
  'Climate Change',
  'AI Development',
  'Global Economy',
  'Quantum Physics',
];

export default function Home() {
  return (
    <div className="container mx-auto flex h-[calc(100vh-4rem)] max-w-7xl flex-col items-center justify-center px-4">
      <div className="flex flex-col items-center text-center">
        <h1 className="text-5xl font-bold tracking-tight md:text-6xl">Understand Why.</h1>
        <p className="mt-6 max-w-3xl text-lg text-muted-foreground">
          Xyvea is a visual sense-making engine that maps the cause-and-effect relationships
          between ideas, events, and concepts. Explore connections, contribute your knowledge, and
          see the bigger picture.
        </p>
        <SearchForm />
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {suggestionChips.map((chip) => (
            <Button key={chip} variant="outline" size="sm" asChild className="rounded-full">
              <Link href={`/graph/${encodeURIComponent(chip.toLowerCase().replace(/\s/g, '-'))}`}>{chip}</Link>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
