'use client';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';
import { auth } from '@/lib/firebase';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface HomepageContent {
  bannerImageUrl: string;
  bannerTitle_es: string;
  bannerTitle_en: string;
  bannerSubtitle_es: string;
  bannerSubtitle_en: string;
  bannerButtonText_es: string;
  bannerButtonText_en: string;
  bannerButtonLink: string;
}

export default function AdminHomepagePage() {
  const t = useTranslations('admin.homepage');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState<HomepageContent>({
    bannerImageUrl: '',
    bannerTitle_es: '',
    bannerTitle_en: '',
    bannerSubtitle_es: '',
    bannerSubtitle_en: '',
    bannerButtonText_es: '',
    bannerButtonText_en: '',
    bannerButtonLink: '',
  });

  useEffect(() => {
    const loadHomepageContent = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/admin/homepage', {
          headers: {
            Authorization: `Bearer ${await getAuthToken()}`,
          },
        });

        if (!response.ok) {
          throw new Error('Error al cargar contenido de homepage');
        }

        const data = await response.json();
        setFormData(data.content || formData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    loadHomepageContent();
  }, []);

  const getAuthToken = async () => {
    const user = auth.currentUser;
    if (!user) throw new Error('No autenticado');
    return await user.getIdToken();
  };

  const handleInputChange = (field: keyof HomepageContent, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (success) setSuccess(null);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setError(null);

      const uploadFormData = new FormData();
      uploadFormData.append('image', file);

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${await getAuthToken()}`,
        },
        body: uploadFormData,
      });

      if (!response.ok) {
        throw new Error('Error al subir imagen');
      }

      const data = await response.json();
      handleInputChange('bannerImageUrl', data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al subir imagen');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const response = await fetch('/api/admin/homepage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${await getAuthToken()}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Error al guardar contenido');
      }

      setSuccess('Contenido guardado exitosamente');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Gestión de Contenido de la Home
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Edita el banner principal y contenido de la página de inicio
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Banner Image */}
        <Card className="p-6">
          <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
            Imagen del Banner
          </h2>

          {formData.bannerImageUrl && (
            <div className="mb-4">
              <Image
                src={formData.bannerImageUrl}
                alt="Banner actual"
                width={400}
                height={200}
                className="rounded-lg object-cover"
              />
            </div>
          )}

          <div className="flex items-center space-x-4">
            <Input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
            {uploading && <Spinner size="sm" />}
          </div>
        </Card>

        {/* Content in Spanish */}
        <Card className="p-6">
          <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
            Contenido en Español
          </h2>
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Título Principal
              </label>
              <Input
                value={formData.bannerTitle_es}
                onChange={(e) => handleInputChange('bannerTitle_es', e.target.value)}
                placeholder="Título del banner en español"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Subtítulo
              </label>
              <Input
                value={formData.bannerSubtitle_es}
                onChange={(e) => handleInputChange('bannerSubtitle_es', e.target.value)}
                placeholder="Subtítulo en español"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Texto del Botón
              </label>
              <Input
                value={formData.bannerButtonText_es}
                onChange={(e) => handleInputChange('bannerButtonText_es', e.target.value)}
                placeholder="Texto del botón en español"
              />
            </div>
          </div>
        </Card>

        {/* Content in English */}
        <Card className="p-6">
          <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
            Contenido en Inglés
          </h2>
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Main Title
              </label>
              <Input
                value={formData.bannerTitle_en}
                onChange={(e) => handleInputChange('bannerTitle_en', e.target.value)}
                placeholder="Banner title in English"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Subtitle
              </label>
              <Input
                value={formData.bannerSubtitle_en}
                onChange={(e) => handleInputChange('bannerSubtitle_en', e.target.value)}
                placeholder="Subtitle in English"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Button Text
              </label>
              <Input
                value={formData.bannerButtonText_en}
                onChange={(e) => handleInputChange('bannerButtonText_en', e.target.value)}
                placeholder="Button text in English"
              />
            </div>
          </div>
        </Card>

        {/* Button Link */}
        <Card className="p-6">
          <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
            Enlace del Botón
          </h2>
          <Input
            value={formData.bannerButtonLink}
            onChange={(e) => handleInputChange('bannerButtonLink', e.target.value)}
            placeholder="/recuperacion"
          />
        </Card>

        {/* Messages */}
        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {success && (
          <div className="rounded-md border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
            <p className="text-green-800 dark:text-green-200">{success}</p>
          </div>
        )}

        {/* Submit */}
        <div className="flex justify-end">
          <Button type="submit" disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </div>
      </form>
    </div>
  );
}
