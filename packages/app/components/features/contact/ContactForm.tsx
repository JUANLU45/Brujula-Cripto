'use client';

import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';

// Validation schema using Zod - CUMPLE DOCUMENTACIÓN PROYEC_PARTE2.MD
const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

interface ContactFormProps {
  className?: string;
}

export function ContactForm({ className = '' }: ContactFormProps) {
  // INTERNACIONALIZACIÓN CENTRALIZADA - CUMPLE DOCUMENTACIÓN
  const t = useTranslations('contact.form');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // REACT HOOK FORM + ZOD - CUMPLE DOCUMENTACIÓN PROYEC_PARTE2.MD
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // LLAMADA REAL AL BACKEND handleContactForm Cloud Function
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      setSubmitStatus('success');
      reset();
    } catch (error) {
      console.error('Contact form error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className={`mx-auto w-full max-w-2xl p-6 sm:p-8 ${className}`}>
      <div className="mb-8 text-center">
        <h2 className="mb-4 text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
          {t('title')}
        </h2>
        <p className="text-base text-gray-600 dark:text-gray-400 sm:text-lg">{t('subtitle')}</p>
      </div>

      {/* FEEDBACK VISUAL - CUMPLE DOCUMENTACIÓN */}
      {submitStatus === 'success' && (
        <div className="mb-6 rounded-md border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
          <div className="text-sm text-green-700 dark:text-green-400">{t('success')}</div>
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="mb-6 rounded-md bg-red-50 p-4 dark:bg-red-900/20">
          <div className="text-sm text-red-700 dark:text-red-400">{t('error')}</div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* CAMPO NOMBRE */}
        <div>
          <label
            htmlFor="name"
            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {t('name.label')}
          </label>
          <Input
            id="name"
            type="text"
            autoComplete="name"
            placeholder={t('name.placeholder')}
            disabled={isSubmitting}
            className={`w-full ${
              errors.name
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600'
            }`}
            {...register('name')}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{t('name.error')}</p>
          )}
        </div>

        {/* CAMPO EMAIL */}
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {t('email.label')}
          </label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder={t('email.placeholder')}
            disabled={isSubmitting}
            className={`w-full ${
              errors.email
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600'
            }`}
            {...register('email')}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{t('email.error')}</p>
          )}
        </div>

        {/* CAMPO MENSAJE */}
        <div>
          <label
            htmlFor="message"
            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {t('message.label')}
          </label>
          <textarea
            id="message"
            rows={6}
            placeholder={t('message.placeholder')}
            disabled={isSubmitting}
            className={`w-full rounded-md border px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 ${
              errors.message
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600'
            }`}
            {...register('message')}
          />
          {errors.message && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{t('message.error')}</p>
          )}
        </div>

        {/* BOTÓN SUBMIT */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-3 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          {isSubmitting && <Spinner className="mr-2 h-4 w-4" />}
          {isSubmitting ? t('sending') : t('send')}
        </Button>
      </form>

      {/* INFORMACIÓN DE CONTACTO ADICIONAL */}
      <div className="mt-8 border-t border-gray-200 pt-6 dark:border-gray-700">
        <div className="grid grid-cols-1 gap-6 text-center md:grid-cols-2">
          <div>
            <h3 className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
              {t('support.title')}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">soporte@brujulacripto.com</p>
          </div>
          <div>
            <h3 className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
              {t('info.title')}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">info@brujulacripto.com</p>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default ContactForm;
