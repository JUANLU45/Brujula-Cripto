import { defineRouting } from 'next-intl/routing';import { createSharedPathnamesNavigation } from 'next-intl/navigation';

import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({

  // A list of all locales that are supportedexport const routing = defineRouting({

  locales: ['es', 'en'],  // A list of all locales that are supported

    locales: ['es', 'en'],

  // Used when no locale matches

  defaultLocale: 'es'  // Used when no locale matches

});  defaultLocale: 'es',

  // The `pathnames` object holds pairs of internal and
  // external paths. Based on the locale, the external
  // paths are rewritten to the shared, internal ones.
  pathnames: {
    // If all locales use the same pathname, a single
    // external path can be provided for all locales
    '/': '/',
    '/blog': '/blog',
    '/about': '/about',
    '/contact': '/contact',
    '/services': '/services',
    '/admin': '/admin',
  },
});

export const { Link, redirect, usePathname, useRouter } = createSharedPathnamesNavigation(routing);
