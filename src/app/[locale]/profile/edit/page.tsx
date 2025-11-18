
"use client"

import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Loader2 } from "lucide-react";
import { PhotoUploader } from "@/components/profile/photo-uploader";
import { useAuthStore } from "@/store/auth";
import api from "@/lib/api";
import { ApiProfile } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { FamilyDetailsForm } from "@/components/profile/family-details-form";
import { ProfessionalDetailsForm } from "@/components/profile/professional-details-form";
import { PartnerPreferencesForm } from "@/components/profile/partner-preferences-form";


const profileEditSchema = z.object({
  // Basic Info
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  dateOfBirth: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid date"),
  maritalStatus: z.enum(["NEVER_MARRIED", "DIVORCED", "WIDOWED", "AWAITING_DIVORCE", "ANNULLED"]),
  height: z.coerce.number().min(100).max(250).optional(),
  weight: z.coerce.number().min(30).max(200).optional(),
  aboutMe: z.string().min(50, "Bio must be at least 50 characters").optional(),
  
  // Religion
  religion: z.string(),
  caste: z.string(),
  subCaste: z.string().optional(),
  motherTongue: z.string(),

  // Location (from onboarding)
  nativeDistrict: z.string().optional(),
  nativeTehsil: z.string().optional(),

});


export default function EditProfilePage() {
    const { user: authUser } = useAuthStore();
    const [profile, setProfile] = useState<ApiProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const { toast } = useToast();

    const form = useForm<z.infer<typeof profileEditSchema>>({
        resolver: zodResolver(profileEditSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            dateOfBirth: '',
            aboutMe: '',
        }
    });

    useEffect(() => {
        async function fetchProfile() {
            if (!authUser) {
                setIsLoading(false);
                return;
            };
            try {
                const response = await api.get('/profiles/me');
                const profileData = response.data.data;
                setProfile(profileData);
                // Populate form with fetched data
                form.reset({
                    firstName: profileData.firstName,
                    lastName: profileData.lastName,
                    dateOfBirth: profileData.dateOfBirth.split('T')[0], // Format for date input
                    maritalStatus: profileData.maritalStatus,
                    height: profileData.height || undefined,
                    weight: profileData.weight || undefined,
                    aboutMe: profileData.bio || undefined,
                    religion: profileData.religion,
                    caste: profileData.caste,
                    subCaste: profileData.subCaste || undefined,
                    motherTongue: profileData.motherTongue,
                    nativeDistrict: profileData.nativeDistrict || undefined,
                    nativeTehsil: profileData.nativeTehsil || undefined,
                });
            } catch (error) {
                console.error("Failed to fetch profile", error);
                toast({ variant: 'destructive', title: "Error", description: "Failed to load your profile." });
            } finally {
                setIsLoading(false);
            }
        }
        fetchProfile();
    }, [authUser, form, toast]);

    const onSubmit = async (data: z.infer<typeof profileEditSchema>) => {
        setIsSaving(true);
        try {
            await api.put('/profiles/me', {
                ...data,
                bio: data.aboutMe // Map frontend `aboutMe` to backend `bio`
            });
            toast({
                title: "Profile Updated",
                description: "Your changes have been saved successfully.",
            });
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Update Failed",
                description: error.response?.data?.message || "Could not save your changes."
            });
        } finally {
            setIsSaving(false);
        }
    };
    
    const profileImage = profile?.media?.find(m => m.isProfilePicture)?.url || authUser?.profilePhoto;
    const profileName = profile ? `${profile.firstName} ${profile.lastName}` : authUser?.name;

    return (
        <DashboardLayout>
            <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="p-4 sm:p-6 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Edit Your Profile</CardTitle>
                                <CardDescription>Keep your profile updated to get the best matches.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {isLoading ? (
                                    <div className="flex items-center gap-6">
                                        <Skeleton className="w-24 h-24 rounded-full" />
                                        <div className="space-y-2">
                                            <Skeleton className="h-6 w-40" />
                                            <Skeleton className="h-4 w-32" />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col sm:flex-row items-center gap-6">
                                        <div className="relative">
                                            <Avatar className="w-24 h-24 ring-2 ring-primary ring-offset-2">
                                                <AvatarImage src={profileImage} alt={profileName || ''} data-ai-hint="person photo"/>
                                                <AvatarFallback>{profileName?.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <Button size="icon" className="absolute -bottom-2 -right-2 rounded-full">
                                                <Camera className="w-4 h-4"/>
                                            </Button>
                                        </div>
                                        <div className="flex-grow text-center sm:text-left">
                                            <h2 className="text-2xl font-bold">{profileName}</h2>
                                            <p className="text-muted-foreground">Profile ID: {profile?.id}</p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Tabs defaultValue="basic" className="w-full">
                             <div className="overflow-x-auto pb-2">
                                <TabsList className="grid w-full grid-cols-2 md:grid-cols-6">
                                    <TabsTrigger value="basic">Basic</TabsTrigger>
                                    <TabsTrigger value="religion">Religion</TabsTrigger>
                                    <TabsTrigger value="photos">Photos</TabsTrigger>
                                    <TabsTrigger value="family">Family</TabsTrigger>
                                    <TabsTrigger value="professional">Professional</TabsTrigger>
                                    <TabsTrigger value="preferences">Preferences</TabsTrigger>
                                </TabsList>
                            </div>
                            <Card>
                                <CardContent className="pt-6">
                                    <TabsContent value="basic" className="space-y-4">
                                        <FormField name="firstName" render={({ field }) => (
                                            <FormItem className="grid grid-cols-1 md:grid-cols-3 items-center gap-2">
                                                <FormLabel className="md:text-right text-muted-foreground">First Name</FormLabel>
                                                <div className="md:col-span-2">
                                                    <FormControl><Input {...field} /></FormControl>
                                                    <FormMessage />
                                                </div>
                                            </FormItem>
                                        )} />
                                        <FormField name="lastName" render={({ field }) => (
                                            <FormItem className="grid grid-cols-1 md:grid-cols-3 items-center gap-2">
                                                <FormLabel className="md:text-right text-muted-foreground">Last Name</FormLabel>
                                                <div className="md:col-span-2">
                                                    <FormControl><Input {...field} /></FormControl>
                                                    <FormMessage />
                                                </div>
                                            </FormItem>
                                        )} />
                                         <FormField name="dateOfBirth" render={({ field }) => (
                                            <FormItem className="grid grid-cols-1 md:grid-cols-3 items-center gap-2">
                                                <FormLabel className="md:text-right text-muted-foreground">Date of Birth</FormLabel>
                                                 <div className="md:col-span-2">
                                                    <FormControl><Input type="date" {...field} /></FormControl>
                                                    <FormMessage />
                                                </div>
                                            </FormItem>
                                        )} />
                                         <FormField name="maritalStatus" render={({ field }) => (
                                            <FormItem className="grid grid-cols-1 md:grid-cols-3 items-center gap-2">
                                                <FormLabel className="md:text-right text-muted-foreground">Marital Status</FormLabel>
                                                 <div className="md:col-span-2">
                                                    <Select onValueChange={field.onChange} value={field.value}>
                                                        <FormControl><SelectTrigger><SelectValue placeholder="Select marital status" /></SelectTrigger></FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="NEVER_MARRIED">Never Married</SelectItem>
                                                            <SelectItem value="DIVORCED">Divorced</SelectItem>
                                                            <SelectItem value="WIDOWED">Widowed</SelectItem>
                                                            <SelectItem value="AWAITING_DIVORCE">Awaiting Divorce</SelectItem>
                                                            <SelectItem value="ANNULLED">Annulled</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </div>
                                            </FormItem>
                                        )} />
                                        <FormField name="aboutMe" render={({ field }) => (
                                            <FormItem className="grid grid-cols-1 md:grid-cols-3 items-start gap-2">
                                                <FormLabel className="md:text-right text-muted-foreground mt-2">About Me (Bio)</FormLabel>
                                                <div className="md:col-span-2">
                                                    <FormControl><Textarea {...field} rows={5} /></FormControl>
                                                    <FormMessage />
                                                </div>
                                            </FormItem>
                                        )} />
                                    </TabsContent>

                                    <TabsContent value="religion" className="space-y-4">
                                         <FormField control={form.control} name="religion" render={({ field }) => (
                                            <FormItem className="grid grid-cols-1 md:grid-cols-3 items-center gap-2">
                                                <FormLabel className="md:text-right text-muted-foreground">Religion</FormLabel>
                                                <div className="md:col-span-2">
                                                <Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select religion" /></SelectTrigger></FormControl><SelectContent>
                                                    <SelectItem value="HINDU">Hindu</SelectItem><SelectItem value="MUSLIM">Muslim</SelectItem><SelectItem value="CHRISTIAN">Christian</SelectItem><SelectItem value="SIKH">Sikh</SelectItem><SelectItem value="OTHER">Other</SelectItem>
                                                </SelectContent></Select>
                                                <FormMessage />
                                                </div>
                                            </FormItem>
                                        )} />
                                        <FormField control={form.control} name="caste" render={({ field }) => (
                                            <FormItem className="grid grid-cols-1 md:grid-cols-3 items-center gap-2">
                                                <FormLabel className="md:text-right text-muted-foreground">Caste</FormLabel>
                                                <div className="md:col-span-2">
                                                    <FormControl><Input {...field} /></FormControl>
                                                    <FormMessage />
                                                </div>
                                            </FormItem>
                                        )} />
                                        <FormField control={form.control} name="motherTongue" render={({ field }) => (
                                            <FormItem className="grid grid-cols-1 md:grid-cols-3 items-center gap-2">
                                                <FormLabel className="md:text-right text-muted-foreground">Mother Tongue</FormLabel>
                                                <div className="md:col-span-2">
                                                    <Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select mother tongue" /></SelectTrigger></FormControl><SelectContent>
                                                        <SelectItem value="CHHATTISGARHI">Chhattisgarhi</SelectItem><SelectItem value="HINDI">Hindi</SelectItem><SelectItem value="ENGLISH">English</SelectItem><SelectItem value="OTHER">Other</SelectItem>
                                                    </SelectContent></Select>
                                                    <FormMessage />
                                                </div>
                                            </FormItem>
                                        )} />
                                    </TabsContent>
                                    
                                    <TabsContent value="photos">
                                        <PhotoUploader />
                                    </TabsContent>
                                    <TabsContent value="family" className="space-y-4">
                                         {profile ? <FamilyDetailsForm profile={profile} /> : <p className="text-sm text-muted-foreground text-center">Please fill out your basic information first.</p>}
                                    </TabsContent>
                                     <TabsContent value="professional" className="space-y-4">
                                         {profile ? <ProfessionalDetailsForm profile={profile} /> : <p className="text-sm text-muted-foreground text-center">Please fill out your basic information first.</p>}
                                    </TabsContent>
                                    <TabsContent value="preferences" className="space-y-4">
                                         {profile ? <PartnerPreferencesForm profile={profile} /> : <p className="text-sm text-muted-foreground text-center">Please fill out your basic information first.</p>}
                                    </TabsContent>
                                </CardContent>
                            </Card>
                        </Tabs>

                         <div className="mt-6 flex justify-end">
                            <Button type="submit" disabled={isLoading || isSaving}>
                                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Changes
                            </Button>
                        </div>
                    </div>
                </form>
            </FormProvider>
        </DashboardLayout>
    );
}
