'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { Logo } from '../ui/logo';
import { Separator } from '../ui/separator';
import { GoogleLogin } from '@react-oauth/google';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/api';
import { useAuthStore } from '@/store/auth';
import { Loader2 } from 'lucide-react';


export function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const { setAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setIsLoading(true);
    try {
      const res = await api.post('/auth/google', {
        idToken: credentialResponse.credential,
      });

      const { accessToken, refreshToken, user, isNewUser } = res.data.data;

      setAuth({ accessToken, refreshToken, user });

      toast({
        title: 'Login Successful',
        description: `Welcome back, ${user.name}!`,
      });

      if (isNewUser) {
        router.push('/onboarding');
      } else {
        router.push('/dashboard');
      }

    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: error.response?.data?.message || 'An unexpected error occurred.',
      });
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    toast({
        variant: 'destructive',
        title: 'Google Sign-In Error',
        description: 'There was a problem signing in with Google. Please try again.',
      });
  };

  if (!clientId) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            <Card className="w-full max-w-sm shadow-2xl">
                <CardHeader>
                    <CardTitle>Configuration Error</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className='text-destructive'>Google Client ID is not configured. Please set the NEXT_PUBLIC_GOOGLE_CLIENT_ID environment variable.</p>
                </CardContent>
            </Card>
        </div>
      )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
    <Card className="w-full max-w-sm shadow-2xl">
        <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
                <Logo />
            </div>
        <CardTitle className="text-2xl font-headline">Welcome Back</CardTitle>
        <CardDescription>
            Sign in to find your perfect match in Chhattisgarh.
        </CardDescription>
        </CardHeader>
        <CardContent>
        <div className="grid gap-4">
            {isLoading ? (
                <div className="flex justify-center items-center h-10">
                    <Loader2 className="animate-spin" />
                </div>
            ) : (
               <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    useOneTap
                    width="364"
                />
            )}
            
            <Separator />
        
            <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{' '}
            <a href="/terms" className="underline underline-offset-4 hover:text-primary">
                Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="underline underline-offset-4 hover:text-primary">
                Privacy Policy
            </a>
            .
            </p>
        </div>
        </CardContent>
    </Card>
    </div>
  );
}
