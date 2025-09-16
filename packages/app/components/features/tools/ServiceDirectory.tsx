'use client';

import { useMemo, useState } from 'react';

import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/Button';

// Interfaz REAL según PROYEC_PARTE3.MD - Colección professionalServices
interface Service {
  id: string;
  name: string;
  description: string;
  website: string;
  logoUrl: string;
  specialties: string[];
  isVerified: boolean;
}

interface ServiceDirectoryProps {
  services: Service[];
}

export function ServiceDirectory({ services }: ServiceDirectoryProps) {
  const t = useTranslations('tools.serviceDirectory');

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);

  const allServices = services;

  // Obtener especialidades únicas
  const specialties = useMemo(() => {
    const uniqueSpecialties = new Set<string>();
    allServices.forEach((service) => {
      service.specialties.forEach((specialty) => uniqueSpecialties.add(specialty));
    });
    return Array.from(uniqueSpecialties).sort();
  }, [allServices]);

  // Filtrar servicios
  const filteredServices = useMemo(() => {
    return allServices.filter((service) => {
      const matchesSearch =
        searchTerm === '' ||
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.specialties.some((specialty) =>
          specialty.toLowerCase().includes(searchTerm.toLowerCase()),
        );

      const matchesSpecialty =
        selectedSpecialty === 'all' || service.specialties.includes(selectedSpecialty);

      const matchesVerified = !showVerifiedOnly || service.isVerified;

      return matchesSearch && matchesSpecialty && matchesVerified;
    });
  }, [allServices, searchTerm, selectedSpecialty, showVerifiedOnly]);

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
        <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">{t('title')}</h1>

        <p className="mb-8 text-gray-600 dark:text-gray-400">{t('description')}</p>

        {/* Filtros */}
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Búsqueda */}
          <div>
            <label
              htmlFor="search"
              className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {t('search')}
            </label>
            <input
              id="search"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Especialidad */}
          <div>
            <label
              htmlFor="specialty"
              className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {t('specialty')}
            </label>
            <select
              id="specialty"
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">{t('allSpecialties')}</option>
              {specialties.map((specialty) => (
                <option key={specialty} value={specialty}>
                  {specialty}
                </option>
              ))}
            </select>
          </div>

          {/* Solo verificados */}
          <div className="flex items-center">
            <label className="flex cursor-pointer items-center space-x-2">
              <input
                type="checkbox"
                checked={showVerifiedOnly}
                onChange={(e) => setShowVerifiedOnly(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">{t('verifiedOnly')}</span>
            </label>
          </div>
        </div>

        {/* Resultados */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {t('results')} ({filteredServices.length})
            </h2>
          </div>

          {filteredServices.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-gray-600 dark:text-gray-400">{t('noResults')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {filteredServices.map((service) => (
                <div
                  key={service.id}
                  className="rounded-lg bg-gray-50 p-6 transition-shadow hover:shadow-lg dark:bg-gray-700"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-2">
                        {service.logoUrl && (
                          <img
                            src={service.logoUrl}
                            alt={`${service.name} logo`}
                            className="h-8 w-8 rounded-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        )}
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {service.name}
                        </h3>
                        {service.isVerified && (
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
                            {t('verified')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="mb-4 text-gray-700 dark:text-gray-300">{service.description}</p>

                  <div className="mb-4 flex flex-wrap gap-2">
                    {service.specialties.map((specialty) => (
                      <span
                        key={specialty}
                        className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>

                  <Button
                    onClick={() => window.open(service.website, '_blank')}
                    className="w-full bg-blue-600 text-white hover:bg-blue-700"
                  >
                    {t('visitWebsite')}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Información adicional */}
        <div className="mt-8 rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900/20">
          <p className="text-sm text-yellow-700 dark:text-yellow-300">
            <strong>{t('disclaimer.title')}:</strong> {t('disclaimer.text')}
          </p>
        </div>
      </div>
    </div>
  );
}
