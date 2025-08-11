import { Button } from '@/components/ui/button';
import { SearchForm } from '@/components/search-form';
import { Brain, Cpu, Sparkles, TrendingUp } from 'lucide-react';

const suggestionChips = [
  { label: 'Causes of Climate Change', icon: TrendingUp },
  { label: 'Brainstorm ideas', icon: Brain },
  { label: 'Surprise me!', icon: Sparkles },
  { label: 'Impact of AI on Jobs', icon: Cpu },
]

export default function Home() {
  return (
    <div className="flex h-full flex-col justify-center">
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Log in to unlock Xyvea
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground">
            Xyvea now has our smartest, fastest, most useful model yet, with thinking built in — log in to get our best answers.
          </p>
        </div>
      </div>
      <div className="flex-none p-4 md:p-6">
        <div className="mx-auto w-full max-w-4xl">
          <SearchForm />
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {suggestionChips.map(({ label, icon: Icon }) => (
              <Button key={label} variant="outline" className="rounded-full bg-transparent border-white/20 hover:bg-white/5">
                <Icon className="mr-2 h-4 w-4" />
                {label}
              </Button>
            ))}
          </div>
          <p className="mt-8 text-center text-xs text-muted-foreground/50">
            By using Xyvea, you agree to our Terms and have read our Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
