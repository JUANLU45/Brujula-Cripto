import { PasswordResetForm } from '@/components/features/auth/PasswordResetForm';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

interface PageProps {
  params: Promise<{ locale: 'es' | 'en' }>;
}

// METADATA SEO SEGÚN PROYEC_PARTE2.MD
export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const t = await getTranslations({ locale: params.locale, namespace: 'auth.passwordReset.seo' });

  return {
    title: {
      es: 'Recuperar Contraseña de Cuenta | Brújula Cripto',
      en: 'Account Password Recovery | Crypto Compass',
    }[params.locale],
    description: {
      es: 'Recupera el acceso a tu cuenta de Brújula Cripto. Te enviaremos un enlace seguro para restablecer tu contraseña.',
      en: "Recover access to your Crypto Compass account. We'll send you a secure link to reset your password.",
    }[params.locale],
    keywords: [
      'recuperar contraseña',
      'restablecer contraseña',
      'cuenta',
      'acceso',
      'email',
      'recover password',
      'reset password',
      'account',
      'access',
    ],
    openGraph: {
      title: {
        es: 'Recuperar Contraseña de Cuenta | Brújula Cripto',
        en: 'Account Password Recovery | Crypto Compass',
      }[params.locale],
      description: {
        es: 'Recupera el acceso a tu cuenta de forma segura.',
        en: 'Recover access to your account securely.',
      }[params.locale],
      type: 'website',
      locale: params.locale,
      siteName: 'Brújula Cripto',
      images: ['/images/auth/password-recovery.jpg'],
    },
    twitter: {
      card: 'summary_large_image',
      title: {
        es: 'Recuperar Contraseña de Cuenta | Brújula Cripto',
        en: 'Account Password Recovery | Crypto Compass',
      }[params.locale],
      description: {
        es: 'Recupera el acceso a tu cuenta de forma segura.',
        en: 'Recover access to your account securely.',
      }[params.locale],
    },
    alternates: {
      canonical: `/${params.locale}/recuperar-password`,
      languages: {
        es: '/es/recuperar-password',
        en: '/en/recuperar-password',
      },
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function RecuperarPasswordPage(props: PageProps) {
  const params = await props.params;
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* CABECERA CENTRALIZADA CON IDIOMAS */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-blue-100 p-3 dark:bg-blue-900/20">
            <svg
              className="h-10 w-10 text-blue-600 dark:text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
              />
            </svg>
          </div>

          <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            {
              {
                es: 'Recuperar Contraseña',
                en: 'Reset Password',
              }[params.locale]
            }
          </h1>

          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {
              {
                es: 'Te enviaremos un enlace para restablecer tu contraseña',
                en: "We'll send you a link to reset your password",
              }[params.locale]
            }
          </p>
        </div>

        {/* FORMULARIO CENTRALIZADO */}
        <div className="mt-8">
          <PasswordResetForm />
        </div>

        {/* ENLACES DE NAVEGACIÓN CENTRALIZADOS */}
        <div className="text-center text-sm">
          <p className="text-gray-600 dark:text-gray-400">
            {
              {
                es: '¿Recordaste tu contraseña?',
                en: 'Remembered your password?',
              }[params.locale]
            }{' '}
            <a
              href={`/${params.locale}/login`}
              className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              {
                {
                  es: 'Iniciar sesión',
                  en: 'Sign in',
                }[params.locale]
              }
            </a>
          </p>

          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {
              {
                es: '¿No tienes cuenta?',
                en: "Don't have an account?",
              }[params.locale]
            }{' '}
            <a
              href={`/${params.locale}/registro`}
              className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              {
                {
                  es: 'Registrarse',
                  en: 'Sign up',
                }[params.locale]
              }
            </a>
          </p>
        </div>

        {/* DESCARGO DE RESPONSABILIDAD LEGAL */}
        <div className="mt-8 rounded-lg bg-amber-50 p-4 dark:bg-amber-900/20">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-amber-800 dark:text-amber-200">
                {
                  {
                    es: 'Aviso de Seguridad',
                    en: 'Security Notice',
                  }[params.locale]
                }
              </h3>
              <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">
                {
                  {
                    es: 'Por tu seguridad, verifica siempre que estés en el sitio oficial de Brújula Cripto antes de ingresar datos personales.',
                    en: "For your security, always verify you're on the official Crypto Compass website before entering personal information.",
                  }[params.locale]
                }{' '}
                <a
                  href={`/${params.locale}/legal/descargo-responsabilidad`}
                  className="font-medium underline hover:no-underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {
                    {
                      es: 'Leer más',
                      en: 'Read more',
                    }[params.locale]
                  }
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
