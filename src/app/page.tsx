import { Button } from '@/components/ui/button';
import { SearchForm } from '@/components/search-form';
import { BrainCircuit, Lightbulb, MessageSquareQuote, Shuffle } from 'lucide-react';

const suggestionChips = [
  { label: 'Summarize text', icon: MessageSquareQuote },
  { label: 'Surprise me', icon: Shuffle },
  { label: 'Brainstorm', icon: BrainCircuit },
  { label: 'Analyze data', icon: Lightbulb },
]

export default function Home() {
  return (
    <div className="flex h-full flex-col justify-end">
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight">Log in to unlock GPT-5</h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
              ChatGPT now has our smartest, fastest, most useful model yet, with thinking built in — log in to get our best answers.
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
             <Button variant="outline" className="rounded-full bg-transparent border-white/20 hover:bg-white/5">
                More
              </Button>
          </div>
          <p className="mt-4 text-center text-xs text-muted-foreground/50">
            By messaging Xyvea, you agree to our Terms and have read our Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
