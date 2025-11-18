import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

const plans = [
    {
        name: "Basic",
        price: "Free",
        description: "Get started and find your match.",
        features: [
            "Create Profile",
            "Search & View Profiles",
            "Send limited interests",
        ],
        isCurrent: true,
    },
    {
        name: "Gold",
        price: "₹1,499",
        duration: "/ 3 months",
        description: "Unlock more features to connect.",
        features: [
            "All Basic features",
            "Send unlimited interests",
            "View contact details",
            "Chat with matches",
            "Profile highlighted",
        ],
        isPopular: true,
    },
    {
        name: "Diamond",
        price: "₹2,999",
        duration: "/ 6 months",
        description: "The complete matrimony experience.",
        features: [
            "All Gold features",
            "Priority customer support",
            "AI-powered horoscope matching",
            "Profile appears on top of searches",
        ],
    }
]

export default function PremiumPage() {
    return (
        <DashboardLayout>
            <div className="text-center max-w-3xl mx-auto">
                <h1 className="text-4xl font-bold font-headline">Upgrade Your Membership</h1>
                <p className="text-muted-foreground mt-2">Choose a plan that works for you and get one step closer to finding your perfect partner.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 max-w-6xl mx-auto">
                {plans.map(plan => (
                    <Card key={plan.name} className={`flex flex-col ${plan.isPopular ? 'border-primary ring-2 ring-primary shadow-lg' : ''}`}>
                        {plan.isPopular && <div className="text-center py-1 bg-primary text-primary-foreground font-semibold rounded-t-lg">Most Popular</div>}
                        <CardHeader className="text-center">
                            <CardTitle className="text-2xl">{plan.name}</CardTitle>
                            <p className="text-3xl font-bold">{plan.price} <span className="text-lg font-normal text-muted-foreground">{plan.duration}</span></p>
                            <CardDescription>{plan.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <ul className="space-y-3">
                                {plan.features.map(feature => (
                                    <li key={feature} className="flex items-center gap-2">
                                        <Check className="w-5 h-5 text-green-500" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" disabled={plan.isCurrent}>
                                {plan.isCurrent ? 'Current Plan' : 'Upgrade Now'}
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </DashboardLayout>
    );
}
