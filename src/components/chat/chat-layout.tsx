'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { ChatMessages } from './chat-messages';
import { useAuthStore } from '@/store/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Conversation {
  id: string;
  participants: {
    id: string;
    firstName: string;
    lastName: string;
    profilePhotoUrl?: string;
  }[];
  lastMessage?: { 
    content: string;
  };
}

export function ChatLayout() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await api.get('/conversations');
        setConversations(response.data.data);
        if (response.data.data.length > 0) {
          setSelectedConversation(response.data.data[0]);
        }
      } catch (error) {
        console.error('Error fetching conversations:', error);
      }
    };

    fetchConversations();
  }, []);

  const getParticipant = (conv: Conversation) => {
      return conv.participants.find(p => p.id !== user?.id)
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] border-t">
      <aside className="w-1/4 border-r overflow-y-auto">
        <h2 className="p-4 text-xl font-semibold border-b">Conversations</h2>
        {conversations.length > 0 ? (
          <ul>
            {conversations.map((conv) => {
              const participant = getParticipant(conv);
              return (
                <li
                  key={conv.id}
                  className={`p-4 cursor-pointer flex items-center gap-4 hover:bg-gray-100 dark:hover:bg-gray-800 ${
                    selectedConversation?.id === conv.id ? 'bg-gray-200 dark:bg-gray-700' : ''
                  }`}
                  onClick={() => setSelectedConversation(conv)}
                >
                    <Avatar>
                        <AvatarImage src={participant?.profilePhotoUrl} alt={participant?.firstName} />
                        <AvatarFallback>{participant?.firstName[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold">{`${participant?.firstName} ${participant?.lastName}`}</p>
                        <p className="text-sm text-gray-500">{conv.lastMessage?.content}</p>
                    </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="p-4 text-center text-gray-500">
            <p>No conversations yet.</p>
            <p>Start a conversation to see it here.</p>
          </div>
        )}
      </aside>
      <main className="flex-1 flex flex-col">
        {selectedConversation ? (
            <>
                <header className="p-4 border-b flex items-center gap-4">
                    <Avatar>
                        <AvatarImage src={getParticipant(selectedConversation)?.profilePhotoUrl} alt={getParticipant(selectedConversation)?.firstName} />
                        <AvatarFallback>{getParticipant(selectedConversation)?.firstName[0]}</AvatarFallback>
                    </Avatar>
                    <h2 className="text-xl font-semibold">{`${getParticipant(selectedConversation)?.firstName} ${getParticipant(selectedConversation)?.lastName}`}</h2>
                </header>
                <ChatMessages conversationId={selectedConversation.id} />
            </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-xl text-gray-500">Select a conversation to start chatting</p>
          </div>
        )}
      </main>
    </div>
  );
}
