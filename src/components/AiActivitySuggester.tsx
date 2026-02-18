'use client';

import { useState, useTransition } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { getAiSuggestionsAction } from '@/lib/actions';
import type { AiActivitySuggestionOutput } from '@/ai/flows/ai-activity-suggestion-flow';
import { Loader2, Wand2, Lightbulb, Package, Clock } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

const formSchema = z.object({
  partyType: z.string().min(1, 'Please select a party type.'),
  guestAgeGroup: z.string().min(1, 'Please select an age group.'),
  preferences: z.string().max(300, 'Preferences can be up to 300 characters.').optional(),
});

type Suggestion = AiActivitySuggestionOutput['suggestions'][0];

export default function AiActivitySuggester({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [isPending, startTransition] = useTransition();
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { partyType: '', guestAgeGroup: '', preferences: '' },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    startTransition(async () => {
      setSuggestions([]);
      const result = await getAiSuggestionsAction(values);
      if (result.success && result.suggestions) {
        setSuggestions(result.suggestions);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] flex flex-col h-[90vh] max-h-[700px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Wand2 className="w-6 h-6 text-primary" />
            <DialogTitle className="font-headline text-2xl">AI Activity Suggester</DialogTitle>
          </div>
          <DialogDescription>Let AI brainstorm some fun activities for your party!</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="partyType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Party Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select a type" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Birthday">Birthday</SelectItem>
                        <SelectItem value="Graduation">Graduation</SelectItem>
                        <SelectItem value="Holiday">Holiday</SelectItem>
                        <SelectItem value="Anniversary">Anniversary</SelectItem>
                        <SelectItem value="Casual Get-together">Casual Get-together</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="guestAgeGroup"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Guest Age Group</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select an age group" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Kids (5-12)">Kids (5-12)</SelectItem>
                        <SelectItem value="Teens (13-18)">Teens (13-18)</SelectItem>
                        <SelectItem value="Young Adults (19-30)">Young Adults (19-30)</SelectItem>
                        <SelectItem value="Adults (30+)">Adults (30+)</SelectItem>
                        <SelectItem value="Mixed Ages">Mixed Ages</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="preferences"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferences (optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., Outdoor, low-cost, not too noisy..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Get Suggestions
            </Button>
          </form>
        </Form>
        
        <Separator className="my-4" />

        <ScrollArea className="flex-1 -mx-6">
            <div className='px-6'>
            {isPending && (
                <div className="flex flex-col items-center justify-center text-muted-foreground py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
                    <p>Brewing up some fun ideas...</p>
                </div>
            )}
            {suggestions.length > 0 && (
            <Accordion type="single" collapsible className="w-full">
                {suggestions.map((s, i) => (
                <AccordionItem value={`item-${i}`} key={i}>
                    <AccordionTrigger className='font-bold text-left'>
                        <Lightbulb className="mr-2 h-4 w-4 text-accent flex-shrink-0" />
                        {s.activityName}
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3">
                        <p className="text-sm text-muted-foreground">{s.description}</p>
                        {s.materialsNeeded && s.materialsNeeded.length > 0 && (
                            <div className="text-sm">
                                <h4 className="font-semibold flex items-center mb-1"><Package className="mr-2 h-4 w-4"/>Materials:</h4>
                                <ul className="list-disc list-inside text-muted-foreground">
                                    {s.materialsNeeded.map((m, j) => <li key={j}>{m}</li>)}
                                </ul>
                            </div>
                        )}
                        {s.estimatedDurationMinutes && (
                            <div className="text-sm flex items-center">
                                <h4 className="font-semibold flex items-center"><Clock className="mr-2 h-4 w-4"/>Duration:</h4>
                                <span className="text-muted-foreground ml-2">{s.estimatedDurationMinutes} minutes</span>
                            </div>
                        )}
                    </AccordionContent>
                </AccordionItem>
                ))}
            </Accordion>
            )}
            {!isPending && suggestions.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                    <p>Your AI-powered suggestions will appear here.</p>
                </div>
            )}
            </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
