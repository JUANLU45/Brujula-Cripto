import { CheckCircle2, ChevronRight, Shield, TrendingUp, Users } from 'lucide-react';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { SignUpForm } from '@/components/features/auth/SignUpForm';
import { Card } from '@/components/ui/Card';
import { generateSEOMetadata } from '@/lib/seo';

interface PageProps {
  params: Promise<{ locale: 'es' | 'en' }>;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  return generateSEOMetadata({
    locale: params.locale,
    titleKey: 'auth.signup.seo.title',
    descriptionKey: 'auth.signup.seo.description',
  });
}

export default async function RegisterPage({ params: _params }: PageProps): Promise<JSX.Element> {
  const t = await getTranslations('auth.signup');

  const benefits = [
    {
      icon: Shield,
      text: t('benefits.recoveryTools'),
    },
    {
      icon: TrendingUp,
      text: t('benefits.realTimeAnalysis'),
    },
    {
      icon: Users,
      text: t('benefits.expertSupport'),
    },
    {
      icon: CheckCircle2,
      text: t('benefits.privacySecurity'),
    },
  ];

  return (
    <div className="from-background to-muted min-h-[calc(100vh-4rem)] bg-gradient-to-br">
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-foreground mb-4 text-3xl font-bold lg:text-4xl">{t('title')}</h1>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg">{t('subtitle')}</p>
          </div>

          <div className="grid items-start gap-8 lg:grid-cols-2">
            {/* Benefits Section */}
            <div className="space-y-6">
              <div>
                <h2 className="text-foreground mb-4 text-xl font-semibold">{t('whyChoose')}</h2>
                <div className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <benefit.icon className="text-primary h-5 w-5" />
                      </div>
                      <span className="text-foreground font-medium">{benefit.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Disclaimer */}
              <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20">
                <div className="p-4">
                  <h3 className="mb-2 font-semibold text-amber-800 dark:text-amber-200">
                    {t('disclaimer.title')}
                  </h3>
                  <p className="mb-3 text-sm leading-relaxed text-amber-700 dark:text-amber-300">
                    {t('disclaimer.content')}
                  </p>
                  <button className="text-sm font-medium text-amber-800 hover:underline dark:text-amber-200">
                    {t('disclaimer.readFull')}
                  </button>
                </div>
              </Card>

              {/* Premium CTA */}
              <Card className="border-primary/20 bg-primary/5">
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-foreground mb-1 font-semibold">
                        {t('premium.question')}
                      </h3>
                      <p className="text-muted-foreground text-sm">{t('premium.viewPlans')}</p>
                    </div>
                    <ChevronRight className="text-primary h-5 w-5" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Registration Form */}
            <div>
              <Card>
                <div className="p-6">
                  <SignUpForm />
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
