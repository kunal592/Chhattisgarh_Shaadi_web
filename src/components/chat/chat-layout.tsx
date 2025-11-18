
"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PropsWithChildren } from "react";

export function ChatLayout({ children }: PropsWithChildren) {
    return (
        <DashboardLayout>
            <div className="grid grid-cols-1 md:grid-cols-4 h-[calc(100vh-4rem)]">
                {/* Contact List - Will be implemented later */}
                <div className="col-span-1 border-r bg-slate-50">
                    {/* Placeholder for contact list */}
                    <p className="p-4 text-center text-muted-foreground">Contact list coming soon</p>
                </div>
                {/* Message View */}
                <main className="col-span-3">
                    {children}
                </main>
            </div>
        </DashboardLayout>
    )
}
