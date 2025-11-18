
'use client';

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, GraduationCap, MapPin, Trash } from "lucide-react";
import Link from "next/link";
import { useLocale } from "next-intl";

// This mock data should be replaced with an API call
const shortlistedProfiles = [
    {
        id: 'user123',
        userId: 'user123',
        avatar: 'https://picsum.photos/seed/shortlist1/400/400',
        avatarHint: 'person photo',
        name: { en: 'Priya Sharma', hi: 'प्रिया शर्मा', cg: 'प्रिया शर्मा' },
        age: 28,
        height: '165cm',
        location: { en: 'Bilaspur, CG', hi: 'बिलासपुर, छ.ग.', cg: 'बिलासपुर, छ.ग.' },
        education: { en: 'M.Sc. Chemistry', hi: 'एम.एससी. रसायन विज्ञान', cg: 'एम.एससी. रसायन विज्ञान' },
        occupation: { en: 'Research Analyst', hi: 'अनुसंधान विश्लेषक', cg: 'अनुसंधान विश्लेषक' }
    },
    {
        id: 'user456',
        userId: 'user456',
        avatar: 'https://picsum.photos/seed/shortlist2/400/400',
        avatarHint: 'person photo',
        name: { en: 'Sameer Gupta', hi: 'समीर गुप्ता', cg: 'समीर गुप्ता' },
        age: 31,
        height: '178cm',
        location: { en: 'Bhilai, CG', hi: 'भिलाई, छ.ग.', cg: 'भिलाई, छ.ग.' },
        education: { en: 'B.Tech Mechanical Engg.', hi: 'बी.टेक मैकेनिकल इंजीनियरिंग', cg: 'बी.टेक मैकेनिकल इंजीनियरिंग' },
        occupation: { en: 'Project Manager', hi: 'परियोजना प्रबंधक', cg: 'परियोजना प्रबंधक' }
    }
];

function ShortlistCard({ profile }: { profile: any }) {
    const locale = useLocale() as 'en' | 'hi' | 'cg';

    return (
        <Card className="overflow-hidden transition-all hover:shadow-lg">
            <CardHeader className="p-0">
                <div className="relative">
                    <Avatar className="w-full h-48 rounded-none">
                        <AvatarImage src={profile.avatar} alt={profile.name[locale]} className="object-cover" data-ai-hint={profile.avatarHint} />
                        <AvatarFallback className="rounded-none text-4xl">{profile.name[locale].charAt(0)}</AvatarFallback>
                    </Avatar>
                     <div className="absolute bottom-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent">
                        <CardTitle className="text-white text-xl">{profile.name[locale]}</CardTitle>
                        <p className="text-sm text-white/80">{profile.age} yrs, {profile.height}</p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-4 text-sm space-y-2">
                <div className="flex items-start gap-2 text-muted-foreground"><MapPin className="w-4 h-4 mt-0.5 shrink-0"/><span>{profile.location[locale]}</span></div>
                <div className="flex items-start gap-2 text-muted-foreground"><GraduationCap className="w-4 h-4 mt-0.5 shrink-0"/><span>{profile.education[locale]}</span></div>
                <div className="flex items-start gap-2 text-muted-foreground"><Briefcase className="w-4 h-4 mt-0.5 shrink-0"/><span>{profile.occupation[locale]}</span></div>
            </CardContent>
            <CardFooter className="p-4 pt-0 grid grid-cols-2 gap-2">
                <Button variant="outline" asChild>
                    <Link href={`/${locale}/profile/${profile.userId}`}>View Profile</Link>
                </Button>
                <Button variant="destructive">
                    <Trash className="w-4 h-4 mr-2"/>
                    Remove
                </Button>
            </CardFooter>
        </Card>
    )
}


export default function ShortlistPage() {
    // We'll just show the mock profiles as shortlisted for now
    
    const locale = useLocale();

    return (
        <DashboardLayout>
             <div className="p-4 sm:p-6">
                <h1 className="text-3xl font-bold font-headline mb-1">Your Shortlist</h1>
                <p className="text-muted-foreground mb-6">Profiles you have saved for later.</p>

                {shortlistedProfiles.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {shortlistedProfiles.map(profile => (
                            <ShortlistCard key={profile.id} profile={profile} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-muted-foreground">You haven&apos;t shortlisted any profiles yet.</p>
                    </div>
                )}

            </div>
        </DashboardLayout>
    )
}
