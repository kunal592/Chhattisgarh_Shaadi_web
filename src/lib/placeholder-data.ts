
import { PlaceHolderImages } from './placeholder-images';
import { User } from './types';

const findImage = (id: string) => PlaceHolderImages.find(img => img.id === id)?.imageUrl || '';
const findImageHint = (id:string) => PlaceHolderImages.find(img => img.id === id)?.imageHint || '';

export const testimonials = [
  {
    name: 'Priya & Rohan',
    location: 'Raipur, CG',
    text: 'We found our perfect match on Chhattisgarh Bandhan. The platform is so easy to use and truly understands our culture. Highly recommended!',
    avatar: findImage('testimonial-2'),
    avatarHint: findImageHint('testimonial-2'),
  },
  {
    name: 'Anjali Sharma',
    location: 'Bilaspur, CG',
    text: 'Finding someone from my own community was very important to me. This app made it possible. Thank you to the team for creating such a wonderful service.',
    avatar: findImage('testimonial-1'),
    avatarHint: findImageHint('testimonial-1'),
  },
  {
    name: 'Vikram Singh',
    location: 'Durg, CG',
    text: 'I was skeptical about online matrimony, but Chhattisgarh Bandhan changed my mind. The profiles are genuine, and the AI suggestions were surprisingly accurate.',
    avatar: findImage('testimonial-3'),
    avatarHint: findImageHint('testimonial-3'),
  },
];

// This is now only used for the Admin panel Avatar and can be replaced later.
export const mockCurrentUser = {
  id: 'admin-user',
  name: 'Admin User',
  email: 'admin@example.com',
  avatar: findImage('user-avatar-4'),
  avatarHint: findImageHint('user-avatar-4'),
};


export const dashboardNavItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/matches', label: 'Matches' },
  { href: '/shortlist', label: 'Shortlisted' },
  { href: '/chat', label: 'Messages' },
  { href: '/premium', label: 'Premium' },
];

export const adminNavItems = [
    { href: '/admin', label: 'Overview' },
    { href: '/admin/analytics', label: 'Analytics' },
    { href: '/admin/users', label: 'Users' },
    { href: '/admin/profiles', label: 'Profiles' },
    { href: '/admin/agents', label: 'Agents' },
    { href: '/admin/reports', label: 'Reports' },
    { href: '/admin/subscriptions', label: 'Subscriptions' },
];

    