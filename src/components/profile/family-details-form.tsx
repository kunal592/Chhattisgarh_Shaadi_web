
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/api";
import { Loader2 } from "lucide-react";
import { useState } from "react";

const familyDetailsSchema = z.object({
  fatherName: z.string().min(2, "Father's name is required"),
  motherName: z.string().min(2, "Mother's name is required"),
  numberOfSiblings: z.coerce.number().min(0, "Number of siblings cannot be negative"),
  familyType: z.enum(["JOINT", "NUCLEAR"]),
  familyValues: z.enum(["TRADITIONAL", "MODERATE", "LIBERAL"]),
  familyAffluence: z.enum(["RICH", "UPPER_MIDDLE_CLASS", "MIDDLE_CLASS", "LOWER_MIDDLE_CLASS"]),
});

export function FamilyDetailsForm({ profile }: { profile: any }) {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<z.infer<typeof familyDetailsSchema>>({
    resolver: zodResolver(familyDetailsSchema),
    defaultValues: {
      fatherName: profile?.fatherName || "",
      motherName: profile?.motherName || "",
      numberOfSiblings: profile?.numberOfSiblings || 0,
      familyType: profile?.familyType || "NUCLEAR",
      familyValues: profile?.familyValues || "MODERATE",
      familyAffluence: profile?.familyAffluence || "MIDDLE_CLASS",
    },
  });

  const onSubmit = async (data: z.infer<typeof familyDetailsSchema>) => {
    setIsSaving(true);
    try {
      await api.put("/profiles/me/family", data);
      toast({
        title: "Family Details Updated",
        description: "Your family details have been saved successfully.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description:
          error.response?.data?.message ||
          "Could not save your family details.",
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
          name="fatherName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Father's Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="motherName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mother's Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="numberOfSiblings"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Siblings</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="familyType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Family Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select family type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="JOINT">Joint</SelectItem>
                  <SelectItem value="NUCLEAR">Nuclear</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="familyValues"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Family Values</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select family values" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="TRADITIONAL">Traditional</SelectItem>
                  <SelectItem value="MODERATE">Moderate</SelectItem>
                  <SelectItem value="LIBERAL">Liberal</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="familyAffluence"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Family Affluence</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select family affluence" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="RICH">Rich</SelectItem>
                  <SelectItem value="UPPER_MIDDLE_CLASS">
                    Upper Middle Class
                  </SelectItem>
                  <SelectItem value="MIDDLE_CLASS">Middle Class</SelectItem>
                  <SelectItem value="LOWER_MIDDLE_CLASS">
                    Lower Middle Class
                  </SelectItem>
                </SelectContent>
              </Select>
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
