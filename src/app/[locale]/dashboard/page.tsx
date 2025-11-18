
"use client"

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { MatchSuggestions } from "@/components/dashboard/match-suggestions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, ShieldCheck, UserCheck, Users, Heart, Loader2 } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/store/auth";
import api from "@/lib/api";
import { User, ApiProfile } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

const quickActions = [
    { label: "Edit Profile", icon: <Edit className="w-8 h-8"/>, href: "/profile/edit" },
    { label: "View Matches", icon: <Users className="w-8 h-8"/>, href: "/matches" },
    { label: "Interests Received", icon: <Heart className="w-8 h-8"/>, href: "/interests" },
    { label: "Verify Profile", icon: <ShieldCheck className="w-8 h-8"/>, href: "/verify" },
];

function ProfileCardSkeleton() {
    return (
        <Card className="md:w-auto w-full">
            <CardContent className="p-4 flex items-center gap-4">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-4 w-24" />
                </div>
            </CardContent>
        </Card>
    )
}

export default function DashboardPage() {
  const { user: authUser } = useAuthStore();
  const [profile, setProfile] = useState<ApiProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    async function fetchProfile() {
      if (!authUser) return;
      try {
        const response = await api.get('/profiles/me');
        setProfile(response.data.data);
      } catch (error) {
        console.error("Failed to fetch profile", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProfile();
  }, [authUser]);

  const user = authUser;
  const displayName = user?.name.split(' ')[0] || 'User';
  const profileImage = profile?.media.find(m => m.isProfilePicture)?.url || user?.profilePhoto;

  return (
    <DashboardLayout>
      <div className="space-y-6 p-4 sm:p-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between md:items-center">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold font-headline">Welcome, {displayName}!</h1>
                <p className="text-muted-foreground">Here&apos;s your daily matrimonial summary.</p>
            </div>
            {isLoading ? <ProfileCardSkeleton /> : (
                <Card className="md:w-auto w-full">
                    <CardContent className="p-4 flex items-center gap-4">
                        <Avatar className="h-12 w-12 sm:h-16 sm:w-16 border-2 border-primary">
                            <AvatarImage src={profileImage} alt={user?.name || ''} data-ai-hint="person photo" />
                            <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-bold">{user?.name}</p>
                            <p className="text-sm text-muted-foreground">{user?.email}</p>
                            {profile && <Link href={`/profile/${profile.userId}`}>
                                <Button variant="link" className="p-0 h-auto text-primary">View My Profile</Button>
                            </Link>}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {quickActions.map(action => (
                        <Link href={action.href} key={action.label}>
                            <Card className="text-center p-4 hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer">
                                <div className="flex justify-center mb-2 text-primary">{action.icon}</div>
                                <p className="font-semibold text-sm sm:text-base">{action.label}</p>
                            </Card>
                        </Link>
                    ))}
                </div>
            </CardContent>
        </Card>

        {/* The AI suggestions can be re-enabled once Genkit packages are restored */}
        {/* <MatchSuggestions /> */}
      </div>
    </DashboardLayout>
  );
}
