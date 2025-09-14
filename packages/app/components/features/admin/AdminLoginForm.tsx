'use client';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface AdminLoginFormProps {
  onSuccess?: () => void;
  redirectTo?: string;
}

export function AdminLoginForm({ onSuccess, redirectTo = '/admin' }: AdminLoginFormProps) {
  const t = useTranslations('admin.login');
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Sign in with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password,
      );
      const user = userCredential.user;

      // Get ID token to check admin claims
      const idTokenResult = await user.getIdTokenResult();
      const isAdmin = !!idTokenResult.claims.admin;

      if (!isAdmin) {
        throw new Error(t('errors.notAdmin'));
      }

      // Success callback
      onSuccess?.();

      // Redirect to admin dashboard
      router.push(redirectTo);
    } catch (err) {
      console.error('Admin login error:', err);

      if (err instanceof Error) {
        // Handle specific Firebase Auth errors
        if (typeof (err as any).code === 'string') {
          switch ((err as any).code) {
            case 'auth/user-not-found':
            case 'auth/wrong-password':
            case 'auth/invalid-credential':
              setError(t('errors.invalidCredentials'));
              break;
            case 'auth/too-many-requests':
              setError(t('errors.tooManyAttempts'));
              break;
            case 'auth/network-request-failed':
              setError(t('errors.networkError'));
              break;
            default:
              setError(err.message);
          }
        } else {
          setError(err.message);
        }
      } else {
        setError(t('errors.unknown'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md space-y-8 p-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            {t('title')}
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{t('subtitle')}</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                {t('form.email')}
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                placeholder={t('form.emailPlaceholder')}
                disabled={loading}
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="password" className="sr-only">
                {t('form.password')}
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleInputChange}
                placeholder={t('form.passwordPlaceholder')}
                disabled={loading}
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 sm:text-sm"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
              <div className="text-sm text-red-700 dark:text-red-400">{error}</div>
            </div>
          )}

          <Button
            type="submit"
            disabled={loading || !formData.email || !formData.password}
            className="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            {loading && <Spinner className="mr-2 h-4 w-4" />}
            {loading ? t('form.signingIn') : t('form.signIn')}
          </Button>
        </form>

        <div className="text-center text-xs text-gray-500 dark:text-gray-400">
          {t('securityNotice')}
        </div>
      </Card>
    </div>
  );
}

export default AdminLoginForm;
