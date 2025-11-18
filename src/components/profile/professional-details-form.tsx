
"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/api";
import { Loader2 } from "lucide-react";
import { useState } from "react";

const professionalDetailsSchema = z.object({
  occupation: z.string().min(2, "Occupation is required"),
  companyName: z.string().min(2, "Company name is required"),
  annualIncome: z.coerce.number().min(0, "Annual income cannot be negative"),
});

export function ProfessionalDetailsForm({ profile }: { profile: any }) {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<z.infer<typeof professionalDetailsSchema>>({
    resolver: zodResolver(professionalDetailsSchema),
    defaultValues: {
      occupation: profile?.occupation || "",
      companyName: profile?.companyName || "",
      annualIncome: profile?.annualIncome || 0,
    },
  });

  const onSubmit = async (data: z.infer<typeof professionalDetailsSchema>) => {
    setIsSaving(true);
    try {
      await api.put("/profiles/me/professional", data);
      toast({
        title: "Professional Details Updated",
        description: "Your professional details have been saved successfully.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description:
          error.response?.data?.message ||
          "Could not save your professional details.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="occupation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Occupation</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="companyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="annualIncome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Annual Income (in Lakhs)</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSaving}>
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </form>
    </Form>
  );
}
