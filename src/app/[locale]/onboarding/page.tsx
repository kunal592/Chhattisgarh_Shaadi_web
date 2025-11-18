
"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, ArrowRight, Loader2, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/ui/logo";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";

const profileSchema = z.object({
  // Profile Fields
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  dateOfBirth: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid date"),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]),
  maritalStatus: z.enum(["NEVER_MARRIED", "DIVORCED", "WIDOWED", "AWAITING_DIVORCE", "ANNULLED"]),
  height: z.coerce.number().min(100, "Height must be in cm").max(250),
  weight: z.coerce.number().min(30).max(200),
  complexion: z.string().optional(),
  bodyType: z.string().optional(),
  physicalDisability: z.string().optional(),
  religion: z.enum(["HINDU", "MUSLIM", "CHRISTIAN", "SIKH", "OTHER"]),
  caste: z.string().min(2, "Caste is required"),
  subCaste: z.string().optional(),
  motherTongue: z.enum(["CHHATTISGARHI", "HINDI", "ENGLISH", "OTHER"]),
  nativeState: z.string().default("CHHATTISGARH"),
  nativeDistrict: z.string().min(2, "Native district is required"),
  nativeTehsil: z.string().optional(),
  nativeVillage: z.string().optional(),
  speaksChhattisgarhi: z.boolean().default(true),
  eatingHabits: z.string().optional(),
  drinkingHabit: z.string().optional(),
  smokingHabit: z.string().optional(),
  highestEducation: z.string().min(2, "Highest education is required."),
  educationDetails: z.string().min(2, "Education field is required."),
  collegeName: z.string().optional(),
  occupation: z.string().min(2, "Occupation is required."),
  occupationType: z.string().optional(),
  annualIncome: z.string().optional(),
  aboutMe: z.string().min(50, "Please write at least 50 characters about yourself."),
  fatherName: z.string().optional(),
  fatherOccupation: z.string().optional(),
  motherName: z.string().optional(),
  motherOccupation: z.string().optional(),
  numberOfBrothers: z.coerce.number().optional(),
  numberOfSisters: z.coerce.number().optional(),
  familyType: z.string().optional(),
  familyValues: z.string().optional(),
  familyStatus: z.string().optional(),

  // Horoscope Fields
  manglik: z.enum(["YES", "NO", "DONT_KNOW"]).optional(),
  birthTime: z.string().optional(),
  birthPlace: z.string().optional(),
  rashi: z.string().optional(),
  nakshatra: z.string().optional(),

  // Partner Preference Fields
  partnerAgeFrom: z.coerce.number().optional(),
  partnerAgeTo: z.coerce.number().optional(),
  partnerHeightFrom: z.coerce.number().optional(),
  partnerHeightTo: z.coerce.number().optional(),
  partnerReligion: z.string().optional(),
  partnerCaste: z.string().optional(),
  partnerMaritalStatus: z.string().optional(),
  partnerEducation: z.string().optional(),
  partnerOccupation: z.string().optional(),
  partnerDiet: z.string().optional(),
  partnerDescription: z.string().optional(),
});

