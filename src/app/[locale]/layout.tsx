import { ReactNode } from "react";
import { NextIntlClientProvider, useMessages } from "next-intl";
import { GoogleOAuthProvider } from '@react-oauth/google';

type Props = {
  children: ReactNode;
  params: { locale: string };
};

export default function LocaleLayout({ children, params: { locale } }: Props) {
  const messages = useMessages();
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
  
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <NextIntlClientProvider locale={locale} messages={messages}>
        {children}
      </NextIntlClientProvider>
    </GoogleOAuthProvider>
  );
}
