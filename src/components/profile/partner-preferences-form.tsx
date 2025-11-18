
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

const partnerPreferencesSchema = z.object({
  minAge: z.coerce.number().min(18, "Minimum age must be at least 18"),
  maxAge: z.coerce.number().max(70, "Maximum age cannot be more than 70"),
  minHeight: z.coerce.number().min(100, "Minimum height must be at least 100cm"),
  maxHeight: z.coerce.number().max(250, "Maximum height cannot be more than 250cm"),
  maritalStatus: z.string().optional(),
  religion: z.string().optional(),
  caste: z.string().optional(),
  motherTongue: z.string().optional(),
  occupation: z.string().optional(),
});

export function PartnerPreferencesForm({ profile }: { profile: any }) {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<z.infer<typeof partnerPreferencesSchema>>({
    resolver: zodResolver(partnerPreferencesSchema),
    defaultValues: {
      minAge: profile?.partnerMinAge || 18,
      maxAge: profile?.partnerMaxAge || 35,
      minHeight: profile?.partnerMinHeight || 150,
      maxHeight: profile?.partnerMaxHeight || 200,
      maritalStatus: profile?.partnerMaritalStatus || "",
      religion: profile?.partnerReligion || "",
      caste: profile?.partnerCaste || "",
      motherTongue: profile?.partnerMotherTongue || "",
      occupation: profile?.partnerOccupation || "",
    },
  });

  const onSubmit = async (data: z.infer<typeof partnerPreferencesSchema>) => {
    setIsSaving(true);
    try {
      await api.put("/profiles/me/preferences", data);
      toast({
        title: "Partner Preferences Updated",
        description: "Your partner preferences have been saved successfully.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description:
          error.response?.data?.message ||
          "Could not save your partner preferences.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="minAge"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minimum Age</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="maxAge"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Maximum Age</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
            <FormField
                control={form.control}
                name="minHeight"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Minimum Height (cm)</FormLabel>
                    <FormControl>
                    <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="maxHeight"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Maximum Height (cm)</FormLabel>
                    <FormControl>
                    <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
        </div>
        <FormField
          control={form.control}
          name="maritalStatus"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Marital Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select marital status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="NEVER_MARRIED">Never Married</SelectItem>
                  <SelectItem value="DIVORCED">Divorced</SelectItem>
                  <SelectItem value="WIDOWED">Widowed</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="religion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Religion</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g., Hindu, Muslim, Christian" />
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
                <Input {...field} placeholder="e.g., Brahmin, Rajput, etc."/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="motherTongue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mother Tongue</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g., Hindi, English, etc."/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="occupation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Occupation</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g., Software Engineer, Doctor, etc."/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSaving}>
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Preferences
        </Button>
      </form>
    </Form>
  );
}
