'use client';

import { BrujulaIcon } from './ChatbotIcons';

interface ChatbotHeaderProps {
  title: string;
  subtitle: string;
}

export function ChatbotHeader({ title, subtitle }: ChatbotHeaderProps): JSX.Element {
  return (
    <div className="border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600">
          <BrujulaIcon className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}
