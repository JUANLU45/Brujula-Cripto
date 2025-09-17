'use client';

import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';

interface ContactFormSubmitButtonProps {
  isSubmitting: boolean;
}

export function ContactFormSubmitButton({
  isSubmitting,
}: ContactFormSubmitButtonProps): JSX.Element {
  const t = useTranslations('contact.form');

  return (
    <Button
      type="submit"
      disabled={isSubmitting}
      className="flex w-full items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-3 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
    >
      {isSubmitting && <Spinner className="mr-2 h-4 w-4" />}
      {isSubmitting ? t('sending') : t('send')}
    </Button>
  );
}
