'use client';

import React, { useState } from 'react';

import { useTranslations } from 'next-intl';

import { useAuth } from '@/lib/auth/AuthProvider';

export function PasswordResetForm(): JSX.Element {
  const t = useTranslations('auth.passwordReset');
  const { resetPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await resetPassword(email);
      setSuccess(true);
    } catch (error: any) {
      setError(error.message || 'Error al enviar el correo de recuperación');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="mx-auto w-full max-w-md">
        <div className="rounded-md border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800 dark:text-green-200">
                {t('emailSent')}
              </h3>
              <div className="mt-2 text-sm text-green-700 dark:text-green-300">
                <p>{t('checkEmail')}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <a
            href="/login"
            className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
          >
            {t('backToLogin')}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {t('email')}
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            placeholder={t('emailPlaceholder')}
          />
        </div>

        {error && <div className="text-sm text-red-600 dark:text-red-400">{error}</div>}

        <button
          type="submit"
          disabled={loading}
          className="flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          {loading ? t('sending') : t('sendResetEmail')}
        </button>

        <div className="text-center">
          <a
            href="/login"
            className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
          >
            {t('backToLogin')}
          </a>
        </div>
      </form>
    </div>
  );
}
