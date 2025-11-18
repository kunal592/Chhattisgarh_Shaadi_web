import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

// Your supported locales
const locales = ['en', 'hi', 'cg'];

export default getRequestConfig(async ({ locale }) => {
  // Validate locale from route segment
  if (!locales.includes(locale)) notFound();

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
