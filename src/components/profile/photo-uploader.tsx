
"use client"

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { mockPhotoGallery } from "@/lib/photos";
import { Trash2, UploadCloud, GripVertical } from "lucide-react";
import { Badge } from "../ui/badge";

export function PhotoUploader() {
    const [photos, setPhotos] = useState(mockPhotoGallery);
    const [profilePic, setProfilePic] = useState(mockPhotoGallery.find(p => p.isProfilePic));

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Profile Picture</CardTitle>
                    <CardDescription>This is the first photo others will see. Drag and drop to upload a new image.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row gap-6 items-center">
                        {profilePic && (
                             <Image 
                                src={profilePic.url} 
                                alt="Profile picture" 
                                width={128} 
                                height={128} 
                                className="rounded-full object-cover aspect-square ring-4 ring-primary ring-offset-2" 
                            />
                        )}
                        <div className="flex-grow w-full">
                            <Label htmlFor="profile-picture-upload" className="block text-sm font-medium text-gray-700 mb-2">
                                Upload a new profile picture
                            </Label>
                            <Input id="profile-picture-upload" type="file" />
                            <p className="text-xs text-muted-foreground mt-2">.jpg, .jpeg, .png, .webp accepted. Max 5MB.</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Photo Gallery</CardTitle>
                    <CardDescription>Add up to 8 photos to your gallery. Drag to reorder.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {photos.map(photo => (
                            <Card key={photo.id} className="group relative aspect-square overflow-hidden">
                                <Image src={photo.url} alt={`Gallery photo ${photo.id}`} fill objectFit="cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                                   <div className="flex justify-between items-start">
                                       <Badge variant={photo.isProfilePic ? 'default' : 'secondary'}>{photo.isProfilePic ? 'Profile' : 'Gallery'}</Badge>
                                       <Button variant="destructive" size="icon" className="w-7 h-7">
                                            <Trash2 className="w-4 h-4"/>
                                       </Button>
                                   </div>
                                    <div className="text-right">
                                         <Button variant="ghost" size="icon" className="cursor-grab text-white w-7 h-7">
                                            <GripVertical className="w-4 h-4"/>
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                         <div className="aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-muted-foreground hover:bg-accent/50 cursor-pointer">
                            <UploadCloud className="w-10 h-10 mb-2"/>
                            <span className="text-sm text-center">Add Photo</span>
                            <Input type="file" className="sr-only" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
