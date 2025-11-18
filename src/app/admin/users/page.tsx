import { AdminPageWrapper } from "@/app/admin/admin-page-wrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockProfiles } from "@/lib/placeholder-data";
import { MoreHorizontal, Search } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel } from "@/components/ui/dropdown-menu";

export default function AdminUsersPage() {
    return (
        <AdminPageWrapper>
            <Card>
                <CardHeader>
                    <CardTitle>User Management</CardTitle>
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search users by name, email, or phone..." className="pl-8" />
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead className="hidden sm:table-cell">Role</TableHead>
                                <TableHead className="hidden sm:table-cell">Status</TableHead>
                                <TableHead className="hidden md:table-cell">Last Login</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockProfiles.map(profile => (
                                <TableRow key={profile.id}>
                                    <TableCell>
                                        <div className="font-medium">{profile.name}</div>
                                        <div className="text-sm text-muted-foreground truncate">user{profile.id}@example.com</div>
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell">
                                        <Badge variant="outline">
                                            {profile.id === '2' ? 'PREMIUM' : 'USER'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell">
                                        <Badge variant={profile.id === '4' ? 'destructive' : 'default'}>
                                            {profile.id === '4' ? 'BANNED' : 'ACTIVE'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">2 hours ago</TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem>View Profile</DropdownMenuItem>
                                                <DropdownMenuItem>Edit User</DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive">Ban User</DropdownMenuItem>
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
