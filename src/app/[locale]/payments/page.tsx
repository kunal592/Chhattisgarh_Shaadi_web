
"use client"

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/api";
import { Loader2 } from "lucide-react";

interface Plan {
    id: string;
    name: string;
    price: number;
    durationDays: number;
    description: string;
}

declare global {
    interface Window {
        Razorpay: any;
    }
}

export default function PaymentsPage() {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState<string | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const response = await api.get("/payments/plans");
                setPlans(response.data.data);
            } catch (error) {
                toast({ variant: "destructive", title: "Error", description: "Failed to load subscription plans." });
            } finally {
                setIsLoading(false);
            }
        };
        fetchPlans();

        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        }
    }, [toast]);

    const handlePayment = async (planId: string) => {
        setIsProcessing(planId);
        try {
            // 1. Create Order
            const orderResponse = await api.post("/payments/create-order", { planId });
            const { orderId, amount, currency } = orderResponse.data.data;

            // 2. Open Razorpay Checkout
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount,
                currency,
                name: "Kalyan",
                description: "Membership Plan",
                order_id: orderId,
                handler: async function (response: any) {
                    // 3. Verify Payment
                    try {
                        await api.post("/payments/verify", {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        });
                        toast({ title: "Payment Successful", description: "Your subscription has been activated." });
                    } catch (error) {
                        toast({ variant: "destructive", title: "Payment Failed", description: "Could not verify your payment." });
                    }
                },
                prefill: {
                    name: "Test User",
                    email: "test.user@example.com",
                    contact: "9999999999",
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "Could not initiate the payment process." });
        } finally {
            setIsProcessing(null);
        }
    }

    return (
        <DashboardLayout>
            <div className="p-4 sm:p-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Choose Your Plan</CardTitle>
                        <CardDescription>Unlock premium features and connect with more people.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {isLoading ? (
                            <div className="flex justify-center items-center h-64 col-span-full">
                                <Loader2 className="w-12 h-12 animate-spin text-primary" />
                            </div>
                        ) : (
                            plans.map(plan => (
                                <Card key={plan.id} className="flex flex-col">
                                    <CardHeader>
                                        <CardTitle>{plan.name}</CardTitle>
                                        <p className="text-3xl font-bold">₹{plan.price}</p>
                                        <p className="text-sm text-muted-foreground">for {plan.durationDays} days</p>
                                    </CardHeader>
                                    <CardContent className="flex-grow">
                                        <p>{plan.description}</p>
                                    </CardContent>
                                    <div className="p-6 pt-0">
                                        <Button 
                                            className="w-full" 
                                            onClick={() => handlePayment(plan.id)}
                                            disabled={isProcessing === plan.id}
                                        >
                                            {isProcessing === plan.id ? (
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            ) : null}
                                            Choose Plan
                                        </Button>
                                    </div>
                                </Card>
                            ))
                        )}
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
