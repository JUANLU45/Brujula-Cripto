'use client';

import { useTranslations } from 'next-intl';

import { Card } from '@/components/ui/Card';

import { ContactFormField } from './ContactFormField';
import { ContactFormInfo } from './ContactFormInfo';
import { ContactFormStatus } from './ContactFormStatus';
import { ContactFormSubmitButton } from './ContactFormSubmitButton';
import { ContactFormTextarea } from './ContactFormTextarea';
import { useContactForm } from './hooks/useContactForm';

interface ContactFormProps {
  className?: string;
}

export function ContactForm({ className = '' }: ContactFormProps): JSX.Element {
  const t = useTranslations('contact.form');

  const { isSubmitting, submitStatus, register, handleSubmit, errors, onSubmit } = useContactForm();

  return (
    <Card className={`mx-auto w-full max-w-2xl p-6 sm:p-8 ${className}`}>
      <div className="mb-8 text-center">
        <h2 className="mb-4 text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
          {t('title')}
        </h2>
        <p className="text-base text-gray-600 dark:text-gray-400 sm:text-lg">{t('subtitle')}</p>
      </div>

      <ContactFormStatus status={submitStatus} />

      <form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className="space-y-6">
        <ContactFormField
          id="name"
          type="text"
          fieldKey="name"
          autoComplete="name"
          disabled={isSubmitting}
          register={register}
          error={errors.name?.message}
        />

        <ContactFormField
          id="email"
          type="email"
          fieldKey="email"
          autoComplete="email"
          disabled={isSubmitting}
          register={register}
          error={errors.email?.message}
        />

        <ContactFormTextarea
          disabled={isSubmitting}
          register={register}
          error={errors.message?.message}
        />

        <ContactFormSubmitButton isSubmitting={isSubmitting} />
      </form>

      <ContactFormInfo />
    </Card>
  );
}

export default ContactForm;
