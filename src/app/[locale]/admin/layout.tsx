import React from 'react';
import Link from 'next/link';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/ui/logo';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell, LogOut, BarChart, Users, Shield, FileWarning, Briefcase, DollarSign, LineChart } from 'lucide-react';
import { adminNavItems, mockCurrentUser } from '@/lib/placeholder-data';
import { LanguageSwitcher } from '@/components/layout/language-switcher';
import { useLocale } from 'next-intl';

type AdminLayoutProps = {
  children: React.ReactNode;
};

const getIconForRoute = (href: string) => {
    switch (href) {
        case '/admin': return <BarChart className="w-4 h-4" />;
        case '/admin/analytics': return <LineChart className="w-4 h-4" />;
        case '/admin/users': return <Users className="w-4 h-4" />;
        case '/admin/profiles': return <Shield className="w-4 h-4" />;
        case '/admin/agents': return <Briefcase className="w-4 h-4" />;
        case '/admin/reports': return <FileWarning className="w-4 h-4" />;
        case '/admin/subscriptions': return <DollarSign className="w-4 h-4" />;
        default: return <div className="w-4 h-4" />;
    }
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const locale = useLocale();
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Logo />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {adminNavItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild tooltip={item.label}>
                  <Link href={`/${locale}${item.href}`}>
                    {getIconForRoute(item.href)}
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
            <SidebarMenu>
                 <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Logout">
                        <Link href={`/${locale}/login`}>
                            <LogOut/>
                            <span>Logout</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <SidebarTrigger className="md:hidden"/>
            <div className="flex-1" />
            <LanguageSwitcher />
            <Button variant="ghost" size="icon" className="rounded-full" asChild>
                <Link href={`/${locale}/notifications`}>
                    <Bell className="h-5 w-5" />
                    <span className="sr-only">Notifications</span>
                </Link>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="overflow-hidden rounded-full">
                  <Avatar>
                    <AvatarImage src={mockCurrentUser.avatar} alt={mockCurrentUser.name} data-ai-hint={mockCurrentUser.avatarHint} />
                    <AvatarFallback>{mockCurrentUser.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Admin Panel</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href={`/${locale}/login`} className="w-full">Logout</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
        </header>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
