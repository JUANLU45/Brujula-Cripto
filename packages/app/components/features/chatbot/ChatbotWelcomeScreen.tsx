'use client';

import { Button } from '@/components/ui/Button';

import { BrujulaIcon } from './ChatbotIcons';

interface ChatbotWelcomeScreenProps {
  title: string;
  description: string;
  suggestedQuestions: string[];
  onQuestionClick: (question: string) => void;
}

export function ChatbotWelcomeScreen({
  title,
  description,
  suggestedQuestions,
  onQuestionClick,
}: ChatbotWelcomeScreenProps): JSX.Element {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-blue-600">
        <BrujulaIcon className="h-10 w-10 text-white" />
      </div>
      <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
      <p className="mb-8 max-w-md text-center text-gray-600 dark:text-gray-300">{description}</p>

      {/* Suggested Questions */}
      <div className="grid gap-3 md:grid-cols-2">
        {suggestedQuestions.map((question, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            onClick={() => onQuestionClick(question)}
            className="max-w-xs text-left"
          >
            {question}
          </Button>
        ))}
      </div>
    </div>
  );
}
