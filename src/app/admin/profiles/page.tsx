import { AdminPageWrapper } from "@/app/admin/admin-page-wrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockProfiles } from "@/lib/placeholder-data";
import { MoreHorizontal, Search } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel } from "@/components/ui/dropdown-menu";

export default function AdminProfilesPage() {
    return (
        <AdminPageWrapper>
            <Card>
                <CardHeader>
                    <CardTitle>Profile Reviews</CardTitle>
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search by profile ID or name..." className="pl-8" />
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Profile</TableHead>
                                <TableHead>Completeness</TableHead>
                                <TableHead>Verification Status</TableHead>
                                <TableHead>Submitted At</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockProfiles.filter(p => p.id === '1' || p.id === '3').map(profile => (
                                <TableRow key={profile.id}>
                                    <TableCell>
                                        <div className="font-medium">{profile.name}</div>
                                        <div className="text-sm text-muted-foreground">CG-{profile.id}B7</div>
                                    </TableCell>
                                    <TableCell>85%</TableCell>
                                    <TableCell>
                                        <Badge variant={profile.id === '1' ? 'secondary' : 'destructive'}>
                                            {profile.id === '1' ? 'PENDING' : 'REJECTED'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>3 hours ago</TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuLabel>Review Actions</DropdownMenuLabel>
                                                <DropdownMenuItem>View Profile Details</DropdownMenuItem>
                                                <DropdownMenuItem>Approve</DropdownMenuItem>
                                                <DropdownMenuItem>Request Resubmission</DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive">Reject</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </AdminPageWrapper>
    );
}
