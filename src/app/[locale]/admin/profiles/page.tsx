
import { AdminPageWrapper } from "../admin-page-wrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, Search } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { useLocale } from "next-intl";

export default function AdminProfilesPage() {
    const locale = useLocale();
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
                           {/* This should be replaced with API data */}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </AdminPageWrapper>
    );
}
