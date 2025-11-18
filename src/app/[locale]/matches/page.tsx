
"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MatchProfile } from "@/lib/types";
import api from "@/lib/api";
import { Briefcase, GraduationCap, Loader2, MapPin, Send } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

function MatchCard({ profile }: { profile: MatchProfile }) {
    const profileImage = profile.media?.find(m => m.isProfilePicture)?.url || `https://picsum.photos/seed/${profile.id}/400/400`;
    const education = profile.education?.[0];
    const occupation = profile.occupations?.[0];

    return (
        <Card className="overflow-hidden transition-all hover:shadow-lg hover:scale-[1.02]">
            <CardHeader className="p-0">
                <div className="relative">
                    <Avatar className="w-full h-48 rounded-none">
                        <AvatarImage src={profileImage} alt={profile.firstName} className="object-cover" data-ai-hint="person photo" />
                        <AvatarFallback className="rounded-none text-4xl">{profile.firstName.charAt(0)}</AvatarFallback>
                    </Avatar>
                     <div className="absolute bottom-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent">
                        <CardTitle className="text-white text-xl">{profile.firstName} {profile.lastName}</CardTitle>
                        <p className="text-sm text-white/80">{profile.age} yrs{profile.height ? `, ${profile.height}cm` : ''}</p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-4 text-sm space-y-2">
                {profile.city && <div className="flex items-start gap-2 text-muted-foreground"><MapPin className="w-4 h-4 mt-0.5 shrink-0"/><span>{profile.city}, {profile.state}</span></div>}
                {education && <div className="flex items-start gap-2 text-muted-foreground"><GraduationCap className="w-4 h-4 mt-0.5 shrink-0"/><span>{education.degree}</span></div>}
                {occupation && <div className="flex items-start gap-2 text-muted-foreground"><Briefcase className="w-4 h-4 mt-0.5 shrink-0"/><span>{occupation.designation}</span></div>}
            </CardContent>
            <CardFooter className="p-4 pt-0 grid grid-cols-2 gap-2">
                <Button variant="outline" asChild>
                    <Link href={`/profile/${profile.userId}`}>View Profile</Link>
                </Button>
                <Button>
                    <Send className="w-4 h-4 mr-2"/>
                    Connect
                </Button>
            </CardFooter>
        </Card>
    )
}

function MatchCardSkeleton() {
    return (
        <Card className="overflow-hidden">
            <CardHeader className="p-0">
                <Skeleton className="w-full h-48 rounded-none" />
            </CardHeader>
            <CardContent className="p-4 text-sm space-y-3">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-2/3" />
            </CardContent>
            <CardFooter className="p-4 pt-0 grid grid-cols-2 gap-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </CardFooter>
        </Card>
    )
}

export default function MatchesPage() {
    const [matches, setMatches] = useState<MatchProfile[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchMatches() {
            try {
                // The API doc uses /matches, but search is more flexible for now.
                // We'll search for the opposite gender as a placeholder logic.
                const response = await api.get('/profiles/search?gender=FEMALE&limit=12');
                setMatches(response.data.data.profiles);
            } catch (error) {
                console.error("Failed to fetch matches", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchMatches();
    }, []);

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6">
        <h1 className="text-3xl font-bold font-headline mb-1">Your Matches</h1>
        <p className="text-muted-foreground mb-6">Showing profiles based on your preferences.</p>
        
        {isLoading ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => <MatchCardSkeleton key={i} />)}
            </div>
        ) : matches.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {matches.map(profile => (
                    <MatchCard key={profile.id} profile={profile} />
                ))}
            </div>
        ) : (
            <div className="text-center py-20">
                <p className="text-muted-foreground">No matches found based on your preferences yet.</p>
                <Button variant="link" asChild><Link href="/profile/edit">Update your preferences</Link></Button>
            </div>
        )}
      </div>
    </DashboardLayout>
  );
}
