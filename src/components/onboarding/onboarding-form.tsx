'use client';
import React from "react";

import { useState, ChangeEvent } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

const profileSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  gender: z.enum(['MALE', 'FEMALE'], { required_error: 'Please select a gender' }),
  bio: z.string().max(500, 'Bio cannot be longer than 500 characters').optional(),
});

export function OnboardingForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      bio: '',
    },
  });

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      if (file.size > 5 * 1024 * 1024) { // 5MB size limit
        toast({
          variant: 'destructive',
          title: 'File too large',
          description: 'Please upload a photo smaller than 5MB.',
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const handlePhotoUpload = async () => {
    if (!selectedFile) return true; // No file, so we count as success

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      await api.post('/uploads/profile-photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast({ title: 'Photo Uploaded', description: 'Your profile photo is saved.' });
      return true;
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Photo Upload Failed',
        description: 'Could not upload your photo. Please try again.',
      });
      return false;
    }
  };
const onSubmit = async (values: z.infer<typeof profileSchema>) => {
  setIsLoading(true);

  console.log("📤 SUBMIT CLICKED");
  console.log("📌 Raw Form Values:", values);

  const photoUploaded = await handlePhotoUpload();
  console.log("📸 Photo Upload Result:", photoUploaded);

  if (!photoUploaded) {
    console.log("⛔ Photo upload failed. Stopping form submit.");
    setIsLoading(false);
    return;
  }

  try {
    console.log("🚀 Sending POST /profiles with payload:", values);

    const response = await api.post('/profiles', values);

    console.log("✅ Backend Response:", response.data);

    toast({
      title: 'Profile Created',
      description: 'Your profile has been successfully created.',
    });

    router.push('/dashboard');
    router.refresh();

  } catch (error: any) {
    console.error("❌ Onboarding failed:", error);
    console.error("❌ Backend Error:", error.response?.data);

    toast({
      variant: 'destructive',
      title: 'An error occurred',
      description: error.response?.data?.message || 'Could not save your profile.',
    });

  } finally {
    setIsLoading(false);
  }
};

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Create Your Profile</CardTitle>
        <CardDescription>Complete your profile to start connecting with others.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="firstName" render={({ field }) => (<FormItem><FormLabel>First Name</FormLabel><FormControl><Input placeholder="e.g., John" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="lastName" render={({ field }) => (<FormItem><FormLabel>Last Name</FormLabel><FormControl><Input placeholder="e.g., Doe" {...field} /></FormControl><FormMessage /></FormItem>)} />
            </div>
            <FormField control={form.control} name="gender" render={({ field }) => (<FormItem className="space-y-3"><FormLabel>Gender</FormLabel><FormControl><RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1"><FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="MALE" /></FormControl><FormLabel className="font-normal">Male</FormLabel></FormItem><FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="FEMALE" /></FormControl><FormLabel className="font-normal">Female</FormLabel></FormItem></RadioGroup></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="bio" render={({ field }) => (<FormItem><FormLabel>About You (Bio)</FormLabel><FormControl><Textarea placeholder="Tell us a little bit about yourself" className="resize-none" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormItem>
              <FormLabel>Profile Photo</FormLabel>
              <FormControl><Input type="file" accept="image/png, image/jpeg, image/webp" onChange={handleFileChange} /></FormControl>
              <FormMessage />
            </FormItem>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} 
              Save Profile & Continue
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
