
"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import api from '@/lib/api';
import { ApiProfile } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Briefcase, Cake, Edit, GraduationCap, Heart, Home, MapPin, MessageCircle, Ruler, User, Weight, Send, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ProfileSkeleton = () => (
    <div className="p-4 sm:p-6 space-y-6">
        <Card>
            <CardContent className="p-6 flex flex-col md:flex-row items-center gap-6">
                <Skeleton className="w-32 h-32 rounded-full" />
                <div className="space-y-2 text-center md:text-left">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-5 w-64" />
                    <Skeleton className="h-5 w-32" />
                </div>
            </CardContent>
        </Card>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                <Card>
                    <CardHeader><CardTitle>About</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle>Details</CardTitle></CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                        {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-6 w-3/4" />)}
                    </CardContent>
                </Card>
            </div>
            <div className="space-y-6">
                <Card>
                    <CardHeader><CardTitle>Partner Preferences</CardTitle></CardHeader>
                    <CardContent className="space-y-2">
                         {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-5 w-full" />)}
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
);

export default function ProfilePage() {
    const params = useParams();
    const { id } = params;
    const { toast } = useToast();
    const [profile, setProfile] = useState<ApiProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchProfile() {
            if (!id) return;
            try {
                const response = await api.get(`/profiles/${id}`);
                setProfile(response.data.data);
            } catch (err: any) {
                console.error("Failed to fetch profile", err);
                setError(err.response?.data?.message || "This profile could not be loaded.");
            } finally {
                setIsLoading(false);
            }
        }
        fetchProfile();
    }, [id]);

    const handleSendInterest = async () => {
        if(!profile) return;
        try {
            await api.post(`/matches/interest/${profile.id}`);
            toast({ title: "Interest Sent!", description: `Your interest has been sent to ${profile.firstName}.` });
        } catch (err: any) {
             toast({ variant: "destructive", title: "Error", description: err.response?.data?.message || "Failed to send interest." });
        }
    }

    if (isLoading) {
        return <DashboardLayout><ProfileSkeleton /></DashboardLayout>;
    }

    if (error) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-full p-8">
                    <Alert variant="destructive" className="max-w-md">
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                </div>
            </DashboardLayout>
        );
    }

    if (!profile) {
        return (
            <DashboardLayout>
                 <div className="flex items-center justify-center h-full">
                     <p>Profile not found.</p>
                </div>
            </DashboardLayout>
        )
    }

    const profileImage = profile.media?.find(m => m.isProfilePicture)?.url || `https://picsum.photos/seed/${profile.id}/400/400`;

    return (
        <DashboardLayout>
            <div className="p-4 sm:p-6">
                {/* Header Card */}
                <Card className="mb-6 overflow-hidden">
                     <div className="relative h-40 bg-muted-foreground/20">
                         <img src={`https://source.unsplash.com/1600x480/?nature,water,${profile.religion}`} alt="Cover" className="h-full w-full object-cover"/>
                         <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                             <div className="flex items-end gap-4">
                                <Avatar className="w-24 h-24 border-4 border-background relative -bottom-8">
                                    <AvatarImage src={profileImage} alt={profile.firstName} data-ai-hint="person photo"/>
                                    <AvatarFallback>{profile.firstName.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h1 className="text-2xl font-bold text-white">{profile.firstName} {profile.lastName}</h1>
                                     <p className="text-sm text-white/90">{profile.occupations?.[0]?.designation || 'No occupation listed'}</p>
                                </div>
                            </div>
                         </div>
                     </div>
                     <div className="pt-12 px-6 pb-6 flex justify-between items-center">
                        <div className="flex gap-4">
                             <Button variant="outline" size="sm"><MessageCircle className="w-4 h-4 mr-2"/>Message</Button>
                             <Button onClick={handleSendInterest}><Send className="w-4 h-4 mr-2"/>Send Interest</Button>
                        </div>
                        {/* <Button variant="ghost" size="icon"><Edit className="w-4 h-4"/></Button> */}
                     </div>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader><CardTitle>About {profile.firstName}</CardTitle></CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{profile.aboutMe || "This user has not written an about me section yet."}</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
                            <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-y-4 text-sm">
                                <div className="flex items-center gap-2"><Cake className="w-4 h-4 text-muted-foreground"/> <span>{profile.age} years old</span></div>
                                <div className="flex items-center gap-2"><User className="w-4 h-4 text-muted-foreground"/> <span>{profile.gender}</span></div>
                                <div className="flex items-center gap-2"><Ruler className="w-4 h-4 text-muted-foreground"/> <span>{profile.height ? `${profile.height} cm` : 'N/A'}</span></div>
                                <div className="flex items-center gap-2"><Heart className="w-4 h-4 text-muted-foreground"/> <span>{profile.maritalStatus.replace("_", " ")}</span></div>
                                <div className="flex items-center gap-2"><Home className="w-4 h-4 text-muted-foreground"/> <span>From {profile.caste}, {profile.religion}</span></div>
                                <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-muted-foreground"/> <span>Lives in {profile.city}, {profile.state}</span></div>
                                 <div className="flex items-center gap-2"><Home className="w-4 h-4 text-muted-foreground"/> <span>Native: {profile.nativeDistrict}, {profile.nativeState}</span></div>
                            </CardContent>
                        </Card>
                         <Card>
                            <CardHeader><CardTitle>Education & Career</CardTitle></CardHeader>
                            <CardContent className="space-y-4 text-sm">
                                {profile.education.length > 0 ? profile.education.map((edu,i) => (
                                    <div key={i} className="flex items-start gap-4">
                                        <div className="mt-1"><GraduationCap className="w-5 h-5 text-muted-foreground"/></div>
                                        <div>
                                            <p className="font-semibold">{edu.degree}{edu.field && ` in ${edu.field}`}</p>
                                            <p className="text-muted-foreground">{edu.institution}</p>
                                        </div>
                                    </div>
                                )) : <p>No education details provided.</p>}

                                {profile.occupations.length > 0 ? profile.occupations.map((occ,i) => (
                                    <div key={i} className="flex items-start gap-4">
                                        <div className="mt-1"><Briefcase className="w-5 h-5 text-muted-foreground"/></div>
                                        <div>
                                            <p className="font-semibold">{occ.designation}</p>
                                            <p className="text-muted-foreground">{occ.companyName}</p>
                                        </div>
                                    </div>
                                )) : <p>No occupation details provided.</p>}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {profile.isVerified && 
                            <Alert variant="success">
                                <Check className="h-4 w-4" />
                                <AlertTitle>Verified Profile</AlertTitle>
                                <AlertDescription>
                                    This user has been verified by our team.
                                </AlertDescription>
                            </Alert>
                        }

                        <Card>
                            <CardHeader><CardTitle>Partner Preferences</CardTitle></CardHeader>
                            {profile.partnerPreference ?
                                <CardContent className="text-sm space-y-2">
                                    <div className="flex justify-between"><span className="text-muted-foreground">Age:</span> <strong>{profile.partnerPreference.ageFrom} - {profile.partnerPreference.ageTo}</strong></div>
                                    <div className="flex justify-between"><span className="text-muted-foreground">Height:</span> <strong>{profile.partnerPreference.heightFrom} - {profile.partnerPreference.heightTo} cm</strong></div>
                                    <div className="flex justify-between"><span className="text-muted-foreground">Religion:</span> <strong>{profile.partnerPreference.religion || "Any"}</strong></div>
                                    <div className="flex justify-between"><span className="text-muted-foreground">Caste:</span> <strong>{profile.partnerPreference.caste || "Any"}</strong></div>
                                    <p className="text-muted-foreground pt-2">{profile.partnerPreference.description}</p>
                                </CardContent>
                            : <CardContent><p className="text-sm text-muted-foreground">No preferences set.</p></CardContent>}
                        </Card>

                        <Card>
                            <CardHeader><CardTitle>Photos</CardTitle></CardHeader>
                            <CardContent className="grid grid-cols-3 gap-2">
                                {profile.media.map(m => (
                                    <div key={m.id} className="aspect-square bg-muted rounded-md overflow-hidden">
                                        <img src={m.thumbnailUrl || m.url} alt="Photo" className="w-full h-full object-cover"/>
                                    </div>
                                ))}
                                {profile.media.length === 0 && <p className="col-span-3 text-sm text-muted-foreground">No photos uploaded.</p>}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
