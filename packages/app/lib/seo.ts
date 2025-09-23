import type { Metadata } from 'next';

interface SEOMetadataParams {
  locale: 'es' | 'en';
  titleKey: string;
  descriptionKey: string;
  keywordsKey?: string;
  imageUrl?: string;
  path?: string;
}

interface TranslationMessages {
  [key: string]: string | TranslationMessages;
}

/**
 * Genera metadatos SEO centralizados usando claves de traducción i18n
 * Cumple con centralización absoluta - CERO objetos literales
 * CORRECCIÓN ROBUSTA: Acceso directo a traducciones con tipos seguros
 */
export async function generateSEOMetadata({
  locale,
  titleKey,
  descriptionKey,
  keywordsKey,
  imageUrl,
  path = '',
}: SEOMetadataParams): Promise<Metadata> {
  // CORRECCIÓN ROBUSTA: Importar traducciones completas con tipos seguros
  const messages = ((await import(`../i18n/${locale}.json`)) as { default: TranslationMessages })
    .default;

  // Función tipada para acceder a claves anidadas usando dot notation
  const getNestedValue = (obj: TranslationMessages, key: string): string => {
    const result = key.split('.').reduce<TranslationMessages | string>((current, prop) => {
      if (typeof current === 'object' && current !== null && prop in current) {
        return current[prop];
      }
      return key; // Fallback a la clave original
    }, obj);

    return typeof result === 'string' ? result : key;
  };

  const title = getNestedValue(messages, titleKey);
  const description = getNestedValue(messages, descriptionKey);
  const keywords = keywordsKey ? getNestedValue(messages, keywordsKey) : undefined;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://brujulacripto.com';
  const url = `${baseUrl}/${locale}${path}`;
  const image = imageUrl || `${baseUrl}/images/og-default.jpg`;

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      url,
      siteName: 'Brújula Cripto',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: locale === 'es' ? 'es_ES' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
    alternates: {
      canonical: url,
      languages: {
        es: `${baseUrl}/es${path}`,
        en: `${baseUrl}/en${path}`,
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    viewport: {
      width: 'device-width',
      initialScale: 1,
    },
  };
}

/**
 * Genera metadatos estructurados (JSON-LD) para artículos de blog
 */
export function generateArticleStructuredData({
  title,
  description,
  publishedTime,
  modifiedTime,
  authorName,
  imageUrl,
  url,
  locale,
}: {
  title: string;
  description: string;
  publishedTime: string;
  modifiedTime?: string;
  authorName: string;
  imageUrl: string;
  url: string;
  locale: 'es' | 'en';
}): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    image: imageUrl,
    author: {
      '@type': 'Organization',
      name: authorName,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Brújula Cripto',
      logo: {
        '@type': 'ImageObject',
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/images/logo.png`,
      },
    },
    datePublished: publishedTime,
    dateModified: modifiedTime || publishedTime,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    inLanguage: locale === 'es' ? 'es-ES' : 'en-US',
  };
}
