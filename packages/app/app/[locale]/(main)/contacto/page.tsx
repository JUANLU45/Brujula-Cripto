import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import ContactFAQ from '@/components/features/contact/ContactFAQ';
import ContactForm from '@/components/features/contact/ContactForm';
import { generateSEOMetadata } from '@/lib/seo';

// PÁGINA DE CONTACTO - CUMPLE DOCUMENTACIÓN PAGINAS.MD
// Formulario: Campos para nombre, email y mensaje, con un botón para enviar.
// Comportamiento: Muestra un mensaje si hay errores y envía el formulario al soporte.

interface ContactPageProps {
  params: Promise<{
    locale: 'es' | 'en';
  }>;
}

// GENERACIÓN DE METADATA SEO - CUMPLE DOCUMENTACIÓN PROYEC_PARTE2.MD
export async function generateMetadata(props: ContactPageProps): Promise<Metadata> {
  const params = await props.params;
  return generateSEOMetadata({
    locale: params.locale,
    titleKey: 'contact.page.title',
    descriptionKey: 'contact.page.subtitle',
  });
}

export default async function ContactPage({
  params: _params,
}: ContactPageProps): Promise<JSX.Element> {
  const t = await getTranslations('contact');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* CONTAINER PRINCIPAL - MOBILE-FIRST RESPONSIVE */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        {/* HEADER DE PÁGINA */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
            {t('page.title')}
          </h1>
          <p className="mx-auto max-w-3xl text-lg text-gray-600 dark:text-gray-400 sm:text-xl">
            {t('page.subtitle')}
          </p>
        </div>

        {/* LAYOUT GRID RESPONSIVO */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          {/* COLUMNA 1: FORMULARIO DE CONTACTO */}
          <div className="order-1">
            <ContactForm className="w-full" />
          </div>

          {/* COLUMNA 2: FAQ / PREGUNTAS FRECUENTES */}
          <div className="order-2">
            <ContactFAQ className="w-full" />
          </div>
        </div>

        {/* SECCIÓN ADICIONAL: INFORMACIÓN DE CONTACTO DIRECTA */}
        <div className="mt-16 rounded-2xl bg-white p-8 shadow-lg dark:bg-gray-800 sm:p-12">
          <div className="text-center">
            <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
              {t('direct.title')}
            </h2>
            <p className="mb-8 text-lg text-gray-600 dark:text-gray-400">{t('direct.subtitle')}</p>

            {/* GRID DE CONTACTOS DIRECTOS */}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {/* SOPORTE TÉCNICO */}
              <div className="rounded-lg bg-blue-50 p-6 dark:bg-blue-900/20">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.712 4.33a9.027 9.027 0 011.652 1.306c.51.51.944 1.064 1.306 1.652M16.712 4.33l-3.448 4.138m3.448-4.138a9.027 9.027 0 00-9.424 0M19.67 7.288l-4.138 3.448m4.138-3.448a9.027 9.027 0 010 9.424m-4.138-3.448l-3.448 4.138m0 0a9.027 9.027 0 01-9.424 0m9.424 0l-3.448-3.448M12.264 7.288l-3.448-4.138m0 0a9.027 9.027 0 00-1.652 1.306c-.51.51-.944 1.064-1.306 1.652m0 0l4.138 3.448"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                  {t('direct.support.title')}
                </h3>
                <p className="mb-4 text-gray-600 dark:text-gray-400">
                  {t('direct.support.description')}
                </p>
                <a
                  href="mailto:soporte@brujulacripto.com"
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  soporte@brujulacripto.com
                </a>
              </div>

              {/* INFORMACIÓN GENERAL */}
              <div className="rounded-lg bg-green-50 p-6 dark:bg-green-900/20">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-white">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                  {t('direct.info.title')}
                </h3>
                <p className="mb-4 text-gray-600 dark:text-gray-400">
                  {t('direct.info.description')}
                </p>
                <a
                  href="mailto:info@brujulacripto.com"
                  className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                >
                  info@brujulacripto.com
                </a>
              </div>
            </div>

            {/* TIEMPO DE RESPUESTA */}
            <div className="mt-8 rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium">
                  <span role="img" aria-label="reloj">
                    ⏱️
                  </span>{' '}
                  {t('direct.responseTime.label')}:
                </span>{' '}
                {t('direct.responseTime.value')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
