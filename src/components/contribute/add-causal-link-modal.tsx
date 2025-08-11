'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { verifySourceAction } from '@/app/actions';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Wand2, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  cause: z.string().min(2, { message: 'Cause must be at least 2 characters.' }),
  effect: z.string().min(2, { message: 'Effect must be at least 2 characters.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
  sourceURL: z.string().url({ message: 'Please enter a valid URL.' }),
});

type AddCausalLinkModalProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

type VerificationResult = {
  summary: string;
  confidence: number;
  error?: string;
};

export default function AddCausalLinkModal({ isOpen, onOpenChange }: AddCausalLinkModalProps) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cause: '',
      effect: '',
      description: '',
      sourceURL: '',
    },
  });

  const handleVerify = async () => {
    const { sourceURL, cause, effect } = form.getValues();
    if (!sourceURL || !cause || !effect) {
      form.trigger(['sourceURL', 'cause', 'effect']);
      return;
    }
    
    setIsVerifying(true);
    setVerificationResult(null);

    const result = await verifySourceAction({ sourceURL, cause, effect });
    setVerificationResult(result);
    setIsVerifying(false);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // In a real application, this would call an API to save the new causal link.
    console.log(values);
    toast({
      title: 'Contribution Submitted',
      description: 'Your causal link has been submitted for review. Thank you!',
    });
    onOpenChange(false);
    form.reset();
    setVerificationResult(null);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add a Causal Link</DialogTitle>
          <DialogDescription>
            Connect two concepts with a sourced cause-and-effect relationship.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="cause"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cause Concept</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Increased CO2 Emissions" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="effect"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Effect Concept</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Global Warming" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Briefly describe the causal claim." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sourceURL"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Source URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/article" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div>
              <Button type="button" variant="secondary" onClick={handleVerify} disabled={isVerifying}>
                {isVerifying ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Wand2 className="mr-2 h-4 w-4" />
                )}
                Verify with AI
              </Button>
            </div>
            
            {isVerifying && <p className="text-sm text-muted-foreground flex items-center"><Loader2 className="mr-2 h-4 w-4 animate-spin" />Analyzing source...</p>}

            {verificationResult && (
              <Alert variant={verificationResult.error ? 'destructive' : 'default'}>
                {verificationResult.error ? (
                  <XCircle className="h-4 w-4" />
                ) : (
                  <CheckCircle className="h-4 w-4" />
                )}
                <AlertTitle>
                  {verificationResult.error ? 'Verification Failed' : `AI Verification Result (Confidence: ${verificationResult.confidence}/10)`}
                </AlertTitle>
                <AlertDescription>
                  {verificationResult.error || verificationResult.summary}
                </AlertDescription>
              </Alert>
            )}

            <div className="flex justify-end gap-2 pt-4">
               <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
               <Button type="submit">Submit Link</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
