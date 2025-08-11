'use client';

import { useEffect, useState } from 'react';
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Wand2, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';

const formSchema = z.object({
  relationship: z.enum(['cause', 'effect'], {
    required_error: 'You need to select a relationship type.',
  }),
  relatedConceptName: z.string().min(2, { message: 'Concept name must be at least 2 characters.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
  sourceURL: z.string().url({ message: 'Please enter a valid URL.' }),
});

type AddCausalLinkModalProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  baseConceptName?: string;
};

type VerificationResult = {
  summary: string;
  confidence: number;
  error?: string;
};

export default function AddCausalLinkModal({ isOpen, onOpenChange, baseConceptName }: AddCausalLinkModalProps) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const { toast } = useToast();
  const { isLoggedIn } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      relatedConceptName: '',
      description: '',
      sourceURL: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset();
      setVerificationResult(null);
    }
  }, [isOpen, form]);

  const handleVerify = async () => {
    const { sourceURL, relatedConceptName, relationship } = form.getValues();
    if (!sourceURL || !relatedConceptName || !relationship || !baseConceptName) {
      form.trigger(['sourceURL', 'relatedConceptName', 'relationship']);
      return;
    }
    
    setIsVerifying(true);
    setVerificationResult(null);

    const cause = relationship === 'cause' ? relatedConceptName : baseConceptName;
    const effect = relationship === 'effect' ? relatedConceptName : baseConceptName;

    const result = await verifySourceAction({ sourceURL, cause, effect });
    setVerificationResult(result);
    setIsVerifying(false);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!baseConceptName || !isLoggedIn) return;

    const cause = values.relationship === 'cause' ? values.relatedConceptName : baseConceptName;
    const effect = values.relationship === 'effect' ? values.relatedConceptName : baseConceptName;

    const submissionData = {
      cause,
      effect,
      description: values.description,
      sourceURL: values.sourceURL,
    };
    
    console.log(submissionData);
    toast({
      title: 'Contribution Submitted',
      description: 'Your causal link has been submitted for review. Thank you!',
    });
    onOpenChange(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Propose a Causal Link</DialogTitle>
          <DialogDescription>
            {baseConceptName 
              ? `Proposing a link for: "${baseConceptName}"`
              : 'Connect two concepts with a sourced cause-and-effect relationship.'
            }
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="relationship"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>The related concept is a...</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex items-center space-x-4"
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="cause" />
                        </FormControl>
                        <FormLabel className="font-normal">Cause</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="effect" />
                        </FormControl>
                        <FormLabel className="font-normal">Effect</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="relatedConceptName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Related Concept Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Global Warming" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
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
              <Button type="button" variant="secondary" onClick={handleVerify} disabled={isVerifying || !baseConceptName || !isLoggedIn}>
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
              <Alert variant={verificationResult.error ? 'destructive' : verificationResult.confidence > 5 ? 'default' : 'destructive'} className={cn(verificationResult.confidence > 5 && !verificationResult.error && "border-green-500/50 text-foreground")}>
                 {verificationResult.error ? (
                  <XCircle className="h-4 w-4" />
                ) : (
                  <CheckCircle className={cn("h-4 w-4", verificationResult.confidence > 5 ? "text-green-500" : "text-destructive")} />
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
               <Button type="submit" disabled={!baseConceptName || !isLoggedIn}>Submit Link</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
