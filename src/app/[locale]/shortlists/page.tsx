
"use client"

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Trash2 } from "lucide-react";

interface Shortlist {
  id: string;
  profile: {
    id: string;
    firstName: string;
    age: number;
    city: string;
    media: { url: string }[];
  };
}

export default function ShortlistsPage() {
  const [shortlists, setShortlists] = useState<Shortlist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRemoving, setIsRemoving] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchShortlists() {
      try {
        const response = await api.get("/shortlists");
        setShortlists(response.data.data);
      } catch (error) {
        console.error("Failed to fetch shortlists", error);
        toast({ variant: "destructive", title: "Error", description: "Failed to load your shortlists." });
      } finally {
        setIsLoading(false);
      }
    }
    fetchShortlists();
  }, [toast]);

  const removeFromShortlist = async (userId: string) => {
    setIsRemoving(userId);
    try {
      await api.delete(`/shortlists/${userId}`);
      setShortlists(shortlists.filter(s => s.profile.id !== userId));
      toast({ title: "Removed from Shortlist", description: "The profile has been removed from your shortlist." });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to Remove",
        description: error.response?.data?.message || "Could not remove the profile from your shortlist.",
      });
    } finally {
      setIsRemoving(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6">
        <Card>
          <CardHeader>
            <CardTitle>Your Shortlisted Profiles</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {shortlists.map((shortlist) => (
                  <Card key={shortlist.id} className="overflow-hidden">
                    <div className="relative aspect-[3/4]">
                      <Image
                        src={shortlist.profile.media[0]?.url || "/placeholder.png"}
                        alt={shortlist.profile.firstName}
                        fill
                        objectFit="cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold">{shortlist.profile.firstName}, {shortlist.profile.age}</h3>
                      <p className="text-sm text-muted-foreground">{shortlist.profile.city}</p>
                      <Button 
                        className="w-full mt-4" 
                        variant="outline" 
                        onClick={() => removeFromShortlist(shortlist.profile.id)}
                        disabled={isRemoving === shortlist.profile.id}
                      >
                        {isRemoving === shortlist.profile.id ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="mr-2 h-4 w-4" />
                        )}
                        Remove
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
