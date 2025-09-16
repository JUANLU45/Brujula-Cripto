'use client';

import { useState } from 'react';

import { useTranslations } from 'next-intl';

import { Card } from '@/components/ui/Card';

// Iconos SVG inline para evitar dependencias externas - CUMPLE DOCUMENTACIÓN NAVBAR.TSX
const ChevronDownIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
  </svg>
);

const ChevronUpIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
  </svg>
);

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface ContactFAQProps {
  className?: string;
}

export function ContactFAQ({ className = '' }: ContactFAQProps) {
  const t = useTranslations('contact.faq');
  const [activeTab, setActiveTab] = useState('homepage');
  const [openItems, setOpenItems] = useState<string[]>([]);

  // FAQ categories based on real site pages - SEGÚN DOCUMENTACIÓN REAL
  const categories = [
    { id: 'homepage', label: t('categories.homepage') },
    { id: 'recovery', label: t('categories.recovery') },
    { id: 'tools', label: t('categories.tools') },
    { id: 'blog', label: t('categories.blog') },
    { id: 'account', label: t('categories.account') },
    { id: 'contact', label: t('categories.contact') },
  ];

  // FAQ items organized by real site pages - CONTENIDO SEGÚN DOCUMENTACIÓN REAL
  const faqData: Record<string, FAQItem[]> = {
    homepage: [
      {
        id: 'what-is-brujula',
        question: t('homepage.whatIsBrujula.question'),
        answer: t('homepage.whatIsBrujula.answer'),
        category: 'homepage',
      },
      {
        id: 'how-to-start',
        question: t('homepage.howToStart.question'),
        answer: t('homepage.howToStart.answer'),
        category: 'homepage',
      },
    ],
    recovery: [
      {
        id: 'password-recovery',
        question: t('recovery.passwordRecovery.question'),
        answer: t('recovery.passwordRecovery.answer'),
        category: 'recovery',
      },
      {
        id: 'diagnostic-wizard',
        question: t('recovery.diagnosticWizard.question'),
        answer: t('recovery.diagnosticWizard.answer'),
        category: 'recovery',
      },
    ],
    tools: [
      {
        id: 'transaction-tracker',
        question: t('tools.transactionTracker.question'),
        answer: t('tools.transactionTracker.answer'),
        category: 'tools',
      },
      {
        id: 'service-directory',
        question: t('tools.serviceDirectory.question'),
        answer: t('tools.serviceDirectory.answer'),
        category: 'tools',
      },
    ],
    blog: [
      {
        id: 'security-guides',
        question: t('blog.securityGuides.question'),
        answer: t('blog.securityGuides.answer'),
        category: 'blog',
      },
      {
        id: 'latest-news',
        question: t('blog.latestNews.question'),
        answer: t('blog.latestNews.answer'),
        category: 'blog',
      },
    ],
    account: [
      {
        id: 'registration',
        question: t('account.registration.question'),
        answer: t('account.registration.answer'),
        category: 'account',
      },
      {
        id: 'usage-credits',
        question: t('account.usageCredits.question'),
        answer: t('account.usageCredits.answer'),
        category: 'account',
      },
    ],
    contact: [
      {
        id: 'support-email',
        question: t('contact.supportEmail.question'),
        answer: t('contact.supportEmail.answer'),
        category: 'contact',
      },
      {
        id: 'response-time',
        question: t('contact.responseTime.question'),
        answer: t('contact.responseTime.answer'),
        category: 'contact',
      },
    ],
  };

  const toggleItem = (itemId: string) => {
    setOpenItems((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId],
    );
  };

  const currentFAQs = faqData[activeTab] || [];

  return (
    <div className={`mx-auto w-full max-w-4xl ${className}`}>
      <div className="mb-8 text-center">
        <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          {t('title')}
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400">{t('subtitle')}</p>
      </div>

      {/* Tab Navigation - RESPONSIVO MOBILE-FIRST */}
      <div className="mb-8">
        <nav className="flex flex-wrap justify-center gap-2" aria-label="FAQ Categories">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveTab(category.id)}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                activeTab === category.id
                  ? 'bg-blue-600 text-white dark:bg-blue-500'
                  : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-blue-400'
              }`}
            >
              {category.label}
            </button>
          ))}
        </nav>
      </div>

      {/* FAQ Content - DESPLEGABLE ESPECTACULAR */}
      <div className="space-y-4">
        {currentFAQs.map((faq) => (
          <Card
            key={faq.id}
            className="overflow-hidden border border-gray-200 dark:border-gray-700"
          >
            <button
              onClick={() => toggleItem(faq.id)}
              className="flex w-full items-center justify-between px-6 py-4 text-left transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <h3 className="pr-4 text-lg font-medium text-gray-900 dark:text-white">
                {faq.question}
              </h3>
              {openItems.includes(faq.id) ? (
                <ChevronUpIcon className="h-5 w-5 flex-shrink-0 text-gray-500 dark:text-gray-400" />
              ) : (
                <ChevronDownIcon className="h-5 w-5 flex-shrink-0 text-gray-500 dark:text-gray-400" />
              )}
            </button>

            {openItems.includes(faq.id) && (
              <div className="px-6 pb-4">
                <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
                  <p className="text-gray-700 dark:text-gray-300">{faq.answer}</p>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Contact Support - CUMPLE DOCUMENTACIÓN */}
      <div className="mt-12 text-center">
        <Card className="border-blue-200 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-900/20">
          <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
            {t('contactSupport.title')}
          </h3>
          <p className="mb-4 text-gray-600 dark:text-gray-400">{t('contactSupport.description')}</p>
          <a
            href="mailto:soporte@brujulacripto.com"
            className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            {t('contactSupport.button')}
          </a>
        </Card>
      </div>
    </div>
  );
}

export default ContactFAQ;
