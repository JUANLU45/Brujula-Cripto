import { getRequestConfig } from 'next-intl/server';import { getRequestConfig } from 'next-intl/server';

import { routing } from './routing';import { routing } from './routing';



export default getRequestConfig(async ({ locale }) => {export default getRequestConfig(async ({ locale }) => {

  // Validate that the incoming `locale` parameter is valid  // Validate that the incoming `locale` parameter is valid

  if (!routing.locales.includes(locale as any)) {  if (!routing.locales.includes(locale as any)) {

    throw new Error(`Invalid locale: ${locale}`);    throw new Error(`Invalid locale: ${locale}`);

  }  }



  return {  return {

    messages: (await import(`./${locale}.json`)).default    messages: (await import(`../messages/${locale}.json`)).default

  };  };

});});
