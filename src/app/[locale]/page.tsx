import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCircle, Users, Search, Heart } from "lucide-react";
import { AppStoreBadges } from "@/components/layout/app-store-badges";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { testimonials } from "@/lib/placeholder-data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import type { Testimonial } from "@/lib/types";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useTranslations } from "next-intl";

const heroImage = PlaceHolderImages.find(img => img.id === 'hero-banner');

export default function Home() {
  const t = useTranslations("HomePage");

  const features = [
    {
      icon: <CheckCircle className="h-6 w-6 text-accent" />,
      title: t("verifiedProfiles"),
      description: "Every profile is manually verified for authenticity and safety.",
    },
    {
      icon: <Users className="h-6 w-6 text-accent" />,
      title: t("languageSupport"),
      description: "Use the app in Hindi, English, or Chhattisgarhi.",
    },
    {
      icon: <Search className="h-6 w-6 text-accent" />,
      title: t("cgSpecificFilters"),
      description: "Find matches based on native district, tehsil, and more.",
    },
  ];

  const howItWorksSteps = [
    { title: t("register"), description: t("registerDescription"), icon: <Heart className="h-8 w-8" /> },
    { title: t("createProfile"), description: t("createProfileDescription"), icon: <Heart className="h-8 w-8" /> },
    { title: t("findMatches"), description: t("findMatchesDescription"), icon: <Heart className="h-8 w-8" /> },
    { title: t("connect"), description: t("connectDescription"), icon: <Heart className="h-8 w-8" /> },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[90vh] min-h-[600px] w-full">
          {heroImage && (
             <Image
              src={heroImage.imageUrl}
              alt="Hero Banner"
              fill
              className="object-cover"
              priority
              data-ai-hint={heroImage.imageHint}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white p-4">
            <h1 className="text-4xl font-headline font-bold drop-shadow-lg sm:text-5xl md:text-6xl text-primary">
              {t("title")}
            </h1>
            <p className="mt-4 max-w-2xl text-lg drop-shadow-md md:text-xl">
              {t("subtitle")}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-2 md:gap-4">
              {features.map((feature) => (
                <div key={feature.title} className="flex items-center gap-2 rounded-full bg-background/20 px-3 py-1.5 md:px-4 md:py-2 backdrop-blur-sm text-sm md:text-base">
                  {feature.icon}
                  <span className="font-medium text-background">{feature.title}</span>
                </div>
              ))}
            </div>
            <Button asChild size="lg" className="mt-10 animate-bounce">
              <Link href="/login">{t("findPartner")}</Link>
            </Button>
          </div>
        </section>

        {/* App Badges Section */}
        <section className="py-12 bg-secondary/50">
            <div className="container mx-auto px-4">
                <AppStoreBadges/>
            </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-16 md:py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold font-headline">{t("howItWorksTitle")}</h2>
            <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
              {t("howItWorksDescription")}
            </p>
            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              {howItWorksSteps.map((step, index) => (
                <Card key={step.title} className="text-center transition-transform hover:scale-105 hover:shadow-xl">
                  <CardHeader>
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                      {step.icon}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardTitle className="text-xl font-semibold">{index+1}. {step.title}</CardTitle>
                    <p className="mt-2 text-muted-foreground">{step.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-16 md:py-20 bg-secondary/50">
          <div className="container mx-auto px-4">
            <h2 className="text-center text-3xl font-bold font-headline">{t("successStoriesTitle")}</h2>
            <p className="mx-auto mt-2 max-w-2xl text-center text-muted-foreground">
              {t("successStoriesDescription")}
            </p>
            <Carousel
              opts={{
                align: "start",
              }}
              className="w-full max-w-sm sm:max-w-3xl lg:max-w-5xl mx-auto mt-12"
            >
              <CarouselContent>
                {testimonials.map((testimonial: Testimonial, index) => (
                  <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                    <div className="p-1 h-full">
                      <Card className="flex flex-col h-full transition-transform hover:scale-105 hover:shadow-xl">
                        <CardContent className="pt-6 flex-grow">
                          <p className="italic text-muted-foreground">&quot;{testimonial.text}&quot;</p>
                        </CardContent>
                        <CardFooter className="pt-4 mt-auto">
                          <div className="flex items-center gap-4">
                            <Avatar>
                              <AvatarImage src={testimonial.avatar} alt={testimonial.name} data-ai-hint={testimonial.avatarHint} />
                              <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold">{testimonial.name}</p>
                              <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                            </div>
                          </div>
                        </CardFooter>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
