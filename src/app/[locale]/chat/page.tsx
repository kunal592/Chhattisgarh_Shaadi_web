import { ChatLayout } from '@/components/chat/chat-layout';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
    const t = await getTranslations({ locale, namespace: 'chat' });
    return {
        title: t('title'),
    };
}

export default function ChatPage() {
    return <ChatLayout />;
}
