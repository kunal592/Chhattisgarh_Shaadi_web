
"use client"

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Check, X } from "lucide-react";

interface Interest {
  id: string;
  status: string;
  sender: {
    id: string;
    firstName: string;
    age: number;
    city: string;
    media: { url: string }[];
  };
}

export default function InterestsPage() {
  const [interests, setInterests] = useState<Interest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isResponding, setIsResponding] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchInterests() {
      try {
        const response = await api.get("/interests");
        setInterests(response.data.data);
      } catch (error) {
        console.error("Failed to fetch interests", error);
        toast({ variant: "destructive", title: "Error", description: "Failed to load your interests." });
      } finally {
        setIsLoading(false);
      }
    }
    fetchInterests();
  }, [toast]);

  const respondToInterest = async (interestId: string, status: "ACCEPTED" | "DECLINED") => {
    setIsResponding(interestId);
    try {
      await api.put(`/interests/${interestId}/respond`, { status });
      setInterests(interests.map(i => i.id === interestId ? { ...i, status } : i));
      toast({ title: `Interest ${status.toLowerCase()}`, description: `You have ${status.toLowerCase()} the interest.` });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to Respond",
        description: error.response?.data?.message || "Could not respond to the interest.",
      });
    } finally {
      setIsResponding(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6">
        <Card>
          <CardHeader>
            <CardTitle>Interests Received</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {interests.map((interest) => (
                  <Card key={interest.id} className="overflow-hidden">
                    <div className="relative aspect-[3/4]">
                      <Image
                        src={interest.sender.media[0]?.url || "/placeholder.png"}
                        alt={interest.sender.firstName}
                        fill
                        objectFit="cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold">{interest.sender.firstName}, {interest.sender.age}</h3>
                      <p className="text-sm text-muted-foreground">{interest.sender.city}</p>
                      {interest.status === 'PENDING' ? (
                        <div className="flex gap-2 mt-4">
                          <Button 
                            size="sm" 
                            className="w-full" 
                            onClick={() => respondToInterest(interest.id, "ACCEPTED")}
                            disabled={isResponding === interest.id}
                          >
                            {isResponding === interest.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
                            Accept
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="w-full" 
                            onClick={() => respondToInterest(interest.id, "DECLINED")}
                            disabled={isResponding === interest.id}
                          >
                            {isResponding === interest.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <X className="mr-2 h-4 w-4" />}
                            Decline
                          </Button>
                        </div>
                      ) : (
                        <p className="mt-4 text-sm font-semibold text-muted-foreground">You have already responded to this interest.</p>
                      )}
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
