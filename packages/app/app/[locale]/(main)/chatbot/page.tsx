import type { Metadata } from 'next';

import { ChatbotLayout } from '@/components/features/chatbot/ChatbotLayout';
import { generateSEOMetadata } from '@/lib/seo';

interface ChatbotPageProps {
  params: Promise<{
    locale: 'es' | 'en';
  }>;
}

export async function generateMetadata(props: ChatbotPageProps): Promise<Metadata> {
  const params = await props.params;

  const { locale } = params;

  return generateSEOMetadata({
    locale,
    titleKey: 'chatbot.metadata.title',
    descriptionKey: 'chatbot.metadata.description',
    keywordsKey: 'chatbot.metadata.keywords',
    path: '/chatbot',
  });
}

export default async function ChatbotPage(props: ChatbotPageProps): Promise<JSX.Element> {
  const params = await props.params;

  const { locale } = params;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-xl bg-white/80 shadow-xl backdrop-blur-sm dark:bg-gray-800/80">
          <ChatbotLayout locale={locale} />
        </div>
      </div>
    </div>
  );
}
