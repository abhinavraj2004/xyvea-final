'use client';

import { Button } from '@/components/ui/button';
import { SearchForm } from '@/components/search-form';
import { useRouter } from 'next/navigation';

const suggestionChips = [
  'Causes of Climate Change',
  'Impact of AI on Jobs',
  'Economic effects of remote work',
  'Factors influencing vaccination rates',
];

export default function Home() {
  const router = useRouter();

  const handleChipClick = (label: string) => {
    if (label.trim()) {
      const formattedTerm = encodeURIComponent(label.trim().toLowerCase().replace(/\s/g, '-'));
      router.push(`/graph/${formattedTerm}`);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          <span className="text-primary">CausalCanvas:</span> Unravel the 'Why'
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground">
          A visual odyssey to chart the intricate web of cause and effect.
        </p>
      </div>

      <div className="mt-8 w-full max-w-4xl">
        <SearchForm />
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {suggestionChips.map((label) => (
            <Button
              key={label}
              variant="outline"
              className="rounded-full bg-transparent border-white/20 hover:bg-white/5"
              onClick={() => handleChipClick(label)}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
