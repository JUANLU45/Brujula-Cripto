import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { ServiceDirectory } from '@/components/features/tools/ServiceDirectory';
import { db } from '@/lib/firebase';

interface ServiciosPageProps {
  params: Promise<{ locale: 'es' | 'en' }>;
}

// Interfaz REAL según PROYEC_PARTE3.MD
interface ProfessionalService {
  id: string;
  name: string;
  website: string;
  description: string;
  logoUrl: string;
  specialties: string[];
  isVerified: boolean;
}

// Función para obtener servicios REALES de Firestore
async function getProfessionalServices(): Promise<ProfessionalService[]> {
  try {
    const servicesCollection = collection(db, 'professionalServices');
    const servicesQuery = query(servicesCollection, orderBy('name', 'asc'));

    const querySnapshot = await getDocs(servicesQuery);

    const services: ProfessionalService[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      services.push({
        id: doc.id,
        name: data.name || '',
        website: data.website || '',
        description: data.description || '',
        logoUrl: data.logoUrl || '',
        specialties: data.specialties || [],
        isVerified: data.isVerified || false,
      });
    });

    return services;
  } catch (error) {
    console.error('Error fetching professional services:', error);
    return []; // Retorna array vacío en caso de error
  }
}

// METADATA SEO SEGÚN PROYEC_PARTE2.MD
export async function generateMetadata(props: ServiciosPageProps): Promise<Metadata> {
  const params = await props.params;
  const { locale } = params;

  return {
    title:
      locale === 'es'
        ? 'Directorio de Servicios Profesionales | Brújula Cripto'
        : 'Professional Services Directory | Crypto Compass',
    description:
      locale === 'es'
        ? 'Encuentra servicios profesionales especializados en recuperación y seguridad de criptomonedas. Servicios verificados y confiables.'
        : 'Find professional services specialized in cryptocurrency recovery and security. Verified and trusted services.',
    keywords: [
      'servicios crypto',
      'recuperación criptomonedas',
      'profesionales blockchain',
      'crypto recovery services',
      'blockchain professionals',
      'cryptocurrency security',
    ],
    openGraph: {
      type: 'website',
      siteName: 'Brújula Cripto',
      images: ['/images/tools/services-hero.jpg'],
    },
    alternates: {
      canonical: `/herramientas/servicios`,
      languages: {
        es: '/es/herramientas/servicios',
        en: '/en/herramientas/servicios',
      },
    },
  };
}

export default async function ServiciosPage(props: ServiciosPageProps) {
  const params = await props.params;
  const { locale } = params;
  const t = await getTranslations('tools.serviceDirectory');

  // Obtener datos REALES de Firestore
  const professionalServices = await getProfessionalServices();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <ServiceDirectory services={professionalServices} />
    </div>
  );
}
