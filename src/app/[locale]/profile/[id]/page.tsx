
'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { PlaceHolderImages, ImagePlaceholder } from "@/lib/placeholder-images";
import { Briefcase, GraduationCap, Heart, MapPin, User, FileText, Star, Loader2 } from "lucide-react";
import Image from "next/image";
import api from '@/lib/api';
import { ApiProfile } from '@/lib/types';

const galleryImages = PlaceHolderImages.filter(img => img.id.startsWith('profile-gallery'));

function DetailSection({ title, children, icon }: { title: string; children: React.ReactNode, icon: React.ReactNode }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    {icon} {title}
                </CardTitle>
            </CardHeader>
            <CardContent>
                {children}
            </CardContent>
        </Card>
    )
}

function DetailItem({ label, value }: { label: string, value: React.ReactNode }) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center">
            <p className="w-full sm:w-1/3 text-muted-foreground">{label}</p>
            <p className="w-full sm:w-2/3 font-medium">{value || 'N/A'}</p>
        </div>
    )
}

function ProfileSkeleton() {
    return (
        <div className="space-y-6">
            <Card className="overflow-hidden">
                <Skeleton className="h-36 sm:h-48 w-full" />
                <CardContent className="p-4 relative">
                    <div className="flex flex-col sm:flex-row gap-4 sm:items-end -mt-16 sm:-mt-20">
                        <Skeleton className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-background" />
                        <div className="flex-grow space-y-2">
                            <Skeleton className="h-8 w-48" />
                            <Skeleton className="h-4 w-64" />
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                            <Skeleton className="h-10 w-36" />
                            <Skeleton className="h-10 w-28" />
                        </div>
                    </div>
                </CardContent>
            </Card>
            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <Card><CardHeader><Skeleton className="h-6 w-32" /></CardHeader><CardContent><Skeleton className="h-16 w-full" /></CardContent></Card>
                    <Card><CardHeader><Skeleton className="h-6 w-48" /></CardHeader><CardContent className="space-y-4"><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /></CardContent></Card>
                </div>
                <div className="space-y-6">
                    <Card><CardHeader><Skeleton className="h-6 w-24" /></CardHeader><CardContent className="space-y-4"><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /></CardContent></Card>
                </div>
            </div>
        </div>
    )
}

export default function ProfilePage({ params }: { params: { id: string } }) {
  const [profile, setProfile] = useState<ApiProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      if (!params.id) return;
      setIsLoading(true);
      try {
        // The API returns the profile based on the USER ID, not the profile ID.
        const response = await api.get(`/profiles/${params.id}`);
        setProfile(response.data.data);
      } catch (error) {
        console.error("Failed to fetch profile", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProfile();
  }, [params.id]);

  if (isLoading) {
    return (
        <DashboardLayout>
            <div className="p-4 sm:p-6"><ProfileSkeleton /></div>
        </DashboardLayout>
    );
  }

  if (!profile) {
     return (
        <DashboardLayout>
            <div className="p-4 sm:p-6 text-center">
                <p className="text-muted-foreground">Profile not found.</p>
            </div>
        </DashboardLayout>
    );
  }
  
  const profileImage = profile.media.find(m => m.isProfilePicture)?.url || `https://picsum.photos/seed/${profile.id}/300/300`;
  const location = [profile.city, profile.state, profile.country].filter(Boolean).join(', ');
  const education = profile.education[0];
  const occupation = profile.occupations[0];

  return (
    <DashboardLayout>
      <div className="space-y-6 p-4 sm:p-6">
        {/* Profile Header */}
        <Card className="overflow-hidden">
            <div className="relative h-36 sm:h-48 bg-secondary">
                 <Image src="https://picsum.photos/seed/cover/1200/300" alt="Cover photo" fill objectFit="cover" data-ai-hint="abstract pattern" />
                 <div className="absolute inset-0 bg-black/30"></div>
            </div>
            <CardContent className="p-4 relative">
                <div className="flex flex-col sm:flex-row gap-4 sm:items-end -mt-16 sm:-mt-20">
                     <Avatar className="w-24 h-24 sm:w-32 sm:h-32 border-4 border-background ring-2 ring-primary">
                        <AvatarImage src={profileImage} alt={profile.firstName} data-ai-hint="person photo" />
                        <AvatarFallback className="text-4xl">{profile.firstName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-grow">
                        <h1 className="text-2xl font-bold font-headline">{profile.firstName} {profile.lastName}</h1>
                        <p className="text-muted-foreground">{profile.age} yrs{profile.height ? `, ${profile.height}cm` : ''} • {location}</p>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <Button className="flex-1 sm:flex-auto"><Heart className="w-4 h-4 mr-2"/> Send Interest</Button>
                        <Button variant="outline" className="flex-1 sm:flex-auto">Shortlist</Button>
                    </div>
                </div>
            </CardContent>
        </Card>
        
        <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
                <DetailSection title="About" icon={<User className="w-5 h-5"/>}>
                   <p className="text-muted-foreground leading-relaxed">{profile.aboutMe || "No bio provided."}</p>
                </DetailSection>

                <DetailSection title="Professional & Education" icon={<Briefcase className="w-5 h-5"/>}>
                   <div className="space-y-3">
                     <DetailItem label="Education" value={education ? `${education.degree} in ${education.field}` : "N/A"} />
                     <DetailItem label="Occupation" value={occupation ? `${occupation.designation} at ${occupation.companyName}` : "N/A"} />
                   </div>
                </DetailSection>
                
                <DetailSection title="Location" icon={<MapPin className="w-5 h-5"/>}>
                   <div className="space-y-3">
                     <DetailItem label="Current Location" value={location} />
                     <DetailItem label="Native District" value={"Raipur, CG"} />
                   </div>
                </DetailSection>
                
                 <DetailSection title="Photo Gallery" icon={<Star className="w-5 h-5"/>}>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                       {profile.media.filter(p => !p.isProfilePicture).map((image: ApiMedia) => (
                           <Image key={image.id} src={image.url} alt="Gallery photo" width={200} height={200} className="rounded-lg object-cover aspect-square" data-ai-hint="person photo"/>
                       ))}
                       {profile.media.filter(p => !p.isProfilePicture).length === 0 && (
                           <p className="text-muted-foreground col-span-full">No gallery photos available.</p>
                       )}
                    </div>
                 </DetailSection>

            </div>
            <div className="space-y-6">
                <Card>
                    <CardHeader><CardTitle>Profile Completeness</CardTitle></CardHeader>
                    <CardContent className="text-center">
                        <Progress value={profile.profileCompleteness} className="mb-2"/>
                        <p className="text-lg font-bold text-accent">{profile.profileCompleteness}% Complete</p>
                        {profile.profileCompleteness < 70 && <p className="text-sm text-muted-foreground">Encourage them to complete their profile!</p>}
                    </CardContent>
                </Card>
                 <DetailSection title="Basic Details" icon={<FileText className="w-5 h-5"/>}>
                   <div className="space-y-3 text-sm">
                     <DetailItem label="Age" value={`${profile.age} years`} />
                     <DetailItem label="Height" value={profile.height ? `${profile.height} cm` : 'N/A'} />
                     <DetailItem label="Religion" value={profile.religion} />
                     <DetailItem label="Mother Tongue" value={profile.motherTongue} />
                     <DetailItem label="Marital Status" value={profile.maritalStatus} />
                   </div>
                </DetailSection>
            </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
