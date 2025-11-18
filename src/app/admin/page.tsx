import { AdminPageWrapper } from "@/app/admin/admin-page-wrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockProfiles } from "@/lib/placeholder-data";
import { DollarSign, UserCheck, Users, FileWarning } from "lucide-react";
import Link from "next/link";

const stats = [
    { title: "Total Users", value: "12,405", icon: <Users/>, change: "+2.5% this month" },
    { title: "Active Subscriptions", value: "2,350", icon: <DollarSign/>, change: "+8.1% this month" },
    { title: "Pending Profiles", value: "89", icon: <UserCheck/>, change: "12 waiting for review" },
    { title: "Open Reports", value: "15", icon: <FileWarning/>, change: "+3 new today" },
]

export default function AdminPage() {
    return (
        <AdminPageWrapper>
            <div>
                <h1 className="text-3xl font-bold font-headline mb-6">Admin Dashboard</h1>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
                    {stats.map(stat => (
                        <Card key={stat.title}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                                {stat.icon}
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <p className="text-xs text-muted-foreground">{stat.change}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Recent Registrations</CardTitle>
                             <Link href="/admin/users">
                                <Button variant="outline" size="sm">View All</Button>
                            </Link>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Location</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Joined</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {mockProfiles.slice(0, 5).map(profile => (
                                        <TableRow key={profile.id}>
                                            <TableCell className="font-medium">{profile.name}</TableCell>
                                            <TableCell>{profile.location}</TableCell>
                                            <TableCell>
                                                <Badge variant={profile.id === '1' ? 'destructive' : 'secondary'}>
                                                    {profile.id === '1' ? 'Pending' : 'Verified'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>2 days ago</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Profiles for Review</CardTitle>
                            <Link href="/admin/profiles">
                                <Button variant="outline" size="sm">View All</Button>
                            </Link>
                        </CardHeader>
                        <CardContent>
                             <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Profile ID</TableHead>
                                        <TableHead>Submitted</TableHead>
                                        <TableHead>Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                     {mockProfiles.slice(0, 2).map(profile => (
                                        <TableRow key={profile.id}>
                                            <TableCell className="font-medium">{profile.name}</TableCell>
                                            <TableCell>CG-{profile.id}B7</TableCell>
                                            <TableCell>1 hour ago</TableCell>
                                            <TableCell>
                                                <Button variant="ghost" size="sm">Review</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminPageWrapper>
    );
}
