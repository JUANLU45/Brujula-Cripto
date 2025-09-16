import { notFound } from 'next/navigation';

import type { IArticle } from '@brujula-cripto/types';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { ArticlePage } from '@/components/features/blog/ArticlePage';

interface ArticlePageProps {
  params: Promise<{
    locale: 'es' | 'en';
    slug: string;
  }>;
}

// METADATA SEO DINÁMICO SEGÚN PROYEC_PARTE2.MD
export async function generateMetadata(props: ArticlePageProps): Promise<Metadata> {
  const params = await props.params;
  const { locale, slug } = params;

  try {
    // FETCH ARTÍCULO PARA METADATA SEO
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/articles/${slug}?locale=${locale}`,
    );

    if (!response.ok) {
      // USAR TRADUCCIONES CENTRALIZADAS PARA ERRORES
      const t = await getTranslations('blog.article.error');
      return {
        title: `${t('title')} | Brújula Cripto`,
        description: t('title'),
      };
    }

    const article: IArticle = await response.json();

    return {
      title: `${article[locale].title} | Brújula Cripto`,
      description: article[locale].excerpt,
      keywords: article.tags,
      openGraph: {
        type: 'article',
        title: article[locale].title,
        description: article[locale].excerpt,
        images: article.imageUrl ? [article.imageUrl] : [],
        publishedTime: article.createdAt.toString(),
        authors: [article.authorName],
        tags: article.tags,
        siteName: 'Brújula Cripto',
      },
      alternates: {
        canonical: `/blog/${slug}`,
        languages: {
          es: `/es/blog/${slug}`,
          en: `/en/blog/${slug}`,
        },
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    const t = await getTranslations('blog.article.error');
    return {
      title: `${t('title')} | Brújula Cripto`,
      description: t('title'),
    };
  }
}

export default async function ArticleSlugPage(props: ArticlePageProps) {
  const params = await props.params;
  const { locale, slug } = params;
  const t = await getTranslations('blog.article');

  // VALIDACIÓN LOCALE Y SLUG SEGÚN PROYEC_PARTE1.MD
  if (!['es', 'en'].includes(locale) || !slug) {
    notFound();
  }

  try {
    // FETCH ARTÍCULO DESDE SERVER - DATOS REALES
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/articles/${slug}?locale=${locale}`,
    );

    if (!response.ok) {
      notFound();
    }

    const article: IArticle = await response.json();

    // RENDERIZAR COMPONENTE CLIENTE ARTICLEPAGE CON DATOS
    return <ArticlePage article={article} locale={locale} />;
  } catch (error) {
    console.error('Error loading article:', error);
    notFound();
  }
}
