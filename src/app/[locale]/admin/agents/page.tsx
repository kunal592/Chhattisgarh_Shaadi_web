import { AdminPageWrapper } from "../admin-page-wrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, Search } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel } from "@/components/ui/dropdown-menu";

const mockAgents = [
    { id: 1, agentCode: 'AGT0001', agentName: 'Raipur Connect', status: 'ACTIVE', totalUsers: 152, totalRevenue: '₹45,000' },
    { id: 2, agentCode: 'AGT0002', agentName: 'Bilaspur Matrimony', status: 'ACTIVE', totalUsers: 98, totalRevenue: '₹28,500' },
    { id: 3, agentCode: 'AGT0003', agentName: 'Durg Services', status: 'INACTIVE', totalUsers: 34, totalRevenue: '₹12,000' },
];

export default function AdminAgentsPage() {
    return (
        <AdminPageWrapper>
            <Card>
                <CardHeader className="flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <CardTitle>Agent Management</CardTitle>
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search agents..." className="pl-8" />
                        </div>
                        <Button className="w-full sm:w-auto">Add New Agent</Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Agent</TableHead>
                                <TableHead className="hidden sm:table-cell">Status</TableHead>
                                <TableHead className="hidden md:table-cell">Total Users</TableHead>
                                <TableHead className="hidden md:table-cell">Total Revenue</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockAgents.map(agent => (
                                <TableRow key={agent.id}>
                                    <TableCell>
                                        <div className="font-medium">{agent.agentName}</div>
                                        <div className="text-sm text-muted-foreground">{agent.agentCode}</div>
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell">
                                        <Badge variant={agent.status === 'ACTIVE' ? 'default' : 'secondary'}>
                                            {agent.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">{agent.totalUsers}</TableCell>
                                    <TableCell className="hidden md:table-cell">{agent.totalRevenue}</TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuLabel>Agent Actions</DropdownMenuLabel>
                                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                                <DropdownMenuItem>Manage Payouts</DropdownMenuItem>
                                                <DropdownMenuItem>Edit Agent</DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive">Suspend Agent</DropdownMenuItem>
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
