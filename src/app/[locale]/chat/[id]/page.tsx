
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Paperclip, Send, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useLocale } from "next-intl";

export default function ChatPage({ params }: { params: { id: string } }) {
  const locale = useLocale() as 'en' | 'hi' | 'cg';
  // All data is now mock and needs to be replaced with API calls and Socket.io integration.
  const currentChatPartner = { id: '1', name: 'Mock Partner', avatar: 'https://picsum.photos/seed/1/200/200', avatarHint: 'person photo' };

  const mockProfiles = [
    { id: '1', name: 'Mock Partner 1', avatar: 'https://picsum.photos/seed/2/200/200', avatarHint: 'person photo', lastMessage: 'See you then!', time: '1h ago' },
    { id: '2', name: 'Mock Partner 2', avatar: 'https://picsum.photos/seed/3/200/200', avatarHint: 'person photo', lastMessage: 'Okay, sounds good.', time: '3h ago' },
  ];

  const messages = {
      en: [
          "Hi there! I saw your profile and was really impressed.",
          "Oh, thank you! I liked your profile too. Nice to meet you.",
          "So what do you do for work?",
      ],
      hi: [
          "नमस्ते! मैंने आपकी प्रोफ़ाइल देखी और मैं बहुत प्रभावित हुआ।",
          "ओह, धन्यवाद! मुझे भी आपकी प्रोफ़ाइल पसंद आई। आपसे मिलकर अच्छा लगा।",
          "तो आप काम क्या करते हैं?",
      ],
      cg: [
          "नमस्कार! मैं तुंहर प्रोफाइल देखेंव अउ बहुत प्रभावित होएंव।",
          "ओह, धन्यवाद! मोला भी तुंहर प्रोफाइल पसंद आइस। तुमन ले मिलके अच्छा लगिस।",
          "त तुमन का काम करथव?",
      ]
  }

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-57px)] md:h-[calc(100vh-100px)] flex">
        {/* Chat List - Hidden on mobile when a chat is open */}
        <div className={cn("w-full md:w-1/3 border-r", params.id ? "hidden md:flex flex-col" : "flex flex-col")}>
          <div className="p-4 border-b">
            <h2 className="text-xl font-bold">Messages</h2>
            <Input placeholder="Search chats..." className="mt-2" />
          </div>
          <ScrollArea className="h-full">
            {mockProfiles.map(profile => (
             <Link href={`/${locale}/chat/${profile.id}`} key={profile.id}>
              <div className={cn("p-4 flex items-center gap-4 cursor-pointer hover:bg-accent", params.id === profile.id && "bg-accent")}>
                <Avatar>
                  <AvatarImage src={profile.avatar} alt={profile.name} data-ai-hint={profile.avatarHint} />
                  <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-grow">
                  <p className="font-semibold">{profile.name}</p>
                  <p className="text-sm text-muted-foreground truncate">{profile.lastMessage}</p>
                </div>
                <div className="text-xs text-muted-foreground">{profile.time}</div>
              </div>
             </Link>
            ))}
          </ScrollArea>
        </div>

        {/* Chat Window - Hidden on mobile if no chat is selected */}
        <div className={cn("w-full md:w-2/3 flex-col", params.id ? "flex" : "hidden md:flex")}>
          <div className="p-4 border-b flex items-center gap-4">
            <Link href={`/${locale}/chat`} className="md:hidden">
                <Button variant="ghost" size="icon">
                    <ArrowLeft />
                </Button>
            </Link>
            <Avatar>
              <AvatarImage src={currentChatPartner.avatar} alt={currentChatPartner.name} data-ai-hint={currentChatPartner.avatarHint} />
              <AvatarFallback>{currentChatPartner.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{currentChatPartner.name}</p>
              <p className="text-sm text-green-500">Online</p>
            </div>
          </div>
          <ScrollArea className="flex-grow bg-secondary/30 p-4">
            <div className="space-y-4">
              <div className="flex justify-start">
                <div className="bg-card p-3 rounded-lg max-w-xs sm:max-w-md">{messages[locale][0]}</div>
              </div>
              <div className="flex justify-end">
                <div className="bg-primary text-primary-foreground p-3 rounded-lg max-w-xs sm:max-w-md">{messages[locale][1]}</div>
              </div>
              <div className="flex justify-start">
                <div className="bg-card p-3 rounded-lg max-w-xs sm:max-w-md">{messages[locale][2]}</div>
              </div>
            </div>
          </ScrollArea>
          <div className="p-4 border-t bg-background">
            <div className="relative">
              <Input placeholder="Type a message..." className="pr-24" />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                 <Button variant="ghost" size="icon"><Paperclip className="w-5 h-5"/></Button>
                 <Button size="icon"><Send className="w-5 h-5"/></Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
