
import { PlaceHolderImages } from './placeholder-images';

const findImage = (id: string) => PlaceHolderImages.find(img => img.id === id)?.imageUrl || '';

export const mockPhotoGallery = [
    { id: 1, url: findImage('user-avatar-3'), isProfilePic: true },
    { id: 2, url: findImage('profile-gallery-1'), isProfilePic: false },
    { id: 3, url: findImage('profile-gallery-2'), isProfilePic: false },
    { id: 4, url: findImage('profile-gallery-3'), isProfilePic: false },
];
