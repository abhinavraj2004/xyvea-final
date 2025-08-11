import { Button } from '@/components/ui/button';
import { SearchForm } from '@/components/search-form';

const suggestionChips = [
  'Causes of Climate Change',
  'Impact of AI on Jobs',
  'Brainstorm research topics',
  'Surprise me!',
];

export default function Home() {
  return (
    <div className="flex-1 flex flex-col justify-center">
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Xyvea: The Causal Engine
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground">
            Chart the intricate web of cause and effect. A visual odyssey to understand the 'why' behind everything.
          </p>
        </div>
      </div>
      <div className="flex-none p-4 md:p-6">
        <div className="mx-auto w-full max-w-4xl">
          <SearchForm />
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {suggestionChips.map((label) => (
              <Button key={label} variant="outline" className="rounded-full bg-transparent border-white/20 hover:bg-white/5">
                {label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
