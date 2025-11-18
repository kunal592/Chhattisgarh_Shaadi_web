
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Bell, Heart, MessageSquare, User } from "lucide-react";
import { useLocale } from "next-intl";


// This mock data should be replaced with a call to the /notifications API endpoint
const notifications = [
    {
        id: 1,
        type: 'NEW_MESSAGE',
        user: { name: 'Priya S.', avatar: 'https://picsum.photos/seed/notif1/200/200', avatarHint: 'person photo' },
        text: {
            en: 'sent you a message.',
            hi: 'ने आपको एक संदेश भेजा है।',
            cg: 'ह एक संदेश भेजे हे।'
        },
        time: {
            en: '2 hours ago',
            hi: '2 घंटे पहले',
            cg: '2 घंटा पहिली'
        },
    },
    {
        id: 2,
        type: 'PROFILE_VIEW',
        user: { name: 'Rahul K.', avatar: 'https://picsum.photos/seed/notif2/200/200', avatarHint: 'person photo' },
        text: {
            en: 'viewed your profile.',
            hi: 'ने आपकी प्रोफ़ाइल देखी।',
            cg: 'ह तुंहर प्रोफाइल देखिस।'
        },
        time: {
            en: '5 hours ago',
            hi: '5 घंटे पहले',
            cg: '5 घंटा पहिली'
        },
    },
    {
        id: 3,
        type: 'NEW_MATCH',
        user: { name: 'Anjali M.', avatar: 'https://picsum.photos/seed/notif3/200/200', avatarHint: 'person photo' },
        text: {
            en: 'is a new match for you!',
            hi: 'आपके लिए एक नया मैच है!',
            cg: 'ह तुंहर बर एक नवा मैच हे!'
        },
        time: {
            en: '1 day ago',
            hi: '1 दिन पहले',
            cg: '1 दिन पहिली'
        },
    },
];

const getNotificationIcon = (type: string) => {
    switch (type) {
        case 'NEW_MESSAGE': return <MessageSquare className="h-5 w-5 text-primary" />;
        case 'PROFILE_VIEW': return <User className="h-5 w-5 text-accent" />;
        case 'NEW_MATCH': return <Heart className="h-5 w-5 text-destructive" />;
        default: return <Bell className="h-5 w-5 text-muted-foreground" />;
    }
}

export default function NotificationsPage() {
    const locale = useLocale() as 'en' | 'hi' | 'cg';
    return (
        <DashboardLayout>
            <div className="p-4 sm:p-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Notifications</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {notifications.map((notification, index) => (
                            <div key={notification.id}>
                                <div className="flex items-center gap-4 py-4">
                                    <div className="w-8">{getNotificationIcon(notification.type)}</div>
                                    <Avatar>
                                        <AvatarImage src={notification.user.avatar} alt={notification.user.name} data-ai-hint={notification.user.avatarHint}/>
                                        <AvatarFallback>{notification.user.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-grow">
                                        <p className="text-sm">
                                            <span className="font-semibold">{notification.user.name}</span> {notification.text[locale]}
                                        </p>
                                        <p className="text-xs text-muted-foreground">{notification.time[locale]}</p>
                                    </div>
                                </div>
                                {index < notifications.length - 1 && <Separator />}
                            </div>
                        ))}
                         {notifications.length === 0 && (
                            <div className="text-center text-muted-foreground py-12">
                                You have no new notifications.
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
