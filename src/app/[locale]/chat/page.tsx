import ChatPage from './[id]/page';

// On mobile, this page shows the list of chats.
// On desktop, it redirects to the first chat to show a complete view.
export default function ChatRedirectPage() {
  // For mobile, render the chat page with no ID selected, which shows the list.
  // For desktop, the layout in [id]/page.tsx handles showing the list and the first chat.
  // The redirect was causing hydration issues and is no longer necessary with the CSS-driven layout.
  return <ChatPage params={{ id: '' }} />;
}