const steps = [
  { id: 'basic', title: 'Basic Information', fields: ['firstName', 'lastName', 'dateOfBirth', 'gender', 'maritalStatus'] },
  { id: 'photo', title: 'Profile Photo', fields: [] },
  { id: 'physical', title: 'Physical Attributes', fields: ['height', 'weight', 'complexion', 'bodyType', 'physicalDisability'] },
  { id: 'religion', title: 'Religion & Community', fields: ['religion', 'caste', 'subCaste', 'motherTongue'] },
  { id: 'location', title: 'Native Location', fields: ['nativeState', 'nativeDistrict', 'nativeTehsil', 'nativeVillage', 'speaksChhattisgarhi']},
  { id: 'lifestyle', title: 'Lifestyle', fields: ['eatingHabits', 'drinkingHabit', 'smokingHabit'] },
  { id: 'education', title: 'Education', fields: ['highestEducation', 'educationDetails', 'collegeName'] },
  { id: 'occupation', title: 'Occupation', fields: ['occupation', 'occupationType', 'annualIncome'] },
  { id: 'family', title: 'Family Details', fields: ['fatherName', 'fatherOccupation', 'motherName', 'motherOccupation', 'numberOfBrothers', 'numberOfSisters', 'familyType', 'familyValues', 'familyStatus']},
  { id: 'horoscope', title: 'Horoscope Details', fields: ['manglik', 'birthTime', 'birthPlace', 'rashi', 'nakshatra']},
  { id: 'about', title: 'About Yourself', fields: ['aboutMe'] },
  { id: 'preferences', title: 'Partner Preferences', fields: ['partnerAgeFrom', 'partnerAgeTo', 'partnerHeightFrom', 'partnerHeightTo', 'partnerReligion', 'partnerCaste', 'partnerMaritalStatus', 'partnerEducation', 'partnerOccupation', 'partnerDiet', 'partnerDescription'] },
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const methods = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      nativeState: "CHHATTISGARH",
      speaksChhattisgarhi: true
    }
  });

  const { handleSubmit, trigger } = methods;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleNext = async () => {
    const fields = steps[currentStep].fields;
    const output = await trigger(fields as any, { shouldFocus: true });

    if (!output) return;

    if (currentStep === 1 && !photoFile) {
        toast({
            variant: "destructive",
            title: "Photo Required",
            description: "Please upload a profile photo to continue.",
        });
        return;
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      await handleSubmit(onSubmit)();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const onSubmit = async (data: z.infer<typeof profileSchema>) => {
    setIsLoading(true);

    if (!photoFile) {
        toast({
            variant: "destructive",
            title: "Photo Required",
            description: "Please upload a profile photo.",
        });
        setIsLoading(false);
        return;
    }

    try {
        // 1. Upload Photo
        const formData = new FormData();
        formData.append('photo', photoFile);

        const photoRes = await api.post('/uploads/profile-photo', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        // 2. Create Profile
        const payload = {
            ...data,
            physicalStatus: data.physicalDisability ? 'HAS_DISABILITY' : 'NORMAL',
            drinkingHabits: data.drinkingHabit,
            smokingHabits: data.smokingHabit,
            // The photo is linked on the backend, no need to send media IDs
        };
        
        await api.post('/profiles', payload);
        toast({
            title: "Profile Created!",
            description: "Welcome to Chhattisgarh Shaadi. Let's find your match.",
        });
        router.push('/dashboard');
    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Something went wrong",
            description: error.response?.data?.message || "Could not create your profile. Please try again."
        });
    } finally {
        setIsLoading(false);
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-secondary/30 p-4">
      <div className="absolute top-4 left-4">
        <Logo />
      </div>
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader>
          <Progress value={progress} className="mb-4" />
          <CardTitle className="text-2xl font-headline">{steps[currentStep].title}</CardTitle>
          <CardDescription>Step {currentStep + 1} of {steps.length} - Let&apos;s build your profile.</CardDescription>
        </CardHeader>
        <CardContent>
          <FormProvider {...methods}>
            <form onSubmit={(e) => e.preventDefault()} className="min-h-[300px] space-y-4">
              {currentStep === 0 && ( // Basic Info
                <>
                  <FormField control={methods.control} name="firstName" render={({ field }) => (
                    <FormItem><FormLabel>First Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={methods.control} name="lastName" render={({ field }) => (
                    <FormItem><FormLabel>Last Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={methods.control} name="dateOfBirth" render={({ field }) => (
                    <FormItem><FormLabel>Date of Birth</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={methods.control} name="gender" render={({ field }) => (
                    <FormItem><FormLabel>Gender</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger></FormControl><SelectContent>
                      <SelectItem value="MALE">Male</SelectItem><SelectItem value="FEMALE">Female</SelectItem><SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent></Select><FormMessage /></FormItem>
                  )} />
                   <FormField control={methods.control} name="maritalStatus" render={({ field }) => (
                    <FormItem><FormLabel>Marital Status</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select marital status" /></SelectTrigger></FormControl><SelectContent>
                      <SelectItem value="NEVER_MARRIED">Never Married</SelectItem><SelectItem value="DIVORCED">Divorced</SelectItem><SelectItem value="WIDOWED">Widowed</SelectItem><SelectItem value="AWAITING_DIVORCE">Awaiting Divorce</SelectItem><SelectItem value="ANNULLED">Annulled</SelectItem>
                    </SelectContent></Select><FormMessage /></FormItem>
                  )} />
                </>
              )}
               {currentStep === 1 && ( // Photo Upload
                <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="w-48 h-48 rounded-full border-2 border-dashed flex items-center justify-center bg-muted/30 relative">
                        {photoPreview ? (
                            <Image src={photoPreview} alt="Profile Preview" layout="fill" objectFit="cover" className="rounded-full" />
                        ) : (
                            <div className="text-center">
                                <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground mt-2">Click to upload</p>
                            </div>
                        )}
                    </div>
                    <FormItem>
                        <FormControl>
                            <Input type="file" accept="image/png, image/jpeg, image/jpg" className="hidden" id="photo-upload" onChange={handleFileChange} />
                        </FormControl>
                        <Button asChild variant="outline">
                            <label htmlFor="photo-upload">
                                {photoFile ? 'Change Photo' : 'Select Photo'}
                            </label>
                        </Button>
                        <FormMessage />
                    </FormItem>
                    <p className="text-xs text-muted-foreground">PNG, JPG, JPEG up to 5MB.</p>
                </div>
              )}
              {currentStep === 2 && ( // Physical Attributes
                 <>
                   <FormField control={methods.control} name="height" render={({ field }) => (
                    <FormItem><FormLabel>Height (in cm)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                   <FormField control={methods.control} name="weight" render={({ field }) => (
                    <FormItem><FormLabel>Weight (in kg)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={methods.control} name="complexion" render={({ field }) => (
                    <FormItem><FormLabel>Complexion (Optional)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={methods.control} name="bodyType" render={({ field }) => (
                    <FormItem><FormLabel>Body Type (Optional)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                   <FormField control={methods.control} name="physicalDisability" render={({ field }) => (
                    <FormItem><FormLabel>Physical Status (leave blank if none)</FormLabel><FormControl><Input placeholder="e.g., Normal" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </>
              )}
              {currentStep === 3 && ( // Religion & Community
                 <>
                  <FormField control={methods.control} name="religion" render={({ field }) => (
                    <FormItem><FormLabel>Religion</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select religion" /></SelectTrigger></FormControl><SelectContent>
                      <SelectItem value="HINDU">Hindu</SelectItem><SelectItem value="MUSLIM">Muslim</SelectItem><SelectItem value="CHRISTIAN">Christian</SelectItem><SelectItem value="SIKH">Sikh</SelectItem><SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent></Select><FormMessage /></FormItem>
                  )} />
                  <FormField control={methods.control} name="caste" render={({ field }) => (
                    <FormItem><FormLabel>Caste</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                   <FormField control={methods.control} name="subCaste" render={({ field }) => (
                    <FormItem><FormLabel>Sub-caste (Optional)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                   <FormField control={methods.control} name="motherTongue" render={({ field }) => (
                    <FormItem><FormLabel>Mother Tongue</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select mother tongue" /></SelectTrigger></FormControl><SelectContent>
                      <SelectItem value="CHHATTISGARHI">Chhattisgarhi</SelectItem><SelectItem value="HINDI">Hindi</SelectItem><SelectItem value="ENGLISH">English</SelectItem><SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent></Select><FormMessage /></FormItem>
                  )} />
                 </>
              )}
               {currentStep === 4 && ( // Location
                 <>
                  <FormField control={methods.control} name="nativeState" render={({ field }) => (
                    <FormItem><FormLabel>Native State</FormLabel><FormControl><Input {...field} disabled /></FormControl><FormMessage /></FormItem>
                  )} />
                   <FormField control={methods.control} name="nativeDistrict" render={({ field }) => (
                    <FormItem><FormLabel>Native District</FormLabel><FormControl><Input {...field} placeholder="e.g., Raipur" /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={methods.control} name="nativeTehsil" render={({ field }) => (
                    <FormItem><FormLabel>Native Tehsil (Optional)</FormLabel><FormControl><Input {...field} placeholder="e.g., Tilda" /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={methods.control} name="nativeVillage" render={({ field }) => (
                    <FormItem><FormLabel>Native Village (Optional)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                   <FormField control={methods.control} name="speaksChhattisgarhi" render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                        <div className="space-y-1 leading-none"><FormLabel>Do you speak Chhattisgarhi?</FormLabel></div>
                      </FormItem>
                    )} />
                 </>
              )}
              {currentStep === 5 && ( // Lifestyle
                 <>
                   <FormField control={methods.control} name="eatingHabits" render={({ field }) => (
                    <FormItem><FormLabel>Eating Habits (Optional)</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select eating habits" /></SelectTrigger></FormControl><SelectContent>
                        <SelectItem value="VEGETARIAN">Vegetarian</SelectItem><SelectItem value="NON_VEGETARIAN">Non-Vegetarian</SelectItem><SelectItem value="EGGETARIAN">Eggetarian</SelectItem><SelectItem value="VEGAN">Vegan</SelectItem>
                    </SelectContent></Select><FormMessage /></FormItem>
                  )} />
                   <FormField control={methods.control} name="drinkingHabit" render={({ field }) => (
                    <FormItem><FormLabel>Drinking Habits (Optional)</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select drinking habits" /></SelectTrigger></FormControl><SelectContent>
                        <SelectItem value="NO">No</SelectItem><SelectItem value="SOCIALLY">Socially</SelectItem><SelectItem value="YES">Yes</SelectItem>
                    </SelectContent></Select><FormMessage /></FormItem>
                  )} />
                   <FormField control={methods.control} name="smokingHabit" render={({ field }) => (
                    <FormItem><FormLabel>Smoking Habits (Optional)</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select smoking habits" /></SelectTrigger></FormControl><SelectContent>
                        <SelectItem value="NO">No</SelectItem><SelectItem value="OCCASIONALLY">Occasionally</SelectItem><SelectItem value="YES">Yes</SelectItem>
                    </SelectContent></Select><FormMessage /></FormItem>
                  )} />
                 </>
              )}
              {currentStep === 6 && ( // Education
                <>
                  <FormField control={methods.control} name="highestEducation" render={({ field }) => (
                    <FormItem><FormLabel>Highest Education</FormLabel><FormControl><Input {...field} placeholder="e.g., Bachelor's Degree" /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={methods.control} name="educationDetails" render={({ field }) => (
                    <FormItem><FormLabel>Education Field/Details</FormLabel><FormControl><Input {...field} placeholder="e.g., Computer Science" /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={methods.control} name="collegeName" render={({ field }) => (
                    <FormItem><FormLabel>College/University (Optional)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </>
              )}
              {currentStep === 7 && ( // Occupation
                <>
                  <FormField control={methods.control} name="occupation" render={({ field }) => (
                    <FormItem><FormLabel>Occupation</FormLabel><FormControl><Input {...field} placeholder="e.g., Software Engineer" /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={methods.control} name="occupationType" render={({ field }) => (
                     <FormItem><FormLabel>Occupation Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select occupation type" /></SelectTrigger></FormControl><SelectContent>
                        <SelectItem value="SALARIED">Salaried</SelectItem><SelectItem value="BUSINESS">Business</SelectItem><SelectItem value="PROFESSIONAL">Professional</SelectItem><SelectItem value="SELF_EMPLOYED">Self-Employed</SelectItem><SelectItem value="NOT_WORKING">Not Working</SelectItem>
                    </SelectContent></Select><FormMessage /></FormItem>
                  )} />
                  <FormField control={methods.control} name="annualIncome" render={({ field }) => (
                    <FormItem><FormLabel>Annual Income (Optional)</FormLabel><FormControl><Input {...field} placeholder="e.g., 10 LPA" /></FormControl><FormMessage /></FormItem>
                  )} />
                </>
              )}
               {currentStep === 8 && ( // Family
                 <>
                  <FormField control={methods.control} name="fatherName" render={({ field }) => (
                    <FormItem><FormLabel>Father&apos;s Name (Optional)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                   <FormField control={methods.control} name="fatherOccupation" render={({ field }) => (
                    <FormItem><FormLabel>Father&apos;s Occupation (Optional)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                   <FormField control={methods.control} name="motherName" render={({ field }) => (
                    <FormItem><FormLabel>Mother&apos;s Name (Optional)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                   <FormField control={methods.control} name="motherOccupation" render={({ field }) => (
                    <FormItem><FormLabel>Mother&apos;s Occupation (Optional)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                   <FormField control={methods.control} name="numberOfBrothers" render={({ field }) => (
                    <FormItem><FormLabel>Number of Brothers (Optional)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                   <FormField control={methods.control} name="numberOfSisters" render={({ field }) => (
                    <FormItem><FormLabel>Number of Sisters (Optional)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                 </>
              )}
               {currentStep === 9 && ( // Horoscope
                <>
                  <FormField control={methods.control} name="manglik" render={({ field }) => (
                    <FormItem><FormLabel>Are you Manglik?</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select an option" /></SelectTrigger></FormControl><SelectContent>
                      <SelectItem value="YES">Yes</SelectItem><SelectItem value="NO">No</SelectItem><SelectItem value="DONT_KNOW">Don&apos;t Know</SelectItem>
                    </SelectContent></Select><FormMessage /></FormItem>
                  )} />
                   <FormField control={methods.control} name="birthTime" render={({ field }) => (
                    <FormItem><FormLabel>Time of Birth (Optional)</FormLabel><FormControl><Input type="time" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                   <FormField control={methods.control} name="birthPlace" render={({ field }) => (
                    <FormItem><FormLabel>Place of Birth (Optional)</FormLabel><FormControl><Input {...field} placeholder="e.g., Raipur, CG" /></FormControl><FormMessage /></FormItem>
                  )} />
                   <FormField control={methods.control} name="rashi" render={({ field }) => (
                    <FormItem><FormLabel>Rashi (Zodiac Sign) (Optional)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                   <FormField control={methods.control} name="nakshatra" render={({ field }) => (
                    <FormItem><FormLabel>Nakshatra (Optional)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </>
              )}
               {currentStep === 10 && ( // About
                 <>
                   <FormField control={methods.control} name="aboutMe" render={({ field }) => (
                    <FormItem><FormLabel>About Yourself</FormLabel><FormControl><Textarea {...field} rows={8} placeholder="Tell us about your personality, hobbies, and interests..." /></FormControl><FormMessage /></FormItem>
                  )} />
                 </>
              )}
              {currentStep === 11 && ( // Partner Preferences
                 <>
                  <div className="grid grid-cols-2 gap-4">
                     <FormField control={methods.control} name="partnerAgeFrom" render={({ field }) => (
                      <FormItem><FormLabel>Age From</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                     <FormField control={methods.control} name="partnerAgeTo" render={({ field }) => (
                      <FormItem><FormLabel>Age To</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                   <div className="grid grid-cols-2 gap-4">
                     <FormField control={methods.control} name="partnerHeightFrom" render={({ field }) => (
                      <FormItem><FormLabel>Height From (cm)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                     <FormField control={methods.control} name="partnerHeightTo" render={({ field }) => (
                      <FormItem><FormLabel>Height To (cm)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                   <FormField control={methods.control} name="partnerReligion" render={({ field }) => (
                    <FormItem><FormLabel>Religion</FormLabel><FormControl><Input {...field} placeholder="e.g., Hindu" /></FormControl><FormMessage /></FormItem>
                  )} />
                   <FormField control={methods.control} name="partnerCaste" render={({ field }) => (
                    <FormItem><FormLabel>Caste</FormLabel><FormControl><Input {...field} placeholder="e.g., Sahu, Kurmi" /></FormControl><FormMessage /></FormItem>
                  )} />
                   <FormField control={methods.control} name="partnerMaritalStatus" render={({ field }) => (
                    <FormItem><FormLabel>Marital Status</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Any" /></SelectTrigger></FormControl><SelectContent>
                      <SelectItem value="NEVER_MARRIED">Never Married</SelectItem><SelectItem value="DIVORCED">Divorced</SelectItem><SelectItem value="WIDOWED">Widowed</SelectItem>
                    </SelectContent></Select><FormMessage /></FormItem>
                  )} />
                   <FormField control={methods.control} name="partnerDescription" render={({ field }) => (
                    <FormItem><FormLabel>More about your ideal partner</FormLabel><FormControl><Textarea {...field} rows={4} placeholder="Describe their personality, values, etc." /></FormControl><FormMessage /></FormItem>
                  )} />
                 </>
              )}
            </form>
          </FormProvider>
          <div className="mt-8 flex justify-between">
            <Button variant="outline" onClick={handleBack} disabled={currentStep === 0 || isLoading}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <Button onClick={handleNext} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {currentStep === steps.length - 1 ? "Finish & Create Profile" : "Next"}
              {currentStep < steps.length - 1 && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
