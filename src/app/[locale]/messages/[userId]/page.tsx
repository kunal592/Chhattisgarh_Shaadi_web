
"use client"

import { useState, useEffect, useRef } from "react";
import { ChatLayout } from "@/components/chat/chat-layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import api from "@/lib/api";
import { io, Socket } from "socket.io-client";

interface Message {
    id: string;
    content: string;
    senderId: string;
    receiverId: string;
    createdAt: string;
}

export default function ChatPage({ params }: { params: { userId: string } }) {
    const { user } = useAuthStore();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const socketRef = useRef<Socket | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await api.get(`/messages/${params.userId}`);
                setMessages(response.data.data);
            } catch (error) {
                console.error("Failed to fetch messages", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchMessages();

        // Setup WebSocket
        const socket = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001", { 
            auth: { token: user?.accessToken },
            transports: ["websocket"]
        }); 
        socketRef.current = socket;

        socket.on("connect", () => {
            console.log("Connected to WebSocket");
        });

        socket.on("receiveMessage", (message: Message) => {
            if (message.senderId === params.userId || message.senderId === user?.id) {
                setMessages((prev) => [...prev, message]);
            }
        });

        socket.on("disconnect", () => {
            console.log("Disconnected from WebSocket");
        });

        return () => {
            socket.disconnect();
        };

    }, [params.userId, user?.accessToken, user?.id]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() && socketRef.current) {
            const messageData = {
                receiverId: params.userId,
                content: newMessage,
            };
            socketRef.current.emit("sendMessage", messageData);
            setNewMessage("");
        }
    };

    return (
        <ChatLayout>
            <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center gap-4 p-4 border-b">
                    <Avatar>
                        <AvatarImage src="/placeholder.png" />
                        <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <h2 className="text-lg font-semibold">User {params.userId}</h2>
                </div>

                {/* Messages */}
                <div className="flex-grow p-4 overflow-y-auto">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-full">
                            <Loader2 className="w-12 h-12 animate-spin text-primary" />
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`p-3 rounded-lg max-w-xs lg:max-w-md ${msg.senderId === user?.id ? 'bg-primary text-primary-foreground' : 'bg-slate-200'}`}>
                                        <p>{msg.content}</p>
                                        <span className="text-xs opacity-70 mt-1 block">{new Date(msg.createdAt).toLocaleTimeString()}</span>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>

                {/* Input */}
                <div className="p-4 border-t">
                    <form onSubmit={sendMessage} className="flex gap-2">
                        <Input 
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)} 
                            placeholder="Type a message..." 
                        />
                        <Button type="submit">
                            <Send className="w-5 h-5"/>
                        </Button>
                    </form>
                </div>
            </div>
        </ChatLayout>
    );
}
