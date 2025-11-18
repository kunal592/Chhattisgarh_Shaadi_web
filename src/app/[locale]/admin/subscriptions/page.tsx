import { AdminPageWrapper } from "../admin-page-wrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, Search } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel } from "@/components/ui/dropdown-menu";

const mockSubscriptions = [
    { id: 1, userName: 'Amit Kumar', planName: 'Gold', status: 'ACTIVE', startDate: '2024-07-01', endDate: '2024-10-01', price: '₹1,499' },
    { id: 2, userName: 'Kavita Sahu', planName: 'Diamond', status: 'ACTIVE', startDate: '2024-06-15', endDate: '2024-12-15', price: '₹2,999' },
    { id: 3, userName: 'Sunita Verma', planName: 'Gold', status: 'EXPIRED', startDate: '2024-01-10', endDate: '2024-04-10', price: '₹1,499' },
    { id: 4, userName: 'Rajesh Patel', planName: 'Basic', status: 'CANCELLED', startDate: '2024-05-20', endDate: '2024-08-20', price: 'Free' },
];

export default function AdminSubscriptionsPage() {
    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'ACTIVE': return 'default';
            case 'EXPIRED': return 'secondary';
            case 'CANCELLED': return 'destructive';
            default: return 'outline';
        }
    };

    return (
        <AdminPageWrapper>
            <Card>
                <CardHeader>
                    <CardTitle>Subscription Management</CardTitle>
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search subscriptions by user or plan..." className="pl-8" />
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Plan</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Period</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockSubscriptions.map(sub => (
                                <TableRow key={sub.id}>
                                    <TableCell>{sub.userName}</TableCell>
                                    <TableCell>{sub.planName}</TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusVariant(sub.status)}>
                                            {sub.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium">{sub.startDate}</div>
                                        <div className="text-sm text-muted-foreground">to {sub.endDate}</div>
                                    </TableCell>
                                    <TableCell>{sub.price}</TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuLabel>Subscription Actions</DropdownMenuLabel>
                                                <DropdownMenuItem>View Payment</DropdownMenuItem>
                                                <DropdownMenuItem>Extend Subscription</DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive">Cancel Subscription</DropdownMenuItem>
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
