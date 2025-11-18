import { AdminPageWrapper } from "../admin-page-wrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, Search } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel } from "@/components/ui/dropdown-menu";

const mockReports = [
    { id: 1, reporter: 'Sunita Verma', reportedUser: 'Rajesh Patel', reason: 'FAKE_PROFILE', status: 'PENDING', date: '2024-07-28' },
    { id: 2, reporter: 'Amit Kumar', reportedUser: 'Kavita Sahu', reason: 'INAPPROPRIATE_CONTENT', status: 'UNDER_REVIEW', date: '2024-07-27' },
    { id: 3, reporter: 'Anjali Sharma', reportedUser: 'Vikram Singh', reason: 'HARASSMENT', status: 'RESOLVED', date: '2024-07-26' },
    { id: 4, reporter: 'Priya', reportedUser: 'Rohan', reason: 'SCAM', status: 'DISMISSED', date: '2024-07-25' },
];

export default function AdminReportsPage() {
    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'PENDING': return 'destructive';
            case 'UNDER_REVIEW': return 'secondary';
            case 'RESOLVED': return 'default';
            case 'DISMISSED': return 'outline';
            default: return 'secondary';
        }
    };

    return (
        <AdminPageWrapper>
            <Card>
                <CardHeader>
                    <CardTitle>Reports Center</CardTitle>
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search reports by user, reason, or status..." className="pl-8" />
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Reporter</TableHead>
                                <TableHead>Reported User</TableHead>
                                <TableHead>Reason</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockReports.map(report => (
                                <TableRow key={report.id}>
                                    <TableCell>{report.reporter}</TableCell>
                                    <TableCell>{report.reportedUser}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{report.reason}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusVariant(report.status)}>
                                            {report.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{report.date}</TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuLabel>Report Actions</DropdownMenuLabel>
                                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                                <DropdownMenuItem>Take Action</DropdownMenuItem>
                                                <DropdownMenuItem>Mark as Resolved</DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive">Dismiss Report</DropdownMenuItem>
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
