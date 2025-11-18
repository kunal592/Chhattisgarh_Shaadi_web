"use client"

import { AdminPageWrapper } from "@/app/admin/admin-page-wrapper";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { DollarSign, Users, ShoppingCart } from "lucide-react";

const revenueData = [
  { month: 'Jan', revenue: 12000 },
  { month: 'Feb', revenue: 18000 },
  { month: 'Mar', revenue: 15000 },
  { month: 'Apr', revenue: 22000 },
  { month: 'May', revenue: 25000 },
  { month: 'Jun', revenue: 30000 },
]

const revenueChartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

const signupsData = [
    { district: 'Raipur', users: 450 },
    { district: 'Durg', users: 320 },
    { district: 'Bilaspur', users: 280 },
    { district: 'Rajnandgaon', users: 210 },
    { district: 'Korba', users: 180 },
    { district: 'Janjgir', users: 150 },
]

const signupsChartConfig = {
    users: {
        label: "New Users",
        color: "hsl(var(--accent))",
    }
} satisfies ChartConfig

export default function AdminAnalyticsPage() {
    return (
        <AdminPageWrapper>
            <div className="space-y-6">
                <h1 className="text-3xl font-bold font-headline">Analytics Dashboard</h1>
                
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">₹1,22,500</div>
                            <p className="text-xs text-muted-foreground">+15.2% from last month</p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">New Users (30d)</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">+1,834</div>
                            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
                            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">+2,350</div>
                             <p className="text-xs text-muted-foreground">Gold plan is most popular</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Revenue Overview</CardTitle>
                            <CardDescription>Last 6 months</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <ChartContainer config={revenueChartConfig} className="h-[250px] w-full">
                                <LineChart data={revenueData} margin={{ left: -20, right: 20 }}>
                                    <CartesianGrid vertical={false} />
                                    <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                                    <YAxis tickFormatter={(value) => `₹${Number(value) / 1000}k`} />
                                    <Tooltip content={<ChartTooltipContent />} />
                                    <Line dataKey="revenue" type="monotone" stroke="var(--color-revenue)" strokeWidth={2} dot={false} />
                                </LineChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>User Sign-ups by District</CardTitle>
                             <CardDescription>Top 6 districts</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <ChartContainer config={signupsChartConfig} className="h-[250px] w-full">
                                <BarChart data={signupsData} margin={{ left: -20, right: 20 }}>
                                    <CartesianGrid vertical={false} />
                                    <XAxis dataKey="district" tickLine={false} axisLine={false} tickMargin={8} />
                                    <YAxis />
                                    <Tooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                                    <Bar dataKey="users" fill="var(--color-users)" radius={4} />
                                </BarChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminPageWrapper>
    )
}
