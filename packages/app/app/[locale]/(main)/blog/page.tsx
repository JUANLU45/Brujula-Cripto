import { BlogPage } from '@/components/features/blog/BlogPage';
import { generateSEOMetadata } from '@/lib/seo';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';

interface BlogPageProps {
  params: { locale: 'es' | 'en' };
}

// METADATA SEO SEGÚN PROYEC_PARTE2.MD - generateMetadata para i18n
export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  return generateSEOMetadata({
    locale: params.locale,
    titleKey: 'blog.page.seo.title',
    descriptionKey: 'blog.page.seo.description',
  });
}

export default async function BlogMainPage({ params }: BlogPageProps) {
  const { locale } = params;
  const t = await getTranslations('blog.page');

  // VALIDACIÓN LOCALE SEGÚN PROYEC_PARTE1.MD
  if (!['es', 'en'].includes(locale)) {
    notFound();
  }

  // CONFIGURACIÓN BANNER CENTRALIZADA
  const bannerConfig = {
    title: t('title'), // "Explora Nuestro Blog de Cripto Seguridad"
    subtitle: t('subtitle'), // "Guías, Noticias y Consejos Expertos"
    description: t('description'), // "Mantente al día con las mejores prácticas en criptomonedas"
    imageUrl: '/images/blog/blog-hero.jpg',
    isEditable: false, // Solo true en admin
  };

  // RENDERIZAR COMPONENTE CLIENTE BLOGPAGE CON CONFIGURACIÓN CENTRALIZADA
  return <BlogPage locale={locale} bannerConfig={bannerConfig} />;
}
