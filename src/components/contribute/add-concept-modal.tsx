'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

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
import { useToast } from '@/hooks/use-toast';
import { addConcept } from '@/lib/neo4j'; // Updated import
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';


const formSchema = z.object({
  title: z.string().min(2, { message: 'Title must be at least 2 characters.' }).max(100),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
});

type AddConceptModalProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  initialTitle?: string;
};

export default function AddConceptModal({ isOpen, onOpenChange, initialTitle = '' }: AddConceptModalProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialTitle,
      description: '',
    },
  });

  useEffect(() => {
    if (initialTitle) {
      form.setValue('title', initialTitle);
    }
  }, [initialTitle, form]);

  useEffect(() => {
    if (!isOpen) {
      form.reset({ title: '', description: '' });
    }
  }, [isOpen, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to add a concept.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await addConcept({ ...values, authorId: user.uid });
      toast({
        title: 'Concept Submitted',
        description: 'Your new concept has been added. Thank you!',
      });
      const formattedTerm = encodeURIComponent(values.title.trim().toLowerCase().replace(/\s/g, '-'));
      router.push(`/graph/${formattedTerm}`);
      onOpenChange(false);
    } catch (error) {
      console.error("Error adding concept: ", error);
      toast({
        title: 'Error',
        description: 'There was a problem adding your concept. Please try again.',
        variant: 'destructive',
      });
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a New Concept</DialogTitle>
          <DialogDescription>
            Introduce a new idea, event, or entity to the knowledge graph.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Quantum Computing" {...field} />
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
                    <Textarea placeholder="Briefly describe the concept." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
               <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
               <Button type="submit">Add Concept</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
