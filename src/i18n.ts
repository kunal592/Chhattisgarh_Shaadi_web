import {notFound} from 'next/navigation';
import {getRequestConfig, unstable_getRequestLocale} from 'next-intl/server';

// Can be imported from a shared config
const locales = ['en', 'hi', 'cg'];

export default getRequestConfig(async () => {
  const locale = await unstable_getRequestLocale();

  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale)) notFound();

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});