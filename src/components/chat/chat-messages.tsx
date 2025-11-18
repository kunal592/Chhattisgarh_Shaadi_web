'use client';

import { useEffect, useState, useRef } from 'react';
import { getSocket } from '@/lib/socket';
import api from '@/lib/api';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthStore } from '@/store/auth';
import { Send } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  conversationId: string;
  createdAt: string;
}

interface ChatMessagesProps {
  conversationId: string;
}

export function ChatMessages({ conversationId }: ChatMessagesProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const { user } = useAuthStore();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await api.get(`/messages/${conversationId}`);
        setMessages(response.data.data);
        scrollToBottom();
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    if (conversationId) {
      fetchMessages();
    }

    const socket = getSocket();
    if (socket) {
      socket.on('newMessage', (message: Message) => {
        if (message.conversationId === conversationId) { // Ensure message is for the current conversation
            setMessages((prevMessages) => [...prevMessages, message]);
            scrollToBottom();
        }
      });

      return () => {
        socket.off('newMessage');
      };
    }
  }, [conversationId]);

  const handleSendMessage = () => {
    if (newMessage.trim() && user) {
      const socket = getSocket();
      const messageData = {
        conversationId: conversationId,
        content: newMessage,
        senderId: user.id, // Make sure user object has an id
      };

      if(socket) {
        socket.emit('sendMessage', messageData, (ack: any) => {
            if (ack.success) {
                setMessages((prevMessages) => [...prevMessages, ack.message]);
                setNewMessage('');
                scrollToBottom();
            }
        });
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col">
        <div className="flex-1 p-4 overflow-y-auto">
            {messages.map((msg) => (
            <div key={msg.id} className={`flex my-2 ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}>
                <div className={`px-4 py-2 rounded-lg ${msg.senderId === user?.id ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>
                    {msg.content}
                </div>
            </div>
            ))}
            <div ref={messagesEndRef} />
        </div>
        <div className="p-4 border-t flex items-center">
            <Input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button onClick={handleSendMessage} className="ml-2">
                <Send className="h-5 w-5" />
            </Button>
      </div>
    </div>
  );
}
