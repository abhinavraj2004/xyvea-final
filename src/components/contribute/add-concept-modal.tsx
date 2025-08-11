'use client';

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


const formSchema = z.object({
  title: z.string().min(2, { message: 'Title must be at least 2 characters.' }).max(100),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
});

type AddConceptModalProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

export default function AddConceptModal({ isOpen, onOpenChange }: AddConceptModalProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // In a real application, this would call an API to save the new concept.
    console.log(values);
    toast({
      title: 'Concept Submitted',
      description: 'Your new concept has been added to the graph. Thank you!',
    });
    onOpenChange(false);
    form.reset();
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
