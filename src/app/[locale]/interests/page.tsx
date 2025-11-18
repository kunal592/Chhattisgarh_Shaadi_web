
"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Interest, MatchProfile } from "@/lib/types";
import api from "@/lib/api";
import { Briefcase, Check, GraduationCap, Loader2, MapPin, Send, X } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

function InterestCard({ interest }: { interest: Interest }) {
    const { toast } = useToast();
    const [isResponding, setIsResponding] = useState(false);
    const [response, setResponse] = useState(interest.status);

    const profile = interest.senderProfile;
    const profileImage = profile.media?.find(m => m.isProfilePicture)?.url || `https://picsum.photos/seed/${profile.id}/400/400`;
    
    const handleResponse = async (status: 'ACCEPTED' | 'DECLINED') => {
        setIsResponding(true);
        try {
            await api.post(`/matches/interest/${interest.id}/respond`, { status });
            toast({
                title: `Interest ${status.toLowerCase()}`,
                description: `You have ${status.toLowerCase()} the interest from ${profile.firstName}.`,
            });
            setResponse(status);
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: error.response?.data?.message || "There was a problem responding to the interest.",
            });
        } finally {
            setIsResponding(false);
        }
    };

    return (
        <Card className="overflow-hidden transition-all hover:shadow-lg">
            <CardHeader className="flex-row items-center gap-4 p-4">
                <Avatar className="w-16 h-16 border-2 border-primary/50">
                    <AvatarImage src={profileImage} alt={profile.firstName} className="object-cover" data-ai-hint="person photo"/>
                    <AvatarFallback>{profile.firstName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <CardTitle className="text-lg"><Link href={`/profile/${profile.userId}`}>{profile.firstName} {profile.lastName}</Link></CardTitle>
                    <p className="text-sm text-muted-foreground">Sent you an interest.</p>
                    {response !== 'PENDING' && <Badge variant={response === 'ACCEPTED' ? 'success' : 'destructive'} className="mt-1">{response}</Badge>}
                </div>
            </CardHeader>
            <CardContent className="p-4 text-sm">
                <p className="italic text-muted-foreground line-clamp-3">{profile.aboutMe || "This user has not written an about me section yet."}</p>
            </CardContent>
            <CardFooter className="p-4 pt-0">
                {response === 'PENDING' ? (
                    <div className="grid grid-cols-2 gap-2 w-full">
                         <Button variant="outline" onClick={() => handleResponse('DECLINED')} disabled={isResponding}>
                           {isResponding ? <Loader2 className="w-4 h-4 mr-2 animate-spin"/> : <X className="w-4 h-4 mr-2"/>}
                            Decline
                        </Button>
                        <Button onClick={() => handleResponse('ACCEPTED')} disabled={isResponding}>
                            {isResponding ? <Loader2 className="w-4 h-4 mr-2 animate-spin"/> : <Check className="w-4 h-4 mr-2"/>}
                            Accept
                        </Button>
                    </div>
                ) : (
                    <Button variant="secondary" disabled className="w-full">
                        Response Sent
                    </Button>
                )}
            </CardFooter>
        </Card>
    )
}

function InterestCardSkeleton() {
    return (
         <Card>
            <CardHeader className="flex-row items-center gap-4 p-4">
                <Skeleton className="w-16 h-16 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-24" />
                </div>
            </CardHeader>
             <CardContent className="p-4">
                 <Skeleton className="h-12 w-full" />
            </CardContent>
             <CardFooter className="p-4 pt-0">
                 <div className="grid grid-cols-2 gap-2 w-full">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>
            </CardFooter>
        </Card>
    )
}

export default function InterestsPage() {
    const [interests, setInterests] = useState<Interest[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchInterests() {
            try {
                const response = await api.get('/matches/interests/received');
                setInterests(response.data.data);
            } catch (error) {
                console.error("Failed to fetch interests", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchInterests();
    }, []);

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6">
        <h1 className="text-3xl font-bold font-headline mb-1">Interests Received</h1>
        <p className="text-muted-foreground mb-6">People who want to connect with you.</p>
        
        {isLoading ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => <InterestCardSkeleton key={i} />)}
            </div>
        ) : interests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {interests.map(interest => (
                    <InterestCard key={interest.id} interest={interest} />
                ))}
            </div>
        ) : (
            <div className="text-center py-20 border-2 border-dashed rounded-lg mt-8">
                <p className="text-xl font-semibold text-muted-foreground">No new interests yet.</p>
                <p className="text-muted-foreground">When someone sends you an interest, it will appear here.</p>
                <Button variant="default" asChild className="mt-4">
                    <Link href="/matches">View Matches</Link>
                </Button>
            </div>
        )}
      </div>
    </DashboardLayout>
  );
}
