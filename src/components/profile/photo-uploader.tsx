
"use client"

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, UploadCloud, GripVertical, Loader2 } from "lucide-react";
import { Badge } from "../ui/badge";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface Photo {
  id: string;
  url: string;
  isProfilePicture: boolean;
}

export function PhotoUploader() {
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        async function fetchPhotos() {
            try {
                const response = await api.get("/profiles/me/photos");
                setPhotos(response.data.data);
            } catch (error) {
                console.error("Failed to fetch photos", error);
                toast({ variant: "destructive", title: "Error", description: "Failed to load your photos." });
            } finally {
                setIsLoading(false);
            }
        }
        fetchPhotos();
    }, [toast]);

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        setIsUploading(true);
        try {
            const response = await api.post("/profiles/me/photos", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            setPhotos([...photos, response.data.data]);
            toast({ title: "Photo Uploaded", description: "Your new photo has been added to your gallery." });
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Upload Failed",
                description: error.response?.data?.message || "Could not upload your photo.",
            });
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async (photoId: string) => {
        try {
            await api.delete(`/profiles/me/photos/${photoId}`);
            setPhotos(photos.filter(p => p.id !== photoId));
            toast({ title: "Photo Deleted", description: "The photo has been removed from your gallery." });
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Deletion Failed",
                description: error.response?.data?.message || "Could not delete the photo.",
            });
        }
    };

    const setAsProfilePicture = async (photoId: string) => {
        try {
            await api.post(`/profiles/me/photos/${photoId}/set-profile-picture`);
            setPhotos(photos.map(p => ({ ...p, isProfilePicture: p.id === photoId })));
            toast({ title: "Profile Picture Updated", description: "Your new profile picture has been set." });
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Update Failed",
                description: error.response?.data?.message || "Could not set the profile picture.",
            });
        }
    };

    const profilePic = photos.find(p => p.isProfilePicture);

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Photo Gallery</CardTitle>
                    <CardDescription>Add up to 8 photos to your gallery. The first photo is your profile picture.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center items-center h-32">
                            <Loader2 className="w-8 h-8 animate-spin text-primary"/>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {photos.map(photo => (
                                <Card key={photo.id} className="group relative aspect-square overflow-hidden">
                                    <Image src={photo.url} alt={`Gallery photo`} fill objectFit="cover" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                                       <div className="flex justify-between items-start">
                                           <Badge variant={photo.isProfilePicture ? 'default' : 'secondary'}>{photo.isProfilePicture ? 'Profile' : 'Gallery'}</Badge>
                                           <Button variant="destructive" size="icon" className="w-7 h-7" onClick={() => handleDelete(photo.id)}>
                                                <Trash2 className="w-4 h-4"/>
                                           </Button>
                                       </div>
                                        <div>
                                            {!photo.isProfilePicture && (
                                                <Button size="sm" className="w-full" onClick={() => setAsProfilePicture(photo.id)}>
                                                    Set as Profile
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            ))}
                            {photos.length < 8 && (
                                <Label htmlFor="photo-upload" className="aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-muted-foreground hover:bg-accent/50 cursor-pointer">
                                    {isUploading ? (
                                        <Loader2 className="w-8 h-8 animate-spin"/>
                                    ) : (
                                        <>
                                            <UploadCloud className="w-10 h-10 mb-2"/>
                                            <span className="text-sm text-center">Add Photo</span>
                                        </>
                                    )}
                                    <Input id="photo-upload" type="file" className="sr-only" onChange={handleFileUpload} disabled={isUploading} />
                                </Label>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
