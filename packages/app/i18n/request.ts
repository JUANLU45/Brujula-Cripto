import { getRequestConfig } from 'next-intl/server';

import { routing } from './routing';

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locale || !routing.locales.includes(locale as (typeof routing.locales)[number])) {
    throw new Error(`Invalid locale: ${locale}`);
  }

  return {
    locale: locale,
    messages: (await import(`./${locale}.json`)).default,
  };
});
