
'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
// import { generateMatchSuggestions, MatchSuggestionsInput, MatchSuggestionsOutput } from '@/ai/flows/gen-ai-match-suggestions';
import { Loader2, Wand2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

const formSchema = z.object({
  motherTongue: z.string().min(1, 'Mother tongue is required.'),
  nativeDistrict: z.string().min(1, 'Native district is required.'),
  caste: z.string().min(1, 'Caste is required.'),
  partnerPreferences: z.string().min(10, 'Please describe your preferences in more detail.'),
});

// Mock function until Genkit is restored
async function generateMatchSuggestions(values: any): Promise<any> {
    console.log("Generating suggestions for:", values);
    await new Promise(resolve => setTimeout(resolve, 1500));
    return {
        suggestions: [
            "Found a Software Engineer from Raipur who enjoys reading and hiking. Seems like a good fit based on shared interests.",
            "Consider a profile of a Teacher from Bilaspur. Family-oriented values seem to align with your preferences.",
            "A Doctor from Durg is looking for a partner with a modern outlook and traditional values, which matches your description."
        ]
    };
}

export function MatchSuggestions() {
  const [suggestions, setSuggestions] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      motherTongue: 'Chhattisgarhi',
      nativeDistrict: 'Raipur',
      caste: 'Sahu',
      partnerPreferences: 'Looking for a well-educated professional from a similar background. Should be family-oriented and respect elders. Non-smoker and teetotaler preferred.',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    setSuggestions(null);
    try {
      const result = await generateMatchSuggestions(values);
      setSuggestions(result);
    } catch (e) {
      console.error(e);
      setError('Failed to generate suggestions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="text-primary" />
          AI Match Suggestions
        </CardTitle>
        <CardDescription>
          Tell us what you&apos;re looking for, and our AI will find potential matches for you. (This feature is currently in demo mode).
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="motherTongue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mother Tongue</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select mother tongue" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Chhattisgarhi">Chhattisgarhi</SelectItem>
                        <SelectItem value="Hindi">Hindi</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nativeDistrict"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Native District</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Raipur" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="caste"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Caste</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Sahu" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="partnerPreferences"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Partner Preferences</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your ideal partner's age, education, profession, values, etc."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Suggestions'
              )}
            </Button>
          </form>
        </Form>

        {error && (
            <Alert variant="destructive" className="mt-6">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}

        {suggestions && suggestions.suggestions.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Here are your suggestions:</h3>
            <div className="space-y-4">
              {suggestions.suggestions.map((suggestion: string, index: number) => (
                <Card key={index} className="bg-secondary/50">
                  <CardContent className="p-4">
                    <p className="text-sm text-foreground">{suggestion}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
