'use client';

import Image from 'next/image';

interface ChatbotHeaderProps {
  title: string;
  subtitle: string;
}

export function ChatbotHeader({ title, subtitle }: ChatbotHeaderProps): JSX.Element {
  return (
    <div className="border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-center gap-3">
        <Image
          src="/images/chatbot/chatbot-logo.svg"
          alt="Brújula Cripto"
          width={76}
          height={76}
          className="h-20 w-20"
        />
        <div>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}
