'use client';

import Image from 'next/image';

import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';

interface FeaturedImageSectionProps {
  imageUrl: string;
  imageUploading: boolean;
  onImageChange: (url: string) => void;
  onImageUpload: (file: File) => void;
}

export function FeaturedImageSection({
  imageUrl,
  imageUploading,
  onImageChange,
  onImageUpload,
}: FeaturedImageSectionProps): JSX.Element {
  const t = useTranslations('admin.editor');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  return (
    <Card className="p-4">
      <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
        {t('featuredImage.title')}
      </h3>

      {imageUrl ? (
        <div className="space-y-3">
          <Image
            src={imageUrl}
            alt="Featured"
            width={800}
            height={400}
            className="w-full rounded-lg"
            style={{ objectFit: 'cover' }}
          />
          <Button
            onClick={() => onImageChange('')}
            className="w-full bg-red-600 text-white hover:bg-red-700"
          >
            {t('featuredImage.remove')}
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <Input
            type="text"
            value={imageUrl}
            onChange={(e) => onImageChange(e.target.value)}
            placeholder={t('featuredImage.urlPlaceholder')}
          />
          <div className="text-center text-gray-500 dark:text-gray-400">
            {t('featuredImage.or')}
          </div>
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              disabled={imageUploading}
              title={t('featuredImage.upload')}
              aria-label={t('featuredImage.upload')}
            />
            <Button
              disabled={imageUploading}
              className="w-full bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {imageUploading ? t('featuredImage.uploading') : t('featuredImage.upload')}
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
