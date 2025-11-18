import { ReactNode } from "react";
import { NextIntlClientProvider, useMessages } from "next-intl";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/navbar";
import SocketManager from "@/components/socket-manager";

type Props = {
  children: ReactNode;
  params: { locale: string };
};

export default function LocaleLayout({ children, params: { locale } }: Props) {
  const messages = useMessages();
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
  
  return (
    <html lang={locale} suppressHydrationWarning>
      <body >
        <GoogleOAuthProvider clientId={clientId}>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <SocketManager />
              <Navbar />
              {children}
              <Toaster />
            </ThemeProvider>
          </NextIntlClientProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
