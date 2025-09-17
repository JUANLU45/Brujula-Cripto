'use client';

import type { Editor } from '@tiptap/react';
import { EditorContent } from '@tiptap/react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface ArticleContentEditorProps {
  language: 'es' | 'en';
  title: string;
  excerpt: string;
  editor: Editor | null;
  loading: boolean;
  onTitleChange: (title: string) => void;
  onExcerptChange: (excerpt: string) => void;
  onGenerateAI: (field: 'title' | 'excerpt' | 'content') => void;
  onInsertImage: (file: File) => void;
}

export function ArticleContentEditor({
  language,
  title,
  excerpt,
  editor,
  loading,
  onTitleChange,
  onExcerptChange,
  onGenerateAI,
  onInsertImage,
}: ArticleContentEditorProps): JSX.Element {
  const t = useTranslations('admin.editor');

  const handleImageInsert = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (file) {
      onInsertImage(file);
    }
  };

  return (
    <div className="space-y-4 p-6">
      {/* Title */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          {t('fields.title')}
        </label>
        <div className="flex space-x-2">
          <Input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder={t('placeholders.title')}
            className="flex-1"
          />
          <Button
            onClick={() => onGenerateAI('title')}
            disabled={loading}
            className="bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50"
          >
            {t('ai.generate')}
          </Button>
        </div>
      </div>

      {/* Excerpt */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          {t('fields.excerpt')}
        </label>
        <div className="flex space-x-2">
          <Input
            type="text"
            value={excerpt}
            onChange={(e) => onExcerptChange(e.target.value)}
            placeholder={t('placeholders.excerpt')}
            className="flex-1"
          />
          <Button
            onClick={() => onGenerateAI('excerpt')}
            disabled={loading}
            className="bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50"
          >
            {t('ai.generate')}
          </Button>
        </div>
      </div>

      {/* Content Editor */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('fields.content')}
          </label>
          <div className="flex space-x-2">
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageInsert}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                title={t('editor.insertImage')}
                aria-label={t('editor.insertImage')}
              />
              <Button className="bg-gray-600 text-white hover:bg-gray-700">
                {t('editor.insertImage')}
              </Button>
            </div>
            <Button
              onClick={() => onGenerateAI('content')}
              disabled={loading}
              className="bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50"
            >
              {t('ai.generateContent')}
            </Button>
          </div>
        </div>
        <div className="min-h-[400px] rounded-md border border-gray-300 dark:border-gray-600">
          <EditorContent
            editor={editor}
            className="prose dark:prose-invert max-w-none p-4 focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}
