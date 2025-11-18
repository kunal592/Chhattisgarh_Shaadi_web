
"use client"

import { ChatLayout } from "@/components/chat/chat-layout";

export default function MessagesPage() {
    return (
        <ChatLayout>
            <div className="flex flex-col h-full justify-center items-center">
                <h1 className="text-2xl font-bold text-muted-foreground">Select a conversation</h1>
                <p className="text-muted-foreground">Or start a new one from a user's profile.</p>
            </div>
        </ChatLayout>
    )
}
